/**
 * NovaTech Shopping Cart State & Management
 * Uses LocalStorage for seamless client-side state persistence
 */

class CartManager {
  constructor() {
    this.storageKey = 'novatech_cart';
    this.couponKey = 'novatech_coupon';
    this.validCoupons = {
      'NOVA20': { percent: 20, desc: '20% Special Discount' },
      'WELCOME10': { percent: 10, desc: '10% New Customer Discount' },
      'TECH50': { fixed: 50, desc: '$50 Flash Voucher' }
    };
  }

  getItems() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read cart from localStorage', e);
      return [];
    }
  }

  saveItems(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.updateBadge();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: this.getTotalCount() } }));
  }

  addItem(product, quantity = 1) {
    const items = this.getItems();
    const existingIndex = items.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      const newQty = items[existingIndex].quantity + quantity;
      items[existingIndex].quantity = product.stock ? Math.min(newQty, product.stock) : newQty;
    } else {
      items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        quantity: Math.max(1, quantity)
      });
    }

    this.saveItems(items);
    if (window.showToast) {
      window.showToast(`Added "${product.title}" to cart!`, 'success');
    }
  }

  updateQuantity(productId, quantity) {
    let items = this.getItems();
    const qty = parseInt(quantity, 10);
    
    if (qty <= 0) {
      this.removeItem(productId);
      return;
    }

    items = items.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: item.stock ? Math.min(qty, item.stock) : qty };
      }
      return item;
    });

    this.saveItems(items);
  }

  removeItem(productId) {
    let items = this.getItems();
    items = items.filter(item => item.id !== productId);
    this.saveItems(items);
    if (window.showToast) {
      window.showToast('Item removed from cart', 'info');
    }
  }

  clearCart() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.couponKey);
    this.updateBadge();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: 0 } }));
  }

  getTotalCount() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getAppliedCoupon() {
    try {
      const data = localStorage.getItem(this.couponKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  applyCoupon(code) {
    const normalized = code.trim().toUpperCase();
    if (this.validCoupons[normalized]) {
      const coupon = { code: normalized, ...this.validCoupons[normalized] };
      localStorage.setItem(this.couponKey, JSON.stringify(coupon));
      return { success: true, coupon };
    }
    return { success: false, message: 'Invalid coupon code. Try "NOVA20" or "WELCOME10".' };
  }

  removeCoupon() {
    localStorage.removeItem(this.couponKey);
  }

  calculateTotals() {
    const subtotal = this.getSubtotal();
    const appliedCoupon = this.getAppliedCoupon();
    let discount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.percent) {
        discount = (subtotal * appliedCoupon.percent) / 100;
      } else if (appliedCoupon.fixed) {
        discount = Math.min(subtotal, appliedCoupon.fixed);
      }
    }

    const shipping = subtotal > 0 && (subtotal - discount) > 150 ? 0 : (subtotal > 0 ? 15.00 : 0);
    const tax = subtotal > 0 ? (subtotal - discount) * 0.08 : 0; // 8% sales tax
    const total = Math.max(0, subtotal - discount + shipping + tax);

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      appliedCoupon
    };
  }

  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getTotalCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'grid' : 'none';
    });
  }
}

window.cartManager = new CartManager();
