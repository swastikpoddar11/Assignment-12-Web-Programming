/**
 * NovaTech Shared Core JavaScript
 * Handles navigation, mobile menu, toast notifications, and shared UI helpers
 */

// Helper to format currency
function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

// Global Toast Notification System
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error' || type === 'danger') icon = '⚠️';
  if (type === 'cart') icon = '🛍️';

  toast.innerHTML = `
    <span>${icon}</span>
    <span style="flex:1;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

window.showToast = showToast;
window.formatCurrency = formatCurrency;

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
  // Update header cart badge
  if (window.cartManager) {
    window.cartManager.updateBadge();
  }

  // Update auth status
  if (window.authManager) {
    window.authManager.updateUI();
  }

  // Header scroll shadow effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '72px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#ffffff';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid var(--border)';
        navLinks.style.boxShadow = 'var(--shadow-lg)';
      }
    });
  }
});
