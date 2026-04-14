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

  // ─── Debug Log (Remove in production) ─────────────────────
  console.log('HUMANITEE — Mobile-first design loaded ✓');

})();
