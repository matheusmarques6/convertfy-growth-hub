/**
 * Plans Service
 * Handles API calls for subscription plans and billing
 * Created: 2025-12-07
 */

import api from "./api";

export interface Plan {
  plan_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: string[];
  limits: {
    contacts: number;
    messages: number;
    instances: number;
    chatbots: number;
    flows: number;
    agents: number;
    broadcasts: number;
  };
  is_popular: boolean;
  trial_days: number;
  display_order: number;
}

export interface CurrentPlan {
  plan_id: string;
  plan_name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limits: Record<string, number>;
  subscription_status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_start: string | null;
  trial_end: string | null;
}

export interface Invoice {
  invoice_id: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded" | "canceled";
  invoice_url: string;
  invoice_pdf: string;
  payment_method: string;
  paid_at: string;
  due_date: string;
  created_at: string;
  error_message?: string;
  plan_name?: string;
}

export interface BillingHistory {
  invoices: Invoice[];
  total: number;
  limit: number;
  offset: number;
}

export interface ContactSalesData {
  message: string;
  company?: string;
  phone?: string;
}

export interface CheckoutSession {
  session_id: string;
  checkout_url: string;
}

export const plansService = {
  /**
   * Get all available plans
   */
  async getPlans(): Promise<Plan[]> {
    const response = await api.get("/plans");
    return response.data.data;
  },

  /**
   * Get specific plan by ID
   */
  async getPlanById(planId: string): Promise<Plan> {
    const response = await api.get(`/plans/${planId}`);
    return response.data.data;
  },

  /**
   * Get current user's plan and subscription details
   */
  async getCurrentPlan(): Promise<CurrentPlan> {
    const response = await api.get("/plans/user/current");
    return response.data.data;
  },

  /**
   * Subscribe to a plan (creates Stripe checkout session)
   */
  async subscribe(planId: string): Promise<CheckoutSession> {
    const response = await api.post(`/plans/subscribe/${planId}`);
    return response.data.data;
  },

  /**
   * Cancel current subscription
   */
  async cancelSubscription(): Promise<{ message: string }> {
    const response = await api.post("/plans/cancel");
    return response.data;
  },

  /**
   * Reactivate canceled subscription
   */
  async reactivateSubscription(): Promise<{ message: string }> {
    const response = await api.post("/plans/reactivate");
    return response.data;
  },

  /**
   * Get billing history
   */
  async getBillingHistory(
    limit: number = 50,
    offset: number = 0
  ): Promise<BillingHistory> {
    const response = await api.get("/plans/billing/history", {
      params: { limit, offset },
    });
    return response.data.data;
  },

  /**
   * Contact sales for enterprise plan
   */
  async contactSales(data: ContactSalesData): Promise<{ message: string }> {
    const response = await api.post("/plans/contact-sales", data);
    return response.data;
  },

  /**
   * Get invoice details
   */
  async getInvoice(invoiceId: string): Promise<Invoice> {
    const response = await api.get(`/payments/invoice/${invoiceId}`);
    return response.data.data;
  },

  /**
   * Retry failed payment
   */
  async retryPayment(invoiceId: string): Promise<{ message: string; status: string }> {
    const response = await api.post(`/payments/retry/${invoiceId}`);
    return {
      message: response.data.message,
      status: response.data.data.status
    };
  },

  /**
   * Get checkout session details
   */
  async getCheckoutSession(sessionId: string): Promise<any> {
    const response = await api.get(`/payments/session/${sessionId}`);
    return response.data.data;
  },
};

export default plansService;
