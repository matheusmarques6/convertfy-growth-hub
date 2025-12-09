/**
 * Base Platform Service
 * Abstract class for e-commerce platform integrations
 * Created: 2025-12-07
 */

class BasePlatformService {
  constructor(store) {
    this.store = store;
    this.platformName = 'base';
  }

  /**
   * Validate store credentials
   * @returns {Promise<{valid: boolean, error?: string}>}
   */
  async validateCredentials() {
    throw new Error('validateCredentials must be implemented by subclass');
  }

  /**
   * Get store information
   * @returns {Promise<object>}
   */
  async getStoreInfo() {
    throw new Error('getStoreInfo must be implemented by subclass');
  }

  /**
   * Sync products from platform
   * @param {number} limit - Number of products to sync
   * @returns {Promise<Array>}
   */
  async syncProducts(limit = 100) {
    throw new Error('syncProducts must be implemented by subclass');
  }

  /**
   * Get product by ID
   * @param {string} productId - External product ID
   * @returns {Promise<object>}
   */
  async getProduct(productId) {
    throw new Error('getProduct must be implemented by subclass');
  }

  /**
   * Setup webhooks on the platform
   * @param {string} callbackUrl - Webhook callback URL
   * @returns {Promise<Array>}
   */
  async setupWebhooks(callbackUrl) {
    throw new Error('setupWebhooks must be implemented by subclass');
  }

  /**
   * Delete webhooks from the platform
   * @returns {Promise<boolean>}
   */
  async deleteWebhooks() {
    throw new Error('deleteWebhooks must be implemented by subclass');
  }

  /**
   * Verify webhook signature
   * @param {object} payload - Webhook payload
   * @param {string} signature - Webhook signature
   * @returns {boolean}
   */
  verifyWebhookSignature(payload, signature) {
    throw new Error('verifyWebhookSignature must be implemented by subclass');
  }

  /**
   * Parse webhook event
   * @param {object} payload - Webhook payload
   * @returns {object} Normalized event data
   */
  parseWebhookEvent(payload) {
    throw new Error('parseWebhookEvent must be implemented by subclass');
  }

  /**
   * Get abandoned carts
   * @returns {Promise<Array>}
   */
  async getAbandonedCarts() {
    throw new Error('getAbandonedCarts must be implemented by subclass');
  }

  /**
   * Get order by ID
   * @param {string} orderId - External order ID
   * @returns {Promise<object>}
   */
  async getOrder(orderId) {
    throw new Error('getOrder must be implemented by subclass');
  }

  /**
   * Normalize product data to standard format
   * @param {object} rawProduct - Raw product data from platform
   * @returns {object} Normalized product
   */
  normalizeProduct(rawProduct) {
    return {
      external_id: rawProduct.id?.toString(),
      title: rawProduct.title || rawProduct.name,
      description: rawProduct.description || rawProduct.body_html,
      price: rawProduct.price || rawProduct.variants?.[0]?.price || 0,
      currency: this.store.settings?.currency || 'BRL',
      image_url: rawProduct.image?.src || rawProduct.images?.[0]?.src,
      sku: rawProduct.sku || rawProduct.variants?.[0]?.sku,
      stock_quantity: rawProduct.inventory_quantity || rawProduct.stock_quantity || 0,
      is_active: rawProduct.status === 'active' || rawProduct.published || true,
      metadata: JSON.stringify(rawProduct),
    };
  }

  /**
   * Normalize order data to standard format
   * @param {object} rawOrder - Raw order data from platform
   * @returns {object} Normalized order
   */
  normalizeOrder(rawOrder) {
    return {
      external_id: rawOrder.id?.toString(),
      order_number: rawOrder.order_number || rawOrder.number || rawOrder.id,
      customer_email: rawOrder.email || rawOrder.customer?.email,
      customer_phone: rawOrder.phone || rawOrder.customer?.phone,
      customer_name: rawOrder.customer?.name || `${rawOrder.customer?.first_name || ''} ${rawOrder.customer?.last_name || ''}`.trim(),
      total: rawOrder.total_price || rawOrder.total || rawOrder.amount,
      currency: rawOrder.currency || this.store.settings?.currency || 'BRL',
      status: rawOrder.financial_status || rawOrder.status,
      items: rawOrder.line_items || rawOrder.items || [],
      created_at: rawOrder.created_at,
      metadata: JSON.stringify(rawOrder),
    };
  }

  /**
   * Normalize cart data to standard format
   * @param {object} rawCart - Raw cart data from platform
   * @returns {object} Normalized cart
   */
  normalizeCart(rawCart) {
    return {
      external_id: rawCart.id?.toString() || rawCart.token,
      customer_email: rawCart.email || rawCart.customer?.email,
      customer_phone: rawCart.phone || rawCart.customer?.phone,
      customer_name: rawCart.customer?.name,
      total: rawCart.total_price || rawCart.subtotal_price || 0,
      currency: rawCart.currency || this.store.settings?.currency || 'BRL',
      cart_url: rawCart.abandoned_checkout_url || rawCart.cart_url,
      items: rawCart.line_items || rawCart.items || [],
      abandoned_at: rawCart.updated_at || rawCart.abandoned_at,
      metadata: JSON.stringify(rawCart),
    };
  }

  /**
   * Extract customer contact info
   * @param {object} data - Customer data
   * @returns {object} Contact info
   */
  extractContactInfo(data) {
    // Try to extract phone number
    let phone = data.phone || data.customer?.phone || data.billing_address?.phone;

    // Clean phone number (remove non-numeric characters)
    if (phone) {
      phone = phone.replace(/\D/g, '');

      // Add country code if missing (assume Brazil)
      if (phone.length === 11 && !phone.startsWith('55')) {
        phone = '55' + phone;
      }
    }

    return {
      name: data.customer?.name || data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Cliente',
      email: data.email || data.customer?.email,
      phone: phone,
    };
  }
}

module.exports = BasePlatformService;
