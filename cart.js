// ═══════════════════════════════════════════════════════════
// HUMANITEE — Persistent Shopping Cart System
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ─── Configuration ─────────────────────────────────────────
  const STORAGE_KEY = 'humanitee_cart';
  const CART_VERSION = '1.0';

  // ─── Cart State ────────────────────────────────────────────
  class Cart {
    constructor() {
      this.items = [];
      this.loadFromStorage();
    }

    // ─── Storage Operations ──────────────────────────────────
    
    loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (!stored) {
          this.items = [];
          return;
        }

        const data = JSON.parse(stored);
        
        // Validate data structure
        if (!data || !Array.isArray(data.items)) {
          console.warn('Cart: Invalid storage data, resetting cart');
          this.items = [];
          this.saveToStorage();
          return;
        }

        // Version check (future-proofing)
        if (data.version && data.version !== CART_VERSION) {
          console.warn('Cart: Version mismatch, resetting cart');
          this.items = [];
          this.saveToStorage();
          return;
        }

        this.items = data.items;
        
      } catch (error) {
        console.error('Cart: Failed to load from storage', error);
        this.items = [];
      }
    }

    saveToStorage() {
      try {
        const data = {
          version: CART_VERSION,
          items: this.items,
          timestamp: Date.now()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        
      } catch (error) {
        console.error('Cart: Failed to save to storage', error);
        
        // Handle quota exceeded error
        if (error.name === 'QuotaExceededError') {
          alert('Cart storage is full. Please remove some items.');
        }
      }
    }

    // ─── Cart Operations ─────────────────────────────────────

    addItem(product) {
      try {
        // Validate product data
        if (!product || !product.id || !product.name) {
          console.error('Cart: Invalid product data', product);
          return false;
        }

        // Check if item already exists
        const existingIndex = this.items.findIndex(item => 
          item.id === product.id && 
          item.color === product.color && 
          item.size === product.size
        );

        if (existingIndex !== -1) {
          // Update quantity if item exists
          this.items[existingIndex].quantity = (this.items[existingIndex].quantity || 1) + 1;
        } else {
          // Add new item
          this.items.push({
            id: product.id,
            name: product.name,
            price: product.price || 34.00,
            color: product.color || 'Default',
            size: product.size || 'M',
            image: product.image || 'ORIGIN.webp',
            quantity: 1,
            addedAt: Date.now()
          });
        }

        this.saveToStorage();
        this.updateUI();
        return true;
        
      } catch (error) {
        console.error('Cart: Failed to add item', error);
        return false;
      }
    }

    removeItem(index) {
      try {
        if (index >= 0 && index < this.items.length) {
          this.items.splice(index, 1);
          this.saveToStorage();
          this.updateUI();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Cart: Failed to remove item', error);
        return false;
      }
    }

    updateQuantity(index, quantity) {
      try {
        if (index >= 0 && index < this.items.length) {
          const newQty = parseInt(quantity);
          
          if (newQty <= 0) {
            return this.removeItem(index);
          }
          
          if (newQty > 99) {
            alert('Maximum quantity is 99 per item');
            return false;
          }
          
          this.items[index].quantity = newQty;
          this.saveToStorage();
          this.updateUI();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Cart: Failed to update quantity', error);
        return false;
      }
    }

    clearCart() {
      try {
        this.items = [];
        this.saveToStorage();
        this.updateUI();
        return true;
      } catch (error) {
        console.error('Cart: Failed to clear cart', error);
        return false;
      }
    }

    // ─── Cart Info ───────────────────────────────────────────

    getTotalItems() {
      return this.items.reduce((total, item) => total + (item.quantity || 1), 0);
    }

    getTotalPrice() {
      return this.items.reduce((total, item) => {
        const price = parseFloat(item.price) || 34.00;
        const quantity = item.quantity || 1;
        return total + (price * quantity);
      }, 0);
    }

    isEmpty() {
      return this.items.length === 0;
    }

    getItems() {
      return [...this.items]; // Return copy to prevent external modification
    }

    // ─── UI Updates ─────────────────────────────────────────

    updateUI() {
      // Update cart badge
      this.updateCartBadge();
      
      // Update cart display if open
      this.updateCartDisplay();
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: {
          itemCount: this.getTotalItems(),
          totalPrice: this.getTotalPrice(),
          items: this.getItems()
        }
      }));
    }

    updateCartBadge() {
      const badge = document.getElementById('cartBadge');
      if (badge) {
        const count = this.getTotalItems();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    }

    updateCartDisplay() {
      const cartItemsContainer = document.getElementById('cartItems');
      const cartEmpty = document.getElementById('cartEmpty');
      const cartTotal = document.getElementById('cartTotal');
      const cartContent = document.getElementById('cartContent');

      if (!cartItemsContainer) return;

      if (this.isEmpty()) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
      }

      if (cartEmpty) cartEmpty.style.display = 'none';
      if (cartContent) cartContent.style.display = 'block';

      // Render cart items
      cartItemsContainer.innerHTML = this.items.map((item, index) => `
        <div class="cart-item" data-index="${index}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-variant">${item.color} / ${item.size}</p>
            <p class="cart-item-price">£${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <div class="cart-item-actions">
            <div class="cart-item-quantity">
              <button class="qty-btn qty-minus" data-index="${index}">−</button>
              <input 
                type="number" 
                class="qty-input" 
                value="${item.quantity}" 
                min="1" 
                max="99"
                data-index="${index}"
              >
              <button class="qty-btn qty-plus" data-index="${index}">+</button>
            </div>
            <button class="cart-item-remove" data-index="${index}">×</button>
          </div>
        </div>
      `).join('');

      // Update total
      if (cartTotal) {
        cartTotal.textContent = `£${this.getTotalPrice().toFixed(2)}`;
      }

      // Attach event listeners
      this.attachCartEventListeners();
    }

    attachCartEventListeners() {
      // Remove buttons
      document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          this.removeItem(index);
        });
      });

      // Quantity minus
      document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          const currentQty = this.items[index].quantity || 1;
          this.updateQuantity(index, currentQty - 1);
        });
      });

      // Quantity plus
      document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          const currentQty = this.items[index].quantity || 1;
          this.updateQuantity(index, currentQty + 1);
        });
      });

      // Quantity input
      document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
          const index = parseInt(e.target.dataset.index);
          const newQty = parseInt(e.target.value);
          this.updateQuantity(index, newQty);
        });
      });
    }

    // ─── Cart Modal Control ──────────────────────────────────

    openCart() {
      const cartModal = document.getElementById('cartModal');
      if (cartModal) {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.updateCartDisplay();
      }
    }

    closeCart() {
      const cartModal = document.getElementById('cartModal');
      if (cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  }

  // ─── Initialize Cart ───────────────────────────────────────
  
  const cart = new Cart();
  
  // Make cart globally accessible
  window.humaniteeCart = cart;

  // ─── DOM Event Listeners ───────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    
    // Update UI on load
    cart.updateUI();

    // Cart button - open cart
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        cart.openCart();
      });
    }

    // Close cart modal
    const cartClose = document.getElementById('cartClose');
    if (cartClose) {
      cartClose.addEventListener('click', () => {
        cart.closeCart();
      });
    }

    // Close cart overlay
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
          cart.closeCart();
        }
      });
    }

    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
          cart.clearCart();
        }
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (cart.isEmpty()) {
          alert('Your cart is empty');
          return;
        }
        // Navigate to checkout/order page
        window.location.href = 'order.html';
      });
    }

    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.product-card .btn, .add-to-cart-btn');
    
    addToCartBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get product data from button's parent card
        const productCard = btn.closest('.product-card') || btn.closest('[data-product]');
        
        if (!productCard) {
          console.error('Cart: Product card not found');
          return;
        }

        // Extract product data
        const product = {
          id: productCard.dataset.productId || `product-${Date.now()}`,
          name: productCard.dataset.productName || 
                productCard.querySelector('h3')?.textContent || 
                'HUMANITEE T-Shirt',
          price: parseFloat(productCard.dataset.productPrice) || 34.00,
          color: productCard.dataset.productColor || 'Default',
          size: productCard.dataset.productSize || 'M',
          image: productCard.dataset.productImage || 
                 productCard.querySelector('img')?.src || 
                 'ORIGIN.webp'
        };

        // Add to cart
        const success = cart.addItem(product);
        
        if (success) {
          // Visual feedback
          const originalText = btn.textContent;
          const originalBg = btn.style.background;
          
          btn.textContent = 'Added ✓';
          btn.style.background = '#2e7d32';
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = originalBg;
          }, 1500);
        } else {
          alert('Failed to add item to cart');
        }
      });
    });
  });

  // ─── Storage Event Listener (Sync across tabs) ────────────
  
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      cart.loadFromStorage();
      cart.updateUI();
    }
  });

  // ─── Export for modules ────────────────────────────────────
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Cart;
  }

})();
