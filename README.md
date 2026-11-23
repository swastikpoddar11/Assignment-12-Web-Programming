# ⚡ NovaTech Online Shopping Platform

A modern, responsive, production-ready e-commerce web application engineered with **HTML5**, **CSS3**, modern **JavaScript (ES6+)**, and **XML**.

---

## 🚀 Architectural Overview

NovaTech demonstrates how traditional XML data standards integrate seamlessly with modern web frontends using native browser XML DOM manipulation (`DOMParser`, `getElementsByTagName`, `getAttribute`, `querySelector`) coupled with `LocalStorage` for resilient client-side state management.

```
WP-LAB-12/
├── index.html              # Home Page (Hero, featured deals, value props, categories)
├── products.html           # Products Catalog (Dynamic XML rendering, filters, search, sort)
├── product-details.html    # Product Details (Specs from XML, stock, gallery, add to cart)
├── cart.html               # Shopping Cart (Quantity stepper, coupon discount, live totals)
├── checkout.html           # Checkout (Multi-step shipping, Card/UPI/COD payment, invoice modal)
├── auth.html               # Login & Register (Dual-tabbed auth, demo credentials helper)
├── contact.html            # Contact & Support (Interactive inquiry form, FAQ accordion)
│
├── data/
│   └── products.xml        # Well-formed XML product catalog with specs & features
│
├── css/
│   └── style.css           # Modern CSS3 design system with custom properties & responsive grid
│
└── js/
    ├── xml-loader.js       # Asynchronous XML fetcher & DOMParser data extraction service
    ├── cart.js             # Shopping cart state manager & coupon calculator via LocalStorage
    ├── auth.js             # Authentication & user session manager
    └── main.js             # Shared navigation, toast notifications & UI helpers
```

---

## 📄 Pages Included

1. **Home Page (`index.html`)**
   - High-impact hero section with gradient typography and value proposition highlights.
   - Dynamic featured tech section populated straight from the XML dataset.
   - Quick category chips and seasonal discount banner.

2. **Products Page (`products.html`)**
   - Loads and renders product cards dynamically from `data/products.xml`.
   - Real-time search query matching across product names, categories, and descriptions.
   - Dynamic sidebar filters: Categories, price range slider ($50 – $1500), and "In Stock Only" toggle.
   - Multi-option sorting (Price: Low to High, Price: High to Low, Highest Rated, Alphabetical A-Z).
   - Live result counter and empty state handler with reset action.

3. **Product Details Page (`product-details.html`)**
   - Reads `?id=PROD-xxx` URL parameter to fetch individual XML `<product>` nodes.
   - Displays high-resolution imagery, star rating breakdowns, and stock availability badge.
   - Extracts and presents bulleted features (`<feature>`) and technical specification tables (`<spec name="...">`).
   - Quantity stepper and "Add to Cart" / "Buy Now" interactive actions.

4. **Shopping Cart Page (`cart.html`)**
   - Itemized table with product thumbnails, titles, unit prices, quantity modifiers, and removal actions.
   - Automated calculation of subtotal, 8% sales tax, and tiered shipping (Free shipping over $150).
   - Promotional coupon code engine supporting coupons:
     - `NOVA20` (20% off)
     - `WELCOME10` (10% off)
     - `TECH50` ($50 voucher)
   - Dynamic cart badge updated synchronously in the navbar across all open pages.

5. **Checkout Page (`checkout.html`)**
   - Step 1: Customer shipping details and contact information.
   - Step 2: Multi-mode payment switcher:
     - 💳 Credit / Debit Card (Card number, MM/YY, CVV, Cardholder name)
     - 📱 UPI / QR Code Transfer
     - 💵 Cash on Delivery (COD)
   - Order review summary card reflecting live cart values.
   - Order confirmation modal with unique generated Order ID (`NT-XXXXXX`) and print receipt capability.

6. **Login / Register Page (`auth.html`)**
   - Sleek tabbed switcher between "Sign In" and "Create Account".
   - 1-Click "Demo Account" credential autofill (`alex@example.com` / `password123`) for effortless testing.
   - Form input validation, password reveal toggles, and live session updates in the header navigation.

7. **Contact Page (`contact.html`)**
   - Direct headquarters address, toll-free phone, and support email channels.
   - Interactive inquiry form with department selection and live 500-character counter.
   - Collapsible interactive FAQ accordion explaining XML catalog architecture, warranty, and security.

---

## 🛠️ XML Data Structure (`data/products.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <metadata>
    <storeName>NovaTech Store</storeName>
    <currency>USD</currency>
    <lastUpdated>2026-11-23</lastUpdated>
  </metadata>
  <categories>
    <category id="audio">Audio &amp; Headphones</category>
    ...
  </categories>
  <products>
    <product id="PROD-101">
      <title>AeroSound ANC Pro Wireless Headphones</title>
      <category>audio</category>
      <price>249.99</price>
      <originalPrice>299.99</originalPrice>
      <rating>4.8</rating>
      <reviewsCount>142</reviewsCount>
      <stock>24</stock>
      <featured>true</featured>
      <badge>Best Seller</badge>
      <image>https://...</image>
      <description>...</description>
      <features>
        <feature>Hybrid Active Noise Cancellation (40dB reduction)</feature>
      </features>
      <specs>
        <spec name="Driver Size">40mm Titanium</spec>
      </specs>
    </product>
  </products>
</catalog>
```

---

## 💡 How to Run & Test

You can run this project in any standard browser:

### Option A: Local Web Server (Recommended)
Using Python or VS Code Live Server:
```bash
# In the project directory:
python -m http.server 8000
```
Then navigate to: `http://localhost:8000/index.html`

### Option B: Direct File Opening
Double-click `index.html` in your file explorer. The `js/xml-loader.js` file includes an automatic embedded XML DOM fallback to ensure 100% functionality even when local browser file security policies (CORS) restrict `fetch()` on `file:///` URLs.
