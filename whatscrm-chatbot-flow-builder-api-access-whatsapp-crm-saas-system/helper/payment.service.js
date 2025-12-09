/**
 * Payment Service
 * Handles Stripe integration for subscription payments
 * Created: 2025-12-07
 */

const Stripe = require("stripe");
const db = require("../database/dbpromise");
const randomstring = require("randomstring");

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  /**
   * Create or retrieve Stripe customer
   * @param {string} userUid - User UID
   * @param {string} email - User email
   * @param {string} name - User name
   * @returns {Promise<string>} Stripe customer ID
   */
  async getOrCreateStripeCustomer(userUid, email, name) {
    try {
      // Check if user already has a Stripe customer ID
      const [users] = await db.execute(
        "SELECT stripe_customer_id FROM users WHERE uid = ?",
        [userUid]
      );

      if (users[0]?.stripe_customer_id) {
        return users[0].stripe_customer_id;
      }

      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          user_uid: userUid,
        },
      });

      // Save customer ID to database
      await db.execute(
        "UPDATE users SET stripe_customer_id = ? WHERE uid = ?",
        [customer.id, userUid]
      );

      return customer.id;
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      throw error;
    }
  }

  /**
   * Create Stripe checkout session
   * @param {string} userUid - User UID
   * @param {string} planId - Plan ID
   * @param {string} successUrl - Success redirect URL
   * @param {string} cancelUrl - Cancel redirect URL
   * @returns {Promise<object>} Checkout session
   */
  async createCheckoutSession(userUid, planId, successUrl, cancelUrl) {
    try {
      // Get user details
      const [users] = await db.execute(
        "SELECT email, name FROM users WHERE uid = ?",
        [userUid]
      );

      if (!users[0]) {
        throw new Error("User not found");
      }

      const user = users[0];

      // Get plan details
      const [plans] = await db.execute(
        "SELECT * FROM plans WHERE plan_id = ? AND is_active = 1",
        [planId]
      );

      if (!plans[0]) {
        throw new Error("Plan not found or inactive");
      }

      const plan = plans[0];

      // Get or create Stripe customer
      const customerId = await this.getOrCreateStripeCustomer(
        userUid,
        user.email,
        user.name
      );

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: plan.stripe_price_id,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          user_uid: userUid,
          plan_id: planId,
        },
        subscription_data: {
          trial_period_days: plan.trial_days > 0 ? plan.trial_days : undefined,
          metadata: {
            user_uid: userUid,
            plan_id: planId,
          },
        },
      });

      return session;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }

  /**
   * Handle successful checkout
   * @param {object} session - Stripe checkout session
   */
  async handleCheckoutComplete(session) {
    try {
      const userUid = session.metadata.user_uid;
      const planId = session.metadata.plan_id;
      const stripeSubscriptionId = session.subscription;

      // Get subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(
        stripeSubscriptionId
      );

      // Create subscription record
      const subscriptionId = randomstring.generate(16);

      await db.execute(
        `INSERT INTO subscriptions (
          subscription_id, user_uid, plan_id, status,
          current_period_start, current_period_end,
          stripe_subscription_id, stripe_customer_id,
          trial_start, trial_end
        ) VALUES (?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))`,
        [
          subscriptionId,
          userUid,
          planId,
          subscription.status,
          subscription.current_period_start,
          subscription.current_period_end,
          stripeSubscriptionId,
          session.customer,
          subscription.trial_start || null,
          subscription.trial_end || null,
        ]
      );

      // Update user subscription info
      await db.execute(
        `UPDATE users SET
          current_plan_id = ?,
          subscription_status = ?,
          subscription_id = ?,
          stripe_customer_id = ?
        WHERE uid = ?`,
        [planId, subscription.status, subscriptionId, session.customer, userUid]
      );

      console.log(`Subscription created for user ${userUid}: ${subscriptionId}`);
    } catch (error) {
      console.error("Error handling checkout complete:", error);
      throw error;
    }
  }

  /**
   * Handle invoice paid
   * @param {object} invoice - Stripe invoice
   */
  async handleInvoicePaid(invoice) {
    try {
      const subscriptionId = invoice.subscription;

      // Get subscription from database
      const [subscriptions] = await db.execute(
        "SELECT subscription_id, user_uid FROM subscriptions WHERE stripe_subscription_id = ?",
        [subscriptionId]
      );

      if (!subscriptions[0]) {
        console.error("Subscription not found for invoice:", invoice.id);
        return;
      }

      const sub = subscriptions[0];
      const invoiceId = randomstring.generate(16);

      // Create invoice record
      await db.execute(
        `INSERT INTO invoices (
          invoice_id, subscription_id, user_uid, amount, currency,
          status, invoice_url, invoice_pdf, stripe_invoice_id,
          stripe_payment_intent_id, payment_method, paid_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?))`,
        [
          invoiceId,
          sub.subscription_id,
          sub.user_uid,
          invoice.amount_paid / 100, // Convert from cents
          invoice.currency.toUpperCase(),
          "paid",
          invoice.hosted_invoice_url,
          invoice.invoice_pdf,
          invoice.id,
          invoice.payment_intent,
          invoice.payment_method_types?.[0] || "card",
          invoice.status_transitions.paid_at,
        ]
      );

      console.log(`Invoice ${invoiceId} marked as paid`);
    } catch (error) {
      console.error("Error handling invoice paid:", error);
      throw error;
    }
  }

  /**
   * Handle invoice payment failed
   * @param {object} invoice - Stripe invoice
   */
  async handleInvoicePaymentFailed(invoice) {
    try {
      const subscriptionId = invoice.subscription;

      // Get subscription from database
      const [subscriptions] = await db.execute(
        "SELECT subscription_id, user_uid FROM subscriptions WHERE stripe_subscription_id = ?",
        [subscriptionId]
      );

      if (!subscriptions[0]) {
        console.error("Subscription not found for invoice:", invoice.id);
        return;
      }

      const sub = subscriptions[0];

      // Check if invoice already exists
      const [existingInvoices] = await db.execute(
        "SELECT id, attempt_count FROM invoices WHERE stripe_invoice_id = ?",
        [invoice.id]
      );

      if (existingInvoices[0]) {
        // Update existing invoice
        await db.execute(
          `UPDATE invoices SET
            status = 'failed',
            attempt_count = attempt_count + 1,
            last_attempt_at = NOW(),
            error_message = ?
          WHERE stripe_invoice_id = ?`,
          [invoice.last_finalization_error?.message || "Payment failed", invoice.id]
        );
      } else {
        // Create new invoice record
        const invoiceId = randomstring.generate(16);
        await db.execute(
          `INSERT INTO invoices (
            invoice_id, subscription_id, user_uid, amount, currency,
            status, invoice_url, stripe_invoice_id,
            stripe_payment_intent_id, attempt_count, last_attempt_at,
            error_message
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
          [
            invoiceId,
            sub.subscription_id,
            sub.user_uid,
            invoice.amount_due / 100,
            invoice.currency.toUpperCase(),
            "failed",
            invoice.hosted_invoice_url,
            invoice.id,
            invoice.payment_intent,
            invoice.attempt_count || 1,
            invoice.last_finalization_error?.message || "Payment failed",
          ]
        );
      }

      // Update subscription status to past_due
      await db.execute(
        "UPDATE subscriptions SET status = 'past_due' WHERE stripe_subscription_id = ?",
        [subscriptionId]
      );

      await db.execute(
        "UPDATE users SET subscription_status = 'past_due' WHERE subscription_id = ?",
        [sub.subscription_id]
      );

      console.log(`Invoice payment failed for subscription ${sub.subscription_id}`);
    } catch (error) {
      console.error("Error handling invoice payment failed:", error);
      throw error;
    }
  }

  /**
   * Handle subscription updated
   * @param {object} subscription - Stripe subscription
   */
  async handleSubscriptionUpdated(subscription) {
    try {
      await db.execute(
        `UPDATE subscriptions SET
          status = ?,
          current_period_start = FROM_UNIXTIME(?),
          current_period_end = FROM_UNIXTIME(?),
          cancel_at_period_end = ?
        WHERE stripe_subscription_id = ?`,
        [
          subscription.status,
          subscription.current_period_start,
          subscription.current_period_end,
          subscription.cancel_at_period_end ? 1 : 0,
          subscription.id,
        ]
      );

      // Update user subscription status
      const [subs] = await db.execute(
        "SELECT subscription_id, user_uid FROM subscriptions WHERE stripe_subscription_id = ?",
        [subscription.id]
      );

      if (subs[0]) {
        await db.execute(
          "UPDATE users SET subscription_status = ? WHERE uid = ?",
          [subscription.status, subs[0].user_uid]
        );
      }

      console.log(`Subscription updated: ${subscription.id}`);
    } catch (error) {
      console.error("Error handling subscription updated:", error);
      throw error;
    }
  }

  /**
   * Handle subscription deleted/canceled
   * @param {object} subscription - Stripe subscription
   */
  async handleSubscriptionDeleted(subscription) {
    try {
      await db.execute(
        `UPDATE subscriptions SET
          status = 'canceled',
          canceled_at = NOW()
        WHERE stripe_subscription_id = ?`,
        [subscription.id]
      );

      // Get subscription to update user
      const [subs] = await db.execute(
        "SELECT subscription_id, user_uid FROM subscriptions WHERE stripe_subscription_id = ?",
        [subscription.id]
      );

      if (subs[0]) {
        // Downgrade to free plan
        await db.execute(
          `UPDATE users SET
            current_plan_id = 'free',
            subscription_status = 'canceled'
          WHERE uid = ?`,
          [subs[0].user_uid]
        );
      }

      console.log(`Subscription canceled: ${subscription.id}`);
    } catch (error) {
      console.error("Error handling subscription deleted:", error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   * @param {string} subscriptionId - Subscription ID (from database)
   * @returns {Promise<boolean>}
   */
  async cancelSubscription(subscriptionId) {
    try {
      // Get Stripe subscription ID
      const [subscriptions] = await db.execute(
        "SELECT stripe_subscription_id, user_uid FROM subscriptions WHERE subscription_id = ?",
        [subscriptionId]
      );

      if (!subscriptions[0]) {
        throw new Error("Subscription not found");
      }

      const sub = subscriptions[0];

      // Cancel at period end (don't cancel immediately)
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at_period_end: true,
      });

      // Update database
      await db.execute(
        "UPDATE subscriptions SET cancel_at_period_end = 1 WHERE subscription_id = ?",
        [subscriptionId]
      );

      return true;
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  }

  /**
   * Reactivate canceled subscription
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<boolean>}
   */
  async reactivateSubscription(subscriptionId) {
    try {
      const [subscriptions] = await db.execute(
        "SELECT stripe_subscription_id FROM subscriptions WHERE subscription_id = ? AND cancel_at_period_end = 1",
        [subscriptionId]
      );

      if (!subscriptions[0]) {
        throw new Error("Subscription not found or not set to cancel");
      }

      // Reactivate subscription
      await stripe.subscriptions.update(subscriptions[0].stripe_subscription_id, {
        cancel_at_period_end: false,
      });

      // Update database
      await db.execute(
        "UPDATE subscriptions SET cancel_at_period_end = 0 WHERE subscription_id = ?",
        [subscriptionId]
      );

      return true;
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
