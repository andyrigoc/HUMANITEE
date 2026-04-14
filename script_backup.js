// Mini Pop-up Reminder
function showPopup(message) {
  const popup = document.getElementById('miniPopup');
  const popupMessage = document.getElementById('popupMessage');
  const popupOk = document.getElementById('popupOk');
  
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

const menuToggle = document.getElementById("menuToggle");
const mobilePanel = document.getElementById("mobilePanel");

menuToggle.addEventListener("click", () => {
  mobilePanel.classList.toggle("open");
});

document.querySelectorAll(".mobile-panel a").forEach(link => {
  link.addEventListener("click", () => {
    mobilePanel.classList.remove("open");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.14
});

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");
const emailInput = document.getElementById("emailInput");

newsletterForm.addEventListener("submit", function(e){
  e.preventDefault();
  const email = emailInput.value.trim();

  if(!email || !email.includes("@") || !email.includes(".")){
    newsletterMessage.textContent = "Please enter a valid email address.";
    return;
  }

  newsletterMessage.textContent = "You have been added to the next drop list.";
  newsletterForm.reset();
});

const addButtons = document.querySelectorAll(".add-cart");

addButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.dataset.name;
    btn.textContent = "Added";
    setTimeout(() => {
      btn.textContent = "Add";
    }, 1200);
    console.log(product + " added to cart");
  });
});

const navLinks = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll("main section, footer");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const height = section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ─── SUBWINDOW ORDER FLOW ───────────────────────────────
const API = window.location.origin;
const subTrack = document.getElementById("subTrack");
let currentSub = 0;
const totalSteps = 6;

const order = { weight:"", color:"", size:"", firstName:"", lastName:"", dob:"", email:"" };

function goSub(index) {
  if (!subTrack) return;
  const pct = (100 / totalSteps) * index;
  subTrack.style.transform = `translateX(-${pct}%)`;
  currentSub = index;
}

// Back buttons
document.querySelectorAll("[data-back]").forEach(btn => {
  btn.addEventListener("click", () => { if (currentSub > 0) goSub(currentSub - 1); });
});

// Step 0: START
const btnStart = document.getElementById("btnStart");
if (btnStart) btnStart.addEventListener("click", () => goSub(1));

// Step 1: Weight
const modalOptions = document.querySelectorAll(".modal-option");
const btnWeightNext = document.getElementById("btnWeightNext");
modalOptions.forEach(opt => {
  opt.addEventListener("click", () => {
    modalOptions.forEach(o => o.classList.remove("selected"));
    opt.classList.add("selected");
    order.weight = opt.dataset.weight;
  });
});
if (btnWeightNext) btnWeightNext.addEventListener("click", () => {
  if (!order.weight) { showPopup("Please choose a weight"); return; }
  goSub(2);
});

// Step 2: Size
const sizeBoxes = document.querySelectorAll(".size-box");
sizeBoxes.forEach(box => {
  box.addEventListener("click", () => {
    sizeBoxes.forEach(b => b.classList.remove("selected"));
    box.classList.add("selected");
    order.size = box.dataset.size;
  });
});
const btnSizeNext = document.getElementById("btnSizeNext");
if (btnSizeNext) btnSizeNext.addEventListener("click", () => {
  if (!order.size) { showPopup("Please select a size"); return; }
  goSub(3); // details
});

// Step 3: Details — check returning user
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const dobInput = document.getElementById("dob");
const orderEmailInput = document.getElementById("email");
let checkTimeout;
[firstNameInput, lastNameInput, dobInput].forEach(input => {
  if (input) input.addEventListener("input", () => {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(checkExistingUser, 600);
  });
});

async function checkExistingUser() {
  const fn = firstNameInput.value.trim(), ln = lastNameInput.value.trim(), d = dobInput.value;
  if (!fn || !ln || !d) return;
  try {
    const res = await fetch(`${API}/api/check-user`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ firstName:fn, lastName:ln, dob:d })
    });
    const data = await res.json();
    const banner = document.getElementById("returningBanner");
    if (data.exists && banner) {
      banner.style.display = "block";
      document.getElementById("returningGreeting").textContent = `Welcome back, ${data.firstName}!`;
      document.getElementById("returningNumber").textContent = data.formattedNumber;
    } else if (banner) {
      banner.style.display = "none";
    }
  } catch(e) { console.error(e); }
}

const btnDetailsNext = document.getElementById("btnDetailsNext");
if (btnDetailsNext) btnDetailsNext.addEventListener("click", () => {
  order.firstName = firstNameInput.value.trim();
  order.lastName = lastNameInput.value.trim();
  order.dob = dobInput.value;
  order.email = orderEmailInput.value.trim();
  if (!order.firstName || !order.lastName || !order.dob || !order.email) { showPopup("Please fill in all fields"); return; }
  if (!order.email.includes("@")) { showPopup("Please enter a valid email"); return; }
  // Build review
  const review = document.getElementById("orderReview");
  if (review) review.innerHTML = `
    <div class="review-row"><span>Weight</span><strong>${order.weight}</strong></div>
    <div class="review-row"><span>Size</span><strong>${order.size}</strong></div>
    <div class="review-row"><span>Name</span><strong>${order.firstName} ${order.lastName}</strong></div>
    <div class="review-row"><span>Email</span><strong>${order.email}</strong></div>
  `;
  goSub(4); // payment
});

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
const btnPay = document.getElementById("btnPay");
if (btnPay) btnPay.addEventListener("click", async () => {
  if (!order.paymentMethod) {
    showPopup("Please select a payment method first.");
    return;
  }
  btnPay.textContent = "Processing...";
  btnPay.disabled = true;
  try {
    const res = await fetch(`${API}/api/create-order`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        firstName:order.firstName, lastName:order.lastName,
        dob:order.dob, email:order.email,
        color:order.color, size:order.size
      })
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById("confirmNumber").textContent = data.formattedNumber;
      let html = `
        <div class="review-row"><span>Size</span><strong>${order.size}</strong></div>
        <div class="review-row"><span>Name</span><strong>${data.firstName} ${data.lastName}</strong></div>
      `;
      if (data.isReturning) html = `<p class="review-returning">Welcome back! Same number, new tee.</p>` + html;
      document.getElementById("confirmDetails").innerHTML = html;
      document.getElementById("emailNote").textContent = `Confirmation will be sent to ${order.email}`;
      goSub(5); // confirmation
    } else {
      showPopup("Order failed. Try again.");
      btnPay.textContent = "Pay £34.00"; btnPay.disabled = false;
    }
  } catch(e) {
    showPopup("Connection error. Is the server running?");
    btnPay.textContent = "Pay £34.00"; btnPay.disabled = false;
  }
});

// ─── MODAL MOBILE UI ───────────────────────────────
const modalOverlay = document.getElementById('modalOverlay');
const modalMobile = document.getElementById('modalMobile');
const openModalBtn = document.getElementById('openModal');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const modalMenu = document.getElementById('modalMenu');

// Open modal
if (openModalBtn) {
  openModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
}

function openModal() {
  modalOverlay.classList.add('active');
  document.body.classList.add('modal-open');
}

// Close modal
function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.classList.remove('modal-open');
  // Close menu if open
  if (modalMenu && modalMenu.classList.contains('active')) {
    modalMenu.classList.remove('active');
    hamburgerBtn.classList.remove('active');
  }
}

// Click overlay to close
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

// Toggle hamburger menu
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburgerBtn.classList.toggle('active');
    modalMenu.classList.toggle('active');
  });
}

// Close menu when clicking on a menu item
const menuItems = document.querySelectorAll('.modal-menu-item');
menuItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const target = item.getAttribute('href');
    
    // Close modal
    closeModal();
    
    // Scroll to section after modal closes
    setTimeout(() => {
      if (target) {
        const section = document.querySelector(target);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 400);
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (modalMenu && modalMenu.classList.contains('active')) {
    if (!modalMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      modalMenu.classList.remove('active');
      hamburgerBtn.classList.remove('active');
    }
  }
});

// Get Started button
const btnGetStarted = document.getElementById('btnGetStarted');
if (btnGetStarted) {
  btnGetStarted.addEventListener('click', () => {
    window.location.href = 'order.html';
  });
}