// ═══════════════════════════════════════════════════════════
// HUMANITEE — Mobile-First JavaScript
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ─── Mobile Menu Toggle ───────────────────────────────────
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      nav.classList.toggle('open');
    });

    // Close menu when clicking a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        nav.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !nav.contains(e.target)) {
        menuBtn.classList.remove('active');
        nav.classList.remove('open');
      }
    });
  }

  // ─── Newsletter Form ──────────────────────────────────────
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');

  if (newsletterForm && newsletterMsg) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!email || !email.includes('@')) {
        newsletterMsg.textContent = 'Please enter a valid email address.';
        newsletterMsg.style.color = '#d32f2f';
        return;
      }

      // Success message
      newsletterMsg.textContent = 'Thanks! You\'ve been added to the list.';
      newsletterMsg.style.color = '#2e7d32';
      emailInput.value = '';

      // Clear message after 3 seconds
      setTimeout(() => {
        newsletterMsg.textContent = '';
      }, 3000);
    });
  }

  // ─── Active Navigation Highlighting ───────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav a');

  function highlightNav() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinksAll.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--color-text)';
      }
    });
  }

  if (sections.length > 0) {
    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Initial call
  }

  // ─── Smooth Scroll Enhancement ────────────────────────────
  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  
  smoothLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const headerOffset = 64; // Header height
        const targetPosition = target.offsetTop - headerOffset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── Add to Cart Buttons ──────────────────────────────────
  const addToCartBtns = document.querySelectorAll('.product-card .btn');
  
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.style.background = '#2e7d32';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 1500);
    });
  });

  // ─── Performance: Lazy Load Images ────────────────────────
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // ─── Scroll to Top on Logo Click ──────────────────────────
  const logo = document.querySelector('.logo');
  
  if (logo) {
    logo.addEventListener('click', (e) => {
      if (logo.getAttribute('href') === '#home') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  // ─── Prevent Layout Shift ──────────────────────────────────
  // Add explicit width/height attributes to images when loaded
  const allImages = document.querySelectorAll('img:not([width])');
  
  allImages.forEach(img => {
    if (img.complete) {
      setImageDimensions(img);
    } else {
      img.addEventListener('load', () => setImageDimensions(img));
    }
  });

  function setImageDimensions(img) {
    if (!img.hasAttribute('width')) {
      img.setAttribute('width', img.naturalWidth);
      img.setAttribute('height', img.naturalHeight);
    }
  }

  // ─── Mini Pop-up ───────────────────────────────────────────
  function showPopup(message) {
    const popup = document.getElementById('miniPopup');
    const popupMessage = document.getElementById('popupMessage');
    const popupOk = document.getElementById('popupOk');
    
    if (!popup || !popupMessage || !popupOk) return;
    
    popupMessage.textContent = message;
    popup.classList.add('show');
    
    popupOk.onclick = () => {
      popup.classList.remove('show');
    };
    
    popup.onclick = (e) => {
      if (e.target === popup) {
        popup.classList.remove('show');
      }
    };
  }

  // ─── Subwindow Order Flow ──────────────────────────────────
  const API = window.location.origin;
  const worldPopulationValue = document.getElementById('worldPopulationValue');
  const subTrack = document.getElementById('subTrack');
  let currentSub = 0;
  const totalSteps = 6;
  let worldPopulationTickerId = null;
  const WORLD_POPULATION_BASE_2025 = 8231613070;
  const WORLD_POPULATION_BASE_DATE_2025 = Date.parse('2025-06-30T00:00:00Z');
  const WORLD_POPULATION_GROWTH_PER_YEAR = 69065325;
  const WORLD_POPULATION_GROWTH_PER_SECOND = WORLD_POPULATION_GROWTH_PER_YEAR / (365.2425 * 24 * 60 * 60);

  const order = { 
    weight: '', 
    color: '', 
    size: '', 
    firstName: '', 
    lastName: '', 
    dob: '', 
    email: '',
    paymentMethod: ''
  };

  function formatWorldPopulation(value) {
    return Math.max(0, Math.floor(value)).toLocaleString('en-GB');
  }

  function startWorldPopulationTicker(basePopulation, growthPerSecond) {
    if (!worldPopulationValue) return;

    if (worldPopulationTickerId) {
      window.clearInterval(worldPopulationTickerId);
    }

    const safeBasePopulation = Number(basePopulation) || 0;
    const safeGrowthPerSecond = Number(growthPerSecond) || 0;
    const startedAt = Date.now();

    const render = () => {
      const elapsedSeconds = (Date.now() - startedAt) / 1000;
      const currentPopulation = safeBasePopulation + (elapsedSeconds * safeGrowthPerSecond);
      worldPopulationValue.textContent = formatWorldPopulation(currentPopulation);
    };

    render();
    worldPopulationTickerId = window.setInterval(render, 1000);
  }

  function estimateWorldPopulation() {
    const secondsElapsed = Math.max(0, (Date.now() - WORLD_POPULATION_BASE_DATE_2025) / 1000);
    return WORLD_POPULATION_BASE_2025 + (secondsElapsed * WORLD_POPULATION_GROWTH_PER_SECOND);
  }

  async function loadWorldPopulation() {
    if (!worldPopulationValue) return;

    try {
      const res = await fetch(`${API}/api/world-population`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      startWorldPopulationTicker(data.population, data.growthPerSecond);
    } catch (error) {
      startWorldPopulationTicker(estimateWorldPopulation(), WORLD_POPULATION_GROWTH_PER_SECOND);
      console.error('World population error:', error);
    }
  }

  loadWorldPopulation();
  window.setInterval(loadWorldPopulation, 5 * 60 * 1000);

  function goSub(index) {
    if (!subTrack) return;
    const pct = (100 / totalSteps) * index;
    subTrack.style.transform = `translateX(-${pct}%)`;
    currentSub = index;
  }

  // Step 0: START
  const btnStart = document.getElementById('btnStart');
  if (btnStart) {
    btnStart.addEventListener('click', () => goSub(1));
  }

  // Step 1: Weight
  const modalOptions = document.querySelectorAll('.modal-option');
  const btnWeightNext = document.getElementById('btnWeightNext');
  const weightOptions = document.getElementById('weightOptions');
  const weightPrev = document.getElementById('weightPrev');
  const weightNextArrow = document.getElementById('weightNext');
  
  // Reset scroll to show first option (lightweight) when opening modal
  function resetWeightScroll() {
    if (weightOptions) {
      weightOptions.scrollLeft = 0;
    }
  }
  
  // Navigation arrows for weight selection
  if (weightPrev && weightOptions) {
    weightPrev.addEventListener('click', () => {
      weightOptions.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    });
  }
  
  if (weightNextArrow && weightOptions) {
    weightNextArrow.addEventListener('click', () => {
      weightOptions.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    });
  }
  
  modalOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      modalOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      order.weight = opt.dataset.weight;
    });
  });
  
  if (btnWeightNext) {
    btnWeightNext.addEventListener('click', () => {
      if (!order.weight) { 
        showPopup('Please choose a weight'); 
        return; 
      }
      goSub(2);
    });
  }

  // Step 2: Size
  const sizeBoxes = document.querySelectorAll('.size-box');
  
  sizeBoxes.forEach(box => {
    box.addEventListener('click', () => {
      sizeBoxes.forEach(b => b.classList.remove('selected'));
      box.classList.add('selected');
      order.size = box.dataset.size;
    });
  });
  
  const btnSizeNext = document.getElementById('btnSizeNext');
  if (btnSizeNext) {
    btnSizeNext.addEventListener('click', () => {
      if (!order.size) { 
        showPopup('Please select a size'); 
        return; 
      }
      goSub(3); // details
    });
  }

  // Step 3: Details — check returning user
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const dobInput = document.getElementById('dob');
  const orderEmailInput = document.getElementById('email');
  let checkTimeout;
  
  [firstNameInput, lastNameInput, dobInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        clearTimeout(checkTimeout);
        checkTimeout = setTimeout(checkExistingUser, 600);
      });
    }
  });

  async function checkExistingUser() {
    const fn = firstNameInput.value.trim();
    const ln = lastNameInput.value.trim();
    const d = dobInput.value;
    
    if (!fn || !ln || !d) return;
    
    try {
      const res = await fetch(`${API}/api/check-user`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: fn, lastName: ln, dob: d })
      });
      
      const data = await res.json();
      const banner = document.getElementById('returningBanner');
      
      if (data.exists && banner) {
        banner.style.display = 'block';
        document.getElementById('returningGreeting').textContent = `Welcome back, ${data.firstName}!`;
        document.getElementById('returningNumber').textContent = data.formattedNumber;
      } else if (banner) {
        banner.style.display = 'none';
      }
    } catch(e) { 
      console.error('Error checking user:', e); 
    }
  }

  const btnDetailsNext = document.getElementById('btnDetailsNext');
  if (btnDetailsNext) {
    btnDetailsNext.addEventListener('click', () => {
      order.firstName = firstNameInput.value.trim();
      order.lastName = lastNameInput.value.trim();
      order.dob = dobInput.value;
      order.email = orderEmailInput.value.trim();
      
      if (!order.firstName || !order.lastName || !order.dob || !order.email) { 
        showPopup('Please fill in all fields'); 
        return; 
      }
      
      if (!order.email.includes('@')) { 
        showPopup('Please enter a valid email'); 
        return; 
      }
      
      // Build review
      const review = document.getElementById('orderReview');
      if (review) {
        review.innerHTML = `
          <div class="review-row"><span>Weight</span><strong>${order.weight}</strong></div>
          <div class="review-row"><span>Size</span><strong>${order.size}</strong></div>
          <div class="review-row"><span>Name</span><strong>${order.firstName} ${order.lastName}</strong></div>
          <div class="review-row"><span>Email</span><strong>${order.email}</strong></div>
        `;
      }
      
      goSub(4); // payment
    });
  }

  // Payment method selection
  const paymentMethods = document.querySelectorAll('.payment-method');
  
  paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
      paymentMethods.forEach(m => m.classList.remove('selected'));
      method.classList.add('selected');
      order.paymentMethod = method.dataset.method;
    });
  });

  // Step 4: Payment
  const btnPay = document.getElementById('btnPay');
  if (btnPay) {
    btnPay.addEventListener('click', async () => {
      if (!order.paymentMethod) {
        showPopup('Please select a payment method first.');
        return;
      }
      
      btnPay.textContent = 'Processing...';
      btnPay.disabled = true;
      
      try {
        const res = await fetch(`${API}/api/create-order`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: order.firstName, 
            lastName: order.lastName,
            dob: order.dob, 
            email: order.email,
            color: order.color, 
            size: order.size
          })
        });
        
        const data = await res.json();
        
        if (data.success) {
          document.getElementById('confirmNumber').textContent = data.formattedNumber;
          
          let html = `
            <div class="review-row"><span>Size</span><strong>${order.size}</strong></div>
            <div class="review-row"><span>Name</span><strong>${data.firstName} ${data.lastName}</strong></div>
          `;
          
          if (data.isReturning) {
            html = `<p class="review-returning">Welcome back! Same number, new tee.</p>` + html;
          }
          
          document.getElementById('confirmDetails').innerHTML = html;
          document.getElementById('emailNote').textContent = `Confirmation will be sent to ${order.email}`;
          
          goSub(5); // confirmation
        } else {
          showPopup('Order failed. Try again.');
          btnPay.textContent = 'Pay £15.00'; 
          btnPay.disabled = false;
        }
      } catch(e) {
        showPopup('Connection error. Is the server running?');
        btnPay.textContent = 'Pay £15.00'; 
        btnPay.disabled = false;
        console.error('Payment error:', e);
      }
    });
  }

  // ─── Modal Open/Close ───────────────────────────────────────
  const modalOverlay = document.getElementById('modalOverlay');
  const inlineModalHost = document.getElementById('inlineModalHost');
  const heroFlowBox = document.getElementById('heroFlowBox');
  const openModalBtn = document.getElementById('openModal');
  const heroStartBtn = document.getElementById('heroStartBtn');
  const heroHomeLink = document.querySelector('.hero-home-link');
  const backBtn = document.getElementById('backBtn');
  const brandHome = document.getElementById('brandHome');

  if (inlineModalHost && modalOverlay) {
    modalOverlay.classList.add('inline-mode');
    inlineModalHost.appendChild(modalOverlay);
  }

  // Open modal
  if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (!openModalBtn.classList.contains('fade-out')) {
        openModalBtn.classList.add('fade-out');
      }

      if (heroStartBtn) {
        heroStartBtn.classList.add('visible');
      }
    });
  }

  if (heroStartBtn && modalOverlay) {
    heroStartBtn.addEventListener('click', () => {
      if (heroFlowBox) {
        heroFlowBox.classList.add('flow-open');
      }

      if (inlineModalHost) {
        inlineModalHost.classList.add('active');
      }

      modalOverlay.classList.add('active');
      goSub(1); // Skip intro because START was clicked in hero
      resetWeightScroll();
    });
  }

  function resetHeroEntryButtons() {
    if (openModalBtn) {
      openModalBtn.classList.remove('fade-out');
    }

    if (heroStartBtn) {
      heroStartBtn.classList.remove('visible');
    }
  }

  // Close modal
  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');

      if (heroFlowBox) {
        heroFlowBox.classList.remove('flow-open');
      }

      if (inlineModalHost) {
        inlineModalHost.classList.remove('active');
      }

      // Return to true home state (Shop visible, Start hidden)
      resetHeroEntryButtons();

      // Reset to first step
      setTimeout(() => goSub(0), 300);
    }
  }

  // Back button in header (goes back in steps)
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentSub > 0) {
        goSub(currentSub - 1);
      } else {
        // If at step 0, close modal
        closeModal();
      }
    });
  }

  // Brand name closes modal and goes home
  if (brandHome) {
    brandHome.addEventListener('click', closeModal);
  }

  // Any HUMANITEE home link resets the full flow state
  if (heroHomeLink) {
    heroHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Click overlay to close
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // ─── Debug Log (Remove in production) ─────────────────────
  console.log('HUMANITEE — Mobile-first design loaded ✓');

  // ─── FREE VISUAL EDITOR ──
  function toggleDebugOverlay() {
    const existing = document.getElementById('vizEditor');
    if (existing) { existing._cleanup(); existing.remove(); return; }

    const editableSels = [
      '.hero-title', '.hero-desktop-eyebrow', '.hero-desktop-desc',
      '.hero-actions', '.hero-meta', '.hero-copy-panel', '.hero-flow-box',
      '.hero-image img', '.hero-desktop-grid', '.hero .container', '.hero-counter',
      '.hero-image-wrap', '.hero-image', '.hero-flow-static',
      '.header', '.header .container', '.logo', '.nav',
    ];

    const state = {}; // { sel: { tx, ty, scale } }
    let selected = null;
    let selectedEl = null;

    function getState(sel) {
      if (!state[sel]) state[sel] = { tx: 0, ty: 0, scale: 1 };
      return state[sel];
    }

    function applyTransform(el, sel) {
      const s = getState(sel);
      el.style.transform = 'translate(' + s.tx + 'px, ' + s.ty + 'px) scale(' + s.scale.toFixed(3) + ')';
      el.style.transformOrigin = 'top left';
    }

    // Outline
    const outline = document.createElement('div');
    outline.style.cssText = 'position:fixed;pointer-events:none;z-index:100000;border:3px solid #0f0;box-shadow:0 0 12px rgba(0,255,0,0.5);display:none;';
    const outlineLbl = document.createElement('div');
    outlineLbl.style.cssText = 'position:absolute;top:-20px;left:0;background:#0f0;color:#000;font:bold 10px monospace;padding:2px 6px;border-radius:2px;white-space:nowrap;';
    outline.appendChild(outlineLbl);
    document.body.appendChild(outline);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'vizEditor';
    panel.style.cssText = 'position:fixed;bottom:10px;left:10px;z-index:100001;background:rgba(0,0,0,0.94);color:#fff;padding:14px;border-radius:10px;font:11px/1.5 monospace;width:310px;user-select:none;max-height:90vh;overflow-y:auto;';
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <b style="color:#0f0;font-size:13px;">FREE EDITOR</b>
        <span id="vizClose" style="cursor:pointer;color:#f66;font-size:16px;">✕</span>
      </div>
      <div id="vizHint" style="color:#888;font-size:10px;margin-bottom:8px;">Clicca un elemento, poi: DRAG=sposta, SCROLL=scala, FRECCE=sposta fine</div>
      <div id="vizInfo" style="background:#1a1a1a;padding:8px;border-radius:4px;margin-bottom:8px;display:none;font-size:10px;"></div>
      <div id="vizScale" style="display:none;margin-bottom:8px;">
        <div style="color:#aaa;font-size:9px;margin-bottom:4px;">SCALA:</div>
        <div style="display:flex;gap:4px;align-items:center;">
          <button id="scDown2" style="padding:5px 8px;background:#333;color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;font:bold 12px monospace;">−−</button>
          <button id="scDown" style="padding:5px 10px;background:#333;color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;font:bold 12px monospace;">−</button>
          <span id="scVal" style="color:#0f0;min-width:50px;text-align:center;">100%</span>
          <button id="scUp" style="padding:5px 10px;background:#333;color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;font:bold 12px monospace;">+</button>
          <button id="scUp2" style="padding:5px 8px;background:#333;color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;font:bold 12px monospace;">++</button>
          <button id="scReset" style="padding:5px 8px;background:#555;color:#fff;border:none;border-radius:4px;cursor:pointer;font:bold 10px monospace;">1:1</button>
        </div>
        <div style="display:flex;gap:4px;margin-top:6px;">
          <div style="flex:1;">
            <span style="color:#aaa;font-size:9px;">POS X:</span>
            <div style="display:flex;gap:2px;">
              <button class="pos-btn" data-axis="tx" data-delta="-20" style="padding:4px 6px;background:#333;color:#fff;border:1px solid #555;border-radius:3px;cursor:pointer;font:10px monospace;">◀◀</button>
              <button class="pos-btn" data-axis="tx" data-delta="-5" style="padding:4px 8px;background:#333;color:#fff;border:1px solid #555;border-radius:3px;cursor:pointer;font:10px monospace;">◀</button>
              <button class="pos-btn" data-axis="tx" data-delta="5" style="padding:4px 8px;background:#333;color:#fff;border:1px solid #555;border-radius:3px;cursor:pointer;font:10px monospace;">▶</button>
              <button class="pos-btn" data-axis="tx" data-delta="20" style="padding:4px 6px;background:#333;color:#fff;border:1px solid #555;border-radius:3px;cursor:pointer;font:10px monospace;">▶▶</button>
            </div>
          </div>
          <div style="flex:1;">
            <span style="color:#aaa;font-size:9px;">POS Y:</span>
            <div style="display:flex;gap:2px;">
              <button class="pos-btn" data-axis="ty" data-delta="-20" style="padding:4px 6px;background:#333;color:#fff;border:1px solid #555;border-radius:3px;cursor:pointer;font:10px monospace;">▲▲</button>
              <button class="pos-btn" data-axis="ty" data-delta="-5" style="padding:4px 8px;background:#333;color:#fff;border:1px solid #555;border-radius:3px;cursor:pointer;font:10px monospace;">▲</button>
              <button class="pos-btn" data-axis="ty" data-delta="5" style="padding:4px 8px;background:#333;color:#fff;border:1px solid #555;border-radius:3px;cursor:pointer;font:10px monospace;">▼</button>
              <button class="pos-btn" data-axis="ty" data-delta="20" style="padding:4px 6px;background:#333;color:#fff;border:1px solid #555;border-radius:3px;cursor:pointer;font:10px monospace;">▼▼</button>
            </div>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:6px;">
        <button id="vizExport" style="flex:1;padding:8px;background:#0a0;color:#000;border:none;border-radius:4px;font:bold 11px monospace;cursor:pointer;">COPY CSS</button>
        <button id="vizReset" style="padding:8px 14px;background:#a00;color:#fff;border:none;border-radius:4px;font:bold 11px monospace;cursor:pointer;">RESET</button>
      </div>
    `;
    document.body.appendChild(panel);

    const vizInfo = panel.querySelector('#vizInfo');
    const vizScale = panel.querySelector('#vizScale');
    const scVal = panel.querySelector('#scVal');

    function updateOutline() {
      if (!selectedEl) { outline.style.display = 'none'; return; }
      const r = selectedEl.getBoundingClientRect();
      outline.style.display = 'block';
      outline.style.top = r.top + 'px'; outline.style.left = r.left + 'px';
      outline.style.width = r.width + 'px'; outline.style.height = r.height + 'px';
      outlineLbl.textContent = selected + ' ' + Math.round(r.width) + '×' + Math.round(r.height);
    }

    function updateInfo() {
      if (!selectedEl || !selected) return;
      const s = getState(selected);
      const r = selectedEl.getBoundingClientRect();
      vizInfo.innerHTML =
        '<b style="color:#0f0">' + selected + '</b><br>' +
        'Size: <b style="color:#fff">' + Math.round(r.width) + ' × ' + Math.round(r.height) + '</b>px<br>' +
        'Translate: x=' + s.tx + ' y=' + s.ty + '<br>' +
        'Scale: ' + Math.round(s.scale * 100) + '%';
      scVal.textContent = Math.round(s.scale * 100) + '%';
    }

    function selectElement(sel, el) {
      selected = sel; selectedEl = el;
      vizInfo.style.display = 'block';
      vizScale.style.display = 'block';
      panel.querySelector('#vizHint').textContent = 'Selezionato: ' + sel;
      updateOutline(); updateInfo();
    }

    function adjustScale(delta) {
      if (!selected || !selectedEl) return;
      const s = getState(selected);
      s.scale = Math.max(0.1, Math.round((s.scale + delta) * 100) / 100);
      applyTransform(selectedEl, selected);
      updateOutline(); updateInfo();
    }

    function adjustPos(axis, delta) {
      if (!selected || !selectedEl) return;
      const s = getState(selected);
      s[axis] += delta;
      applyTransform(selectedEl, selected);
      updateOutline(); updateInfo();
    }

    // Scale buttons
    panel.querySelector('#scDown2').addEventListener('click', () => adjustScale(-0.1));
    panel.querySelector('#scDown').addEventListener('click', () => adjustScale(-0.02));
    panel.querySelector('#scUp').addEventListener('click', () => adjustScale(0.02));
    panel.querySelector('#scUp2').addEventListener('click', () => adjustScale(0.1));
    panel.querySelector('#scReset').addEventListener('click', () => {
      if (!selected || !selectedEl) return;
      getState(selected).scale = 1;
      applyTransform(selectedEl, selected);
      updateOutline(); updateInfo();
    });

    // Position buttons
    panel.querySelectorAll('.pos-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        adjustPos(btn.dataset.axis, parseInt(btn.dataset.delta));
      });
    });

    // ── DRAG ──
    let isDragging = false, dragStartX = 0, dragStartY = 0, dragStartTx = 0, dragStartTy = 0;

    function findEditable(target) {
      while (target && target !== document.body) {
        for (const sel of editableSels) {
          if (target.matches && target.matches(sel)) return { sel, el: target };
        }
        target = target.parentElement;
      }
      return null;
    }

    function onMouseDown(e) {
      if (panel.contains(e.target)) return;
      const found = findEditable(e.target);
      if (!found) return;
      e.preventDefault(); e.stopPropagation();
      selectElement(found.sel, found.el);
      isDragging = true;
      dragStartX = e.clientX; dragStartY = e.clientY;
      const s = getState(found.sel);
      dragStartTx = s.tx; dragStartTy = s.ty;
      document.body.style.cursor = 'grabbing';
    }

    function onMouseMove(e) {
      if (!isDragging || !selectedEl || !selected) return;
      e.preventDefault();
      const s = getState(selected);
      s.tx = dragStartTx + (e.clientX - dragStartX);
      s.ty = dragStartTy + (e.clientY - dragStartY);
      applyTransform(selectedEl, selected);
      updateOutline(); updateInfo();
    }

    function onMouseUp() {
      if (isDragging) { isDragging = false; document.body.style.cursor = ''; }
    }

    document.addEventListener('mousedown', onMouseDown, true);
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('mouseup', onMouseUp, true);

    // ── SCROLL = scale ──
    function onWheel(e) {
      if (!selectedEl || !selected) return;
      if (panel.contains(e.target)) return;
      // Only act if mouse is near the selected element
      const r = selectedEl.getBoundingClientRect();
      if (e.clientX < r.left - 50 || e.clientX > r.right + 50 || e.clientY < r.top - 50 || e.clientY > r.bottom + 50) return;
      e.preventDefault();
      adjustScale(e.deltaY < 0 ? 0.03 : -0.03);
    }
    document.addEventListener('wheel', onWheel, { passive: false });

    // ── ARROW KEYS ──
    function onKey(e) {
      if (!selectedEl || !selected) return;
      if (panel.contains(document.activeElement)) return;
      const step = e.shiftKey ? 20 : 5;
      if (e.key === 'ArrowUp') { adjustPos('ty', -step); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { adjustPos('ty', step); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { adjustPos('tx', -step); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { adjustPos('tx', step); e.preventDefault(); }
    }
    document.addEventListener('keydown', onKey);

    window.addEventListener('scroll', updateOutline);
    window.addEventListener('resize', updateOutline);

    // ── EXPORT ──
    panel.querySelector('#vizExport').addEventListener('click', () => {
      let css = '/* Free editor changes — incolla qui */\n';
      for (const [sel, s] of Object.entries(state)) {
        if (s.tx === 0 && s.ty === 0 && s.scale === 1) continue;
        css += sel + ' {\n';
        css += '  transform: translate(' + s.tx + 'px, ' + s.ty + 'px) scale(' + s.scale.toFixed(3) + ');\n';
        css += '  transform-origin: top left;\n';
        css += '}\n';
      }
      navigator.clipboard.writeText(css).then(() => {
        const b = panel.querySelector('#vizExport');
        b.textContent = 'COPIATO!'; b.style.background = '#fff';
        setTimeout(() => { b.textContent = 'COPY CSS'; b.style.background = '#0a0'; }, 1500);
      });
    });

    panel.querySelector('#vizReset').addEventListener('click', () => {
      for (const [sel, s] of Object.entries(state)) {
        const el = document.querySelector(sel);
        if (el) { el.style.transform = ''; el.style.transformOrigin = ''; }
      }
      Object.keys(state).forEach(k => delete state[k]);
      updateOutline(); updateInfo();
    });

    panel.querySelector('#vizClose').addEventListener('click', () => {
      panel._cleanup(); panel.remove();
    });

    panel._cleanup = () => {
      outline.remove();
      document.removeEventListener('mousedown', onMouseDown, true);
      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('mouseup', onMouseUp, true);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', updateOutline);
      window.removeEventListener('resize', updateOutline);
    };
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      toggleDebugOverlay();
    }
  });

  setTimeout(toggleDebugOverlay, 500);

})();
