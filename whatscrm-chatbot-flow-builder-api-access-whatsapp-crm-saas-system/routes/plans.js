/**
 * Plans Routes
 * Handles subscription plans endpoints
 * Created: 2025-12-07
 */

const router = require("express").Router();
const { query } = require("../database/dbpromise.js");
const validateUser = require("../middlewares/user.js");
const paymentService = require("../helper/payment.service.js");

/**
 * GET /api/plans
 * Get all available plans
 * Public route
 */
router.get("/", async (req, res) => {
  try {
    const plans = await query(
      `SELECT
        plan_id, name, description, price, currency, \`interval\`,
        features, limits, is_popular, trial_days, display_order
      FROM plans
      WHERE is_active = 1
      ORDER BY display_order ASC`
    );

    // Parse JSON fields
    const parsedPlans = plans.map((plan) => ({
      ...plan,
      features: JSON.parse(plan.features || "[]"),
      limits: JSON.parse(plan.limits || "{}"),
      price: parseFloat(plan.price),
    }));

    res.json({
      success: true,
      data: parsedPlans,
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching plans",
      error: error.message,
    });
  }
});

/**
 * GET /api/plans/:planId
 * Get specific plan details
 * Public route
 */
router.get("/:planId", async (req, res) => {
  try {
    const { planId } = req.params;

    const plans = await query(
      `SELECT
        plan_id, name, description, price, currency, \`interval\`,
        features, limits, is_popular, trial_days
      FROM plans
      WHERE plan_id = ? AND is_active = 1`,
      [planId]
    );

    if (plans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const plan = {
      ...plans[0],
      features: JSON.parse(plans[0].features || "[]"),
      limits: JSON.parse(plans[0].limits || "{}"),
      price: parseFloat(plans[0].price),
    };

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching plan",
      error: error.message,
    });
  }
});

/**
 * GET /api/plans/user/current
 * Get current user's plan
 * Protected route
 */
router.get("/user/current", validateUser, async (req, res) => {
  try {
    const { uid } = req.user;

    const users = await query(
      `SELECT
        u.current_plan_id, u.subscription_status, u.subscription_id,
        s.current_period_start, s.current_period_end, s.cancel_at_period_end,
        s.trial_start, s.trial_end,
        p.name as plan_name, p.price, p.currency, p.\`interval\`, p.features, p.limits
      FROM users u
      LEFT JOIN subscriptions s ON s.subscription_id = u.subscription_id
      LEFT JOIN plans p ON p.plan_id = u.current_plan_id
      WHERE u.uid = ?`,
      [uid]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    res.json({
      success: true,
      data: {
        plan_id: user.current_plan_id,
        plan_name: user.plan_name,
        price: parseFloat(user.price || 0),
        currency: user.currency,
        interval: user.interval,
        features: JSON.parse(user.features || "[]"),
        limits: JSON.parse(user.limits || "{}"),
        subscription_status: user.subscription_status,
        current_period_start: user.current_period_start,
        current_period_end: user.current_period_end,
        cancel_at_period_end: user.cancel_at_period_end === 1,
        trial_start: user.trial_start,
        trial_end: user.trial_end,
      },
    });
  } catch (error) {
    console.error("Error fetching current plan:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching current plan",
      error: error.message,
    });
  }
});

/**
 * POST /api/plans/subscribe/:planId
 * Subscribe to a plan (creates checkout session)
 * Protected route
 */
router.post("/subscribe/:planId", validateUser, async (req, res) => {
  try {
    const { uid, email, name } = req.user;
    const { planId } = req.params;

    // Check if plan exists
    const plans = await query(
      "SELECT plan_id, stripe_price_id FROM plans WHERE plan_id = ? AND is_active = 1",
      [planId]
    );

    if (plans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found or inactive",
      });
    }

    const plan = plans[0];

    if (!plan.stripe_price_id) {
      return res.status(400).json({
        success: false,
        message: "This plan is not available for online purchase. Please contact sales.",
      });
    }

    // Check if user already has active subscription
    const [existingSubs] = await query(
      "SELECT subscription_id FROM subscriptions WHERE user_uid = ? AND status IN ('active', 'trialing')",
      [uid]
    );

    if (existingSubs) {
      return res.status(400).json({
        success: false,
        message: "You already have an active subscription. Please cancel it first or upgrade.",
      });
    }

    // Create checkout session
    const frontendUrl = process.env.FRONTENDURI || "http://localhost:3000";
    const session = await paymentService.createCheckoutSession(
      uid,
      planId,
      `${frontendUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      `${frontendUrl}/billing/cancel`
    );

    res.json({
      success: true,
      data: {
        session_id: session.id,
        checkout_url: session.url,
      },
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({
      success: false,
      message: "Error creating subscription",
      error: error.message,
    });
  }
});

/**
 * POST /api/plans/cancel
 * Cancel current subscription
 * Protected route
 */
router.post("/cancel", validateUser, async (req, res) => {
  try {
    const { uid } = req.user;

    // Get user's current subscription
    const users = await query(
      "SELECT subscription_id FROM users WHERE uid = ? AND subscription_status IN ('active', 'trialing')",
      [uid]
    );

    if (users.length === 0 || !users[0].subscription_id) {
      return res.status(400).json({
        success: false,
        message: "No active subscription found",
      });
    }

    await paymentService.cancelSubscription(users[0].subscription_id);

    res.json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({
      success: false,
      message: "Error canceling subscription",
      error: error.message,
    });
  }
});

/**
 * POST /api/plans/reactivate
 * Reactivate canceled subscription
 * Protected route
 */
router.post("/reactivate", validateUser, async (req, res) => {
  try {
    const { uid } = req.user;

    const users = await query(
      "SELECT subscription_id FROM users WHERE uid = ?",
      [uid]
    );

    if (users.length === 0 || !users[0].subscription_id) {
      return res.status(400).json({
        success: false,
        message: "No subscription found",
      });
    }

    await paymentService.reactivateSubscription(users[0].subscription_id);

    res.json({
      success: true,
      message: "Subscription reactivated successfully",
    });
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    res.status(500).json({
      success: false,
      message: "Error reactivating subscription",
      error: error.message,
    });
  }
});

/**
 * GET /api/plans/billing/history
 * Get user's billing history
 * Protected route
 */
router.get("/billing/history", validateUser, async (req, res) => {
  try {
    const { uid } = req.user;
    const { limit = 50, offset = 0 } = req.query;

    const invoices = await query(
      `SELECT
        invoice_id, amount, currency, status, invoice_url, invoice_pdf,
        payment_method, paid_at, due_date, created_at
      FROM invoices
      WHERE user_uid = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`,
      [uid, parseInt(limit), parseInt(offset)]
    );

    // Get total count
    const [countResult] = await query(
      "SELECT COUNT(*) as total FROM invoices WHERE user_uid = ?",
      [uid]
    );

    res.json({
      success: true,
      data: {
        invoices: invoices.map((inv) => ({
          ...inv,
          amount: parseFloat(inv.amount),
        })),
        total: countResult.total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Error fetching billing history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching billing history",
      error: error.message,
    });
  }
});

/**
 * POST /api/plans/contact-sales
 * Contact sales for enterprise plan
 * Protected route
 */
router.post("/contact-sales", validateUser, async (req, res) => {
  try {
    const { uid, email, name } = req.user;
    const { message, company, phone } = req.body;

    // TODO: Send email to sales team or save to database
    console.log("Sales contact request:", {
      uid,
      email,
      name,
      company,
      phone,
      message,
    });

    // For now, just return success
    res.json({
      success: true,
      message: "Your request has been sent. Our sales team will contact you soon.",
    });
  } catch (error) {
    console.error("Error sending contact sales:", error);
    res.status(500).json({
      success: false,
      message: "Error sending request",
      error: error.message,
    });
  }
});

module.exports = router;
