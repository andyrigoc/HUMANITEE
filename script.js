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

})();
