/* =====================================================
   THE SAMOSA WALA — Main JavaScript
   ===================================================== */

/* ===================================================
   OFFERS DATA
   ---------------------------------------------------
   DEVELOPER NOTE:
   To add a new offer, simply add a new object inside
   the `offers` array below. Each object should have:
     - title:       The offer headline (string)
     - description: Short details about the offer (string)
     - icon:        An emoji to display on the card (string)
     - tag:         Badge label like "Today Only" (string)

   Example:
   {
     title: "Free Lassi on Orders Above ₹100",
     description: "Get a complimentary Lassi with every order above ₹100.",
     icon: "🍶",
     tag: "Weekend Special"
   }
   ===================================================== */
const offers = [
  {
    title: "2 follower 1 free samosa",
    description: "Follow our Instagram page with 2 account and get 1 free samosa",
    icon: "🥟",
    tag: "Limited Time"
  },
  {
    title: "Unlimited samosa for class 10th and 12th students",
    description: "Score above 90% in board exams and get a chance to eat unlimited samosa",
    icon: "🌀",
    tag: "limited time"
  },
  /*{
    title: "Combo Deal – Samosa + Cold Drink",
    description: "Get 2 Samosas + 1 Cold Drink at a special combo price. Best value snack pack!",
    icon: "🤝",
    tag: "Combo Offer"
  },
  {
    title: "Family Pack – 12 Samosa at ₹100",
    description: "Feed the whole family! A dozen hot samosas for just ₹100. Call to pre-order.",
    icon: "👨‍👩‍👧‍👦",
    tag: "Family Deal"
  }*/
];

/* Render offer cards into the DOM */
function renderOffers() {
  const grid = document.getElementById('offersGrid');
  if (!grid) return;

  grid.innerHTML = '';

  offers.forEach((offer, index) => {
    const card = document.createElement('div');
    card.classList.add('offer-card');
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
      <div class="offer-icon">${offer.icon}</div>
      <h3>${offer.title}</h3>
      <p>${offer.description}</p>
      <span class="offer-tag">${offer.tag}</span>
    `;
    grid.appendChild(card);
  });
}


/* ===================================================
   NAVBAR — Scroll & Hamburger Toggle
   =================================================== */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navAnchors = navLinks ? navLinks.querySelectorAll('a') : [];

/* Sticky navbar appearance on scroll */
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* Highlight active nav link based on scroll position */
  setActiveLink();
});

/* Hamburger open/close for mobile */
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
}

/* Close nav when a link is clicked (mobile) */
navAnchors.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* Active link highlight by scroll */
function setActiveLink() {
  const sections = document.querySelectorAll('section[id], .hero[id]');
  let currentSection = '';

  sections.forEach(sec => {
    const top = sec.offsetTop - 90;
    if (window.scrollY >= top) {
      currentSection = sec.getAttribute('id');
    }
  });

  navAnchors.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}


/* ===================================================
   MENU TABS
   =================================================== */
const tabBtns     = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-tab');

    /* Deactivate all */
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    /* Activate clicked */
    btn.classList.add('active');
    const activeTab = document.getElementById(`tab-${target}`);
    if (activeTab) activeTab.classList.add('active');
  });
});


/* ===================================================
   SMOOTH SCROLL — for older browsers that don't
   natively support scroll-behavior: smooth
   =================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70; // Height of fixed navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ===================================================
   INTERSECTION OBSERVER — Fade-in animations
   for sections as they enter the viewport
   =================================================== */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

/* Observe cards & items for scroll animations */
function observeElements() {
  const selectors = [
    '.popular-card',
    '.offer-card',
    '.gallery-item',
    '.menu-item',
    '.contact-card',
    '.about-container',
    '.stat'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
      fadeObserver.observe(el);
    });
  });
}

/* When elements become visible, animate them in */
const visibleStyle = document.createElement('style');
visibleStyle.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(visibleStyle);


/* ===================================================
   GALLERY — Lightbox (simple click-to-zoom)
   =================================================== */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item img');

  /* Create lightbox overlay */
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,0.92); align-items:center; justify-content:center;
    cursor:zoom-out; padding:20px;
  `;
  const lbImg = document.createElement('img');
  lbImg.style.cssText = 'max-width:90vw; max-height:88vh; border-radius:12px; box-shadow:0 20px 60px rgba(0,0,0,0.6);';
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position:absolute; top:20px; right:24px;
    background:none; border:none; color:white; font-size:2.5rem;
    cursor:pointer; line-height:1;
  `;
  lightbox.appendChild(lbImg);
  lightbox.appendChild(closeBtn);
  document.body.appendChild(lightbox);

  items.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}


/* ===================================================
   INIT — Run everything on DOM ready
   =================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderOffers();
  observeElements();
  initGalleryLightbox();
  setActiveLink();

  console.log(
    '%c🥟 The Samosa Wala — Website Loaded!',
    'color: #FF6B1A; font-size: 16px; font-weight: bold;'
  );
  console.log(
    '%cDeveloper Tips:\n' +
    '• To add offers: edit the `offers` array in script.js\n' +
    '• To change hero image: update .hero background-image in style.css\n' +
    '• To update menu: edit the HTML menu-item blocks in index.html\n' +
    '• To update contact: search for DEVELOPER NOTE in index.html',
    'color: #8A7060; font-size: 12px;'
  );
});


/* =====================================================
   SAMOSA WALA — CART & ORDER SYSTEM
   ===================================================== */
const SW_WA   = "918770993147";
const SW_SHOP = "The Samosa Wala";
const SW_SITE = "thesamosawala.com";
let swCart = [];

function swSaveCart() {
  localStorage.setItem('sw_cart', JSON.stringify(swCart));
}
function swLoadCart() {
  try { const s = localStorage.getItem('sw_cart'); if (s) swCart = JSON.parse(s); }
  catch(e) { swCart = []; }
}

/* Price extract — sirf PEHLA number lena hai */
function swExtractPrice(priceStr) {
  const match = priceStr.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

function swToast(msg) {
  let t = document.getElementById('sw-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'sw-toast'; t.className = 'sw-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function swUpdateBadge() {
  const count = swCart.reduce((s,i) => s + i.qty, 0);
  const b = document.getElementById('swCartCount');
  if (!b) return;
  b.textContent = count;
  b.classList.toggle('visible', count > 0);
}

function swAddToCart(el) {
  const product  = el.dataset.product;
  const price    = el.dataset.price;
  const desc     = el.dataset.desc;
  const priceNum = swExtractPrice(price);
  const existing = swCart.find(i => i.product === product);
  if (existing) { existing.qty++; }
  else { swCart.push({ product, price, priceNum, desc, qty: 1, note: '' }); }
  swSaveCart();
  swUpdateBadge();
  swToast(product + ' added to cart!');
}

function swOrderNow(el) {
  const product = el.dataset.product;
  const price   = el.dataset.price;
  const old = document.getElementById('sw-order-modal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'sw-order-modal';
  modal.innerHTML = `
    <div class="sw-modal-backdrop"></div>
    <div class="sw-modal-box">
      <button class="sw-modal-close">&times;</button>
      <div class="sw-modal-tag">Place Order</div>
      <div class="sw-modal-name">${product}</div>
      <div class="sw-modal-price">${price}</div>
      <div class="sw-modal-note-label">Special Instructions (optional)</div>
      <textarea class="sw-modal-note" id="swModalNote" rows="2" placeholder="e.g. Extra chutney, kam mirch..."></textarea>
      <div class="sw-modal-divider"></div>
      <div class="sw-modal-note-label" style="margin-bottom:6px;"><i class="fa fa-map-marker-alt" style="color:var(--orange);margin-right:5px;"></i>Delivery Details</div>
      <input type="text" class="sw-modal-field" id="swModalName" placeholder="Your Name *" maxlength="60" />
      <input type="tel" class="sw-modal-field" id="swModalPhone" placeholder="Phone Number *" maxlength="15" />
      <textarea class="sw-modal-field" id="swModalAddress" rows="2" placeholder="Delivery Address *" maxlength="200"></textarea>
      <button class="sw-modal-wa-btn" id="swModalWaBtn">
        <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Order via WhatsApp
      </button>
    </div>`;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('sw-modal-open')));

  function closeModal() {
    modal.classList.remove('sw-modal-open');
    document.body.style.overflow = '';
    setTimeout(() => modal.remove(), 300);
  }

  modal.querySelector('.sw-modal-backdrop').addEventListener('click', closeModal);
  modal.querySelector('.sw-modal-close').addEventListener('click', closeModal);
modal.querySelector('#swModalWaBtn').addEventListener('click', function() {
    const note    = (document.getElementById('swModalNote')?.value || '').trim();
    const name    = (document.getElementById('swModalName')?.value || '').trim();
    const phone   = (document.getElementById('swModalPhone')?.value || '').trim();
    const address = (document.getElementById('swModalAddress')?.value || '').trim();

    if (!name)    { swToast('Please enter your name!'); document.getElementById('swModalName')?.focus(); return; }
    if (!phone)   { swToast('Please enter your phone number!'); document.getElementById('swModalPhone')?.focus(); return; }
    if (!address) { swToast('Please enter your delivery address!'); document.getElementById('swModalAddress')?.focus(); return; }

    const lines = [
      'Hello ' + SW_SHOP + '!', '',
      'I want to order:', '',
      '• ' + product + ' — ' + price,
      note ? '  Note: ' + note : null,
      '', '---',
      'Order by: ' + name,
      'Phone: ' + phone,
      'Delivery Address: ' + address,
      '', 'Please confirm my order!',
      '', '(Sent from ' + SW_SITE + ')'
    ].filter(l => l !== null).join('\n');
    window.open('https://wa.me/' + SW_WA + '?text=' + encodeURIComponent(lines), '_blank');
    closeModal();
  });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', esc); }
  });
}

/* ── Cart Drawer ── */
function swOpenCart() {
  swRenderCart();
  document.getElementById('sw-cart-drawer').classList.add('open');
  document.getElementById('sw-cart-backdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function swCloseCart() {
  document.getElementById('sw-cart-drawer').classList.remove('open');
  document.getElementById('sw-cart-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}

function swRenderCart() {
  const itemsEl  = document.getElementById('swCartItems');
  const footerEl = document.getElementById('swCartFooter');
  const totalEl  = document.getElementById('swCartTotal');
  if (!itemsEl) return;

  if (swCart.length === 0) {
    itemsEl.innerHTML = '<div class="sw-cart-empty">Cart is empty!<br><small>Add items to get started</small></div>';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (footerEl) footerEl.style.display = 'block';
  const total = swCart.reduce((s,i) => s + i.priceNum * i.qty, 0);
  if (totalEl) totalEl.textContent = '\u20B9' + total;

  itemsEl.innerHTML = swCart.map((item, idx) => `
    <div class="sw-cart-item">
      <div class="sw-ci-top">
        <div class="sw-ci-name">${item.product}</div>
        <div class="sw-ci-price">${item.price}</div>
        <button class="sw-ci-remove" data-idx="${idx}">&times;</button>
      </div>
      <div class="sw-ci-qty">
        <button class="sw-qty-btn" data-idx="${idx}" data-delta="-1">&#8722;</button>
        <span>${item.qty}</span>
        <button class="sw-qty-btn" data-idx="${idx}" data-delta="1">&#43;</button>
        <span class="sw-ci-subtotal">= \u20B9${item.priceNum * item.qty}</span>
      </div>
      <div class="sw-ci-note-label">Special instructions</div>
      <textarea class="sw-ci-note" data-idx="${idx}" rows="1" placeholder="e.g. Extra chutney, kam mirch...">${item.note || ''}</textarea>
    </div>`).join('');

  /* Event delegation — render ke baad attach karo */
  itemsEl.querySelectorAll('.sw-ci-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      swCart.splice(parseInt(this.dataset.idx), 1);
      swSaveCart(); swUpdateBadge(); swRenderCart();
    });
  });

  itemsEl.querySelectorAll('.sw-qty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.dataset.idx);
      swCart[idx].qty += parseInt(this.dataset.delta);
      if (swCart[idx].qty <= 0) swCart.splice(idx, 1);
      swSaveCart(); swUpdateBadge(); swRenderCart();
    });
  });

  itemsEl.querySelectorAll('.sw-ci-note').forEach(ta => {
    ta.addEventListener('change', function() {
      const idx = parseInt(this.dataset.idx);
      if (swCart[idx]) { swCart[idx].note = this.value; swSaveCart(); }
    });
  });
}

function swCartOrderWA() {
  if (!swCart.length) { swToast('Cart is empty!'); return; }

  const name    = (document.getElementById('swDeliveryName')?.value || '').trim();
  const phone   = (document.getElementById('swDeliveryPhone')?.value || '').trim();
  const address = (document.getElementById('swDeliveryAddress')?.value || '').trim();

  if (!name)    { swToast('Please enter your name!'); document.getElementById('swDeliveryName')?.focus(); return; }
  if (!phone)   { swToast('Please enter your phone number!'); document.getElementById('swDeliveryPhone')?.focus(); return; }
  if (!address) { swToast('Please enter your delivery address!'); document.getElementById('swDeliveryAddress')?.focus(); return; }

  const total = swCart.reduce((s,i) => s + i.priceNum * i.qty, 0);
  const lines = [
    'Hello ' + SW_SHOP + '!', '',
    'I want to order the following:', '',
    ...swCart.map(i => {
      const base = '• ' + i.product + ' x' + i.qty + ' — ' + i.price + ' each = \u20B9' + (i.priceNum * i.qty);
      return i.note ? base + '\n  Note: ' + i.note : base;
    }),
    '', 'Total: \u20B9' + total,
    '', '---',
    'Order by: ' + name,
    'Phone: ' + phone,
    'Delivery Address: ' + address,
    '', 'Please confirm my order!',
    '', '(Sent from ' + SW_SITE + ')'
  ].join('\n');
  window.open('https://wa.me/' + SW_WA + '?text=' + encodeURIComponent(lines), '_blank');
  swCart = []; swSaveCart(); swUpdateBadge(); swCloseCart();
}
/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  swLoadCart();
  swUpdateBadge();

  /* Cart open */
  const cartBtn = document.getElementById('swCartBtn');
  if (cartBtn) cartBtn.addEventListener('click', swOpenCart);

  /* Cart close — backdrop */
  const backdrop = document.getElementById('sw-cart-backdrop');
  if (backdrop) backdrop.addEventListener('click', swCloseCart);

  /* Cart close — X button (id se dhundho) */
  const closeBtn = document.getElementById('swCartCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', swCloseCart);

  /* WA Order button — id se dhundho */
  const waBtn = document.getElementById('swWaOrderBtn');
  if (waBtn) waBtn.addEventListener('click', swCartOrderWA);
});
