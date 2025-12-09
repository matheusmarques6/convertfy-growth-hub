/**
 * Payments Routes
 * Handles Stripe webhooks and payment-related endpoints
 * Created: 2025-12-07
 */

const router = require("express").Router();
const { query } = require("../database/dbpromise.js");
const Stripe = require("stripe");
const paymentService = require("../helper/payment.service.js");
const randomstring = require("randomstring");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * POST /api/payments/webhook
 * Stripe webhook endpoint
 * PUBLIC - No authentication (Stripe signature verification instead)
 */
router.post(
  "/webhook",
  require("express").raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Log webhook event
    const eventId = randomstring.generate(16);
    try {
      await query(
        `INSERT INTO webhook_events (event_id, provider, event_type, event_data, processed)
        VALUES (?, 'stripe', ?, ?, 0)`,
        [eventId, event.type, JSON.stringify(event)]
      );
    } catch (error) {
      console.error("Error logging webhook event:", error);
    }

    // Handle the event
    try {
      switch (event.type) {
        case "checkout.session.completed":
          await paymentService.handleCheckoutComplete(event.data.object);
          break;

        case "invoice.paid":
          await paymentService.handleInvoicePaid(event.data.object);
          break;

        case "invoice.payment_failed":
          await paymentService.handleInvoicePaymentFailed(event.data.object);
          break;

        case "customer.subscription.updated":
          await paymentService.handleSubscriptionUpdated(event.data.object);
          break;

        case "customer.subscription.deleted":
          await paymentService.handleSubscriptionDeleted(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Mark event as processed
      await query(
        "UPDATE webhook_events SET processed = 1, processed_at = NOW() WHERE event_id = ?",
        [eventId]
      );

      res.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);

      // Log error
      await query(
        "UPDATE webhook_events SET error = ?, retry_count = retry_count + 1 WHERE event_id = ?",
        [error.message, eventId]
      );

      // Still return 200 to Stripe to avoid retries for our errors
      res.json({ received: true, error: error.message });
    }
  }
);

/**
 * GET /api/payments/invoice/:invoiceId
 * Get invoice details
 * Protected route
 */
router.get("/invoice/:invoiceId", async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoices = await query(
      `SELECT
        i.invoice_id, i.amount, i.currency, i.status, i.invoice_url,
        i.invoice_pdf, i.payment_method, i.paid_at, i.due_date,
        i.created_at, i.error_message,
        p.name as plan_name
      FROM invoices i
      LEFT JOIN subscriptions s ON s.subscription_id = i.subscription_id
      LEFT JOIN plans p ON p.plan_id = s.plan_id
      WHERE i.invoice_id = ?`,
      [invoiceId]
    );

    if (invoices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const invoice = {
      ...invoices[0],
      amount: parseFloat(invoices[0].amount),
    };

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching invoice",
      error: error.message,
    });
  }
});

/**
 * POST /api/payments/retry/:invoiceId
 * Retry failed payment
 * Protected route
 */
router.post("/retry/:invoiceId", async (req, res) => {
  try {
    const { invoiceId } = req.params;

    // Get invoice
    const invoices = await query(
      "SELECT stripe_invoice_id, status FROM invoices WHERE invoice_id = ?",
      [invoiceId]
    );

    if (invoices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const invoice = invoices[0];

    if (invoice.status !== "failed") {
      return res.status(400).json({
        success: false,
        message: "Invoice is not in failed status",
      });
    }

    if (!invoice.stripe_invoice_id) {
      return res.status(400).json({
        success: false,
        message: "Invoice does not have Stripe invoice ID",
      });
    }

    // Retry payment in Stripe
    const stripeInvoice = await stripe.invoices.pay(invoice.stripe_invoice_id);

    // Update invoice status
    if (stripeInvoice.status === "paid") {
      await query(
        "UPDATE invoices SET status = 'paid', paid_at = NOW() WHERE invoice_id = ?",
        [invoiceId]
      );
    }

    res.json({
      success: true,
      message: "Payment retry initiated",
      data: {
        status: stripeInvoice.status,
      },
    });
  } catch (error) {
    console.error("Error retrying payment:", error);
    res.status(500).json({
      success: false,
      message: "Error retrying payment",
      error: error.message,
    });
  }
});

/**
 * GET /api/payments/session/:sessionId
 * Get checkout session details
 * Protected route
 */
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      success: true,
      data: {
        id: session.id,
        payment_status: session.payment_status,
        status: session.status,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total / 100,
        currency: session.currency,
      },
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching session",
      error: error.message,
    });
  }
});

module.exports = router;
