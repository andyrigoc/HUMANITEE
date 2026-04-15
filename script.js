// ═══════════════════════════════════════════════════════════
// HUMANITEE — Mobile-First JavaScript
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ─── Humanitee Story Popup ────────────────────────────────
  const storyBtn = document.getElementById('storyBtn');
  const storyPopupOverlay = document.getElementById('storyPopupOverlay');
  const storyPopupClose = document.getElementById('storyPopupClose');

  if (storyBtn && storyPopupOverlay) {
    storyBtn.addEventListener('click', function() {
      storyPopupOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    storyPopupClose.addEventListener('click', function() {
      storyPopupOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
    storyPopupOverlay.addEventListener('click', function(e) {
      if (e.target === storyPopupOverlay) {
        storyPopupOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ─── Mobile Sidebar Toggle ────────────────────────────────
  const menuBtn = document.getElementById('menuBtn');
  const navSidebar = document.getElementById('navSidebar');
  const navOverlay = document.getElementById('navOverlay');
  const navSidebarClose = document.getElementById('navSidebarClose');

  function openSidebar() {
    if (navSidebar) navSidebar.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    if (menuBtn) menuBtn.classList.add('active');
  }

  function closeSidebar() {
    if (navSidebar) navSidebar.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    if (menuBtn) menuBtn.classList.remove('active');
  }

  if (menuBtn && navSidebar) {
    menuBtn.addEventListener('click', () =>
      navSidebar.classList.contains('open') ? closeSidebar() : openSidebar()
    );
  }

  if (navSidebarClose) navSidebarClose.addEventListener('click', closeSidebar);
  if (navOverlay) navOverlay.addEventListener('click', closeSidebar);

  if (navSidebar) {
    navSidebar.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        closeSidebar();
      });
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
  const modalPopulationValue = document.getElementById('modalPopulationValue');
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

  let selectedCarouselWeight = null;
  // heroBtnLabel / heroStartBtn removed — replaced by pickSizeBtn

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
      if (modalPopulationValue) modalPopulationValue.textContent = formatWorldPopulation(currentPopulation);
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
          
          // Show luxury confirmation popup
          const lp = document.getElementById('luxuryPopup');
          const lpNum = document.getElementById('luxuryNumber');
          if (lp && lpNum) {
            lpNum.textContent = data.formattedNumber;
            lp.classList.add('active');
            requestAnimationFrame(() => requestAnimationFrame(() => lp.classList.add('shown')));
          } else {
            goSub(5); // fallback if luxury popup not found
          }
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
  const heroHomeLink = document.querySelector('.hero-home-link');
  const backBtn = document.getElementById('backBtn');
  const brandHome = document.getElementById('brandHome');
  const pickSizeBtn = document.getElementById('pickSizeBtn');

  if (inlineModalHost && modalOverlay) {
    modalOverlay.classList.add('inline-mode');
    inlineModalHost.appendChild(modalOverlay);
  }

  // Open modal from PICK YOUR SIZE button
  function openModalWithWeight(weight) {
    selectedCarouselWeight = weight;
    // Pre-select in step 1
    modalOptions.forEach(o => o.classList.remove('selected'));
    const matchOpt = document.querySelector('.modal-option[data-weight="' + weight + '"]');
    if (matchOpt) { matchOpt.classList.add('selected'); order.weight = weight; }

    if (heroFlowBox) heroFlowBox.classList.add('flow-open');
    if (inlineModalHost) inlineModalHost.classList.add('active');
    modalOverlay.classList.add('active');
    goSub(2); // Skip weight step — move straight to size
  }

  if (pickSizeBtn) {
    pickSizeBtn.addEventListener('click', () => {
      if (selectedCarouselWeight) openModalWithWeight(selectedCarouselWeight);
    });
  }

  function resetHeroEntryButtons() {
    // Hide pick-size button and remove carousel zoom
    if (pickSizeBtn) pickSizeBtn.classList.remove('visible');
    selectedCarouselWeight = null;
    document.querySelectorAll('.carousel__cell').forEach(c => c.classList.remove('zoom-selected'));
  }

  // Close modal
  function closeModal() {
    // Dismiss luxury popup if open
    const lp = document.getElementById('luxuryPopup');
    if (lp) lp.classList.remove('shown', 'active');

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

  // Luxury popup — CLOSE button
  const luxuryCloseBtn = document.getElementById('luxuryClose');
  if (luxuryCloseBtn) {
    luxuryCloseBtn.addEventListener('click', () => {
      const lp = document.getElementById('luxuryPopup');
      if (lp) {
        lp.classList.remove('shown');
        setTimeout(() => {
          lp.classList.remove('active');
          closeModal();
        }, 800);
      }
    });
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

  // ─── 3D Carousel (BrandedUK-style) ───────────────────────
  (function initCarousel() {
    const carouselEl = document.getElementById('carousel3D');
    if (!carouselEl) return;

    const imageData = [
      { src: 'ORIGIN.png', label: 'LIGHTWEIGHT',  weight: 'lightweight' },
      { src: 'ORIGIN.png', label: 'PREMIUM',       weight: 'premium'     },
      { src: 'ORIGIN.png', label: 'HEAVY',         weight: 'heavy'       },
      { src: 'ORIGIN.png', label: 'ULTRA LIGHT',   weight: 'lightweight' },
      { src: 'ORIGIN.png', label: 'SIGNATURE',     weight: 'premium'     },
      { src: 'ORIGIN.png', label: 'ESSENTIAL',     weight: 'lightweight' },
      { src: 'ORIGIN.png', label: 'CLASSIC',       weight: 'premium'     },
      { src: 'ORIGIN.png', label: 'OVERSIZE',      weight: 'heavy'       },
      { src: 'ORIGIN.png', label: 'STRUCTURED',    weight: 'heavy'       },
      { src: 'ORIGIN.png', label: 'ORIGIN',        weight: 'premium'     }
    ];

    const total  = imageData.length;
    const theta  = 360 / total; // 36°
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? 234 : isTablet ? 233 : 468;

    const cells = [];
    let index     = 0;
    let rotationY = 0;
    let timer     = null;
    let touchStartX = null;

    // ── Build cells ─────────────────────────────────────────
    imageData.forEach((item) => {
      const cell = document.createElement('div');
      cell.className  = 'carousel__cell';
      cell.dataset.weight = item.weight;

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.label;
      cell.appendChild(img);

      const lbl = document.createElement('div');
      lbl.className   = 'carousel__cell-label';
      lbl.textContent = item.label;
      cell.appendChild(lbl);

      carouselEl.appendChild(cell);
      cells.push(cell);
    });

    // ── Position cells around Y axis ─────────────────────────
    function positionCells() {
      cells.forEach((cell, i) => {
        cell.style.transform = 'rotateY(' + (theta * i) + 'deg) translateZ(' + radius + 'px)';
      });
    }

    // ── Toggle active class ──────────────────────────────────
    function setActive() {
      const prev = (index - 1 + total) % total;
      const next = (index + 1) % total;
      cells.forEach((cell, i) => {
        cell.classList.toggle('active', i === index);
        if (i === index) {
          cell.style.opacity = '1';
          cell.style.pointerEvents = 'auto';
        } else if (i === prev || i === next) {
          cell.style.opacity = '0.45';
          cell.style.pointerEvents = 'auto';
        } else {
          cell.style.opacity = '0';
          cell.style.pointerEvents = 'none';
        }
      });
    }

    // ── Rotate ───────────────────────────────────────────────
    function rotate(dir) {
      if (dir === 'next') {
        index      = (index + 1) % total;
        rotationY -= theta;
      } else {
        index      = (index - 1 + total) % total;
        rotationY += theta;
      }
      updateTransform();
    }

    // ── Apply CSS transform + update states ──────────────────
    function updateTransform() {
      carouselEl.style.transform = 'rotateX(-5deg) rotateY(' + rotationY + 'deg)';
      setActive();
      startAuto();
    }

    // ── Auto-rotate every 4 s (resets on interaction) ────────
    function startAuto() {
      clearInterval(timer);
      timer = setInterval(() => rotate('next'), 4000);
    }

    // ── Touch swipe ──────────────────────────────────────────
    carouselEl.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carouselEl.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if      (dx >  30) rotate('prev');
      else if (dx < -30) rotate('next');
      touchStartX = null;
    }, { passive: true });

    // ── Cell click: adjacent → rotate; active → doppio-tap/click → zoom + PICK YOUR SIZE ──
    cells.forEach((cell, i) => {
      let lastTap = 0;

      function handleSelect() {
        selectedCarouselWeight = imageData[i].weight;
        openModalWithWeight(selectedCarouselWeight);
      }

      cell.addEventListener('click', () => {
        const next = (index + 1) % total;
        const prev = (index - 1 + total) % total;

        if (i === next) {
          rotate('next');
        } else if (i === prev) {
          rotate('prev');
        } else if (i === index) {
          // Active cell: detect double-tap (< 300 ms between two taps)
          const now = Date.now();
          if (now - lastTap < 300) {
            handleSelect();
          }
          lastTap = now;
        }
      });

      // Desktop double-click
      cell.addEventListener('dblclick', () => {
        if (i === index) handleSelect();
      });
    });

    positionCells();
    updateTransform(); // initial state (no animation — transition fires only on change)
  })();

})();
