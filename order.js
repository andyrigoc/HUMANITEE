// ─── HUMANITEE ORDER FLOW ───────────────────────────────
// Pure vanilla JS — no jQuery needed

const API = window.location.origin;

const track = document.getElementById("track");
const stepDots = document.querySelectorAll(".steps-indicator .step-dot");
let currentStep = 0;

// Order state
const order = {
  color: "",
  size: "",
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  isReturning: false,
  humanNumber: "",
  formattedNumber: ""
};

// ─── NAVIGATION ─────────────────────────────────────────

function goToStep(index) {
  track.style.transform = `translateX(-${index * 20}%)`;
  currentStep = index;

  // Update step indicators
  stepDots.forEach((dot, i) => {
    dot.classList.remove("active", "done");
    if (i < index) dot.classList.add("done");
    if (i === index) dot.classList.add("active");
  });

  // Scroll to top of card
  document.querySelector(".order_card").scrollIntoView({ behavior: "smooth", block: "start" });
}

// Back buttons
document.querySelectorAll(".btn.back").forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) goToStep(currentStep - 1);
  });
});

// ─── STEP 1: COLOUR SELECTION ───────────────────────────

const colourBoxes = document.querySelectorAll(".colour-box");

colourBoxes.forEach(box => {
  box.addEventListener("click", () => {
    colourBoxes.forEach(b => b.classList.remove("selected"));
    box.classList.add("selected");
    order.color = box.dataset.color;
  });
});

document.getElementById("btnColourNext").addEventListener("click", () => {
  if (!order.color) {
    showError("Please select a colour");
    return;
  }
  goToStep(1);
});

// ─── STEP 2: SIZE SELECTION ─────────────────────────────

const sizeBoxes = document.querySelectorAll(".size-box");

sizeBoxes.forEach(box => {
  box.addEventListener("click", () => {
    sizeBoxes.forEach(b => b.classList.remove("selected"));
    box.classList.add("selected");
    order.size = box.dataset.size;
  });
});

document.getElementById("btnSizeNext").addEventListener("click", () => {
  if (!order.size) {
    showError("Please select a size");
    return;
  }
  goToStep(2);
});

// ─── STEP 3: USER DETAILS ──────────────────────────────

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const dobInput = document.getElementById("dob");
const emailInput = document.getElementById("email");

// Check user when name+surname+dob all filled (debounced)
let checkTimeout;
[firstNameInput, lastNameInput, dobInput].forEach(input => {
  input.addEventListener("input", () => {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(checkExistingUser, 600);
  });
});

async function checkExistingUser() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const dob = dobInput.value;

  if (!firstName || !lastName || !dob) return;

  try {
    const res = await fetch(`${API}/api/check-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, dob })
    });

    const data = await res.json();

    if (data.exists) {
      order.isReturning = true;
      order.humanNumber = data.humanNumber;
      order.formattedNumber = data.formattedNumber;

      document.getElementById("returningBanner").style.display = "block";
      document.getElementById("returningGreeting").textContent = `Welcome back, ${data.firstName}!`;
      document.getElementById("returningNumber").textContent = data.formattedNumber;
    } else {
      order.isReturning = false;
      document.getElementById("returningBanner").style.display = "none";
    }
  } catch (err) {
    console.error("Check user error:", err);
  }
}

document.getElementById("btnDetailsNext").addEventListener("click", () => {
  order.firstName = firstNameInput.value.trim();
  order.lastName = lastNameInput.value.trim();
  order.dob = dobInput.value;
  order.email = emailInput.value.trim();

  if (!order.firstName || !order.lastName || !order.dob || !order.email) {
    showError("Please fill in all fields");
    return;
  }

  // Simple email validation
  if (!order.email.includes("@") || !order.email.includes(".")) {
    showError("Please enter a valid email address");
    return;
  }

  // Build order review
  buildOrderReview();
  goToStep(3);
});

// ─── STEP 4: PAYMENT ───────────────────────────────────

function buildOrderReview() {
  const review = document.getElementById("orderReview");
  let returningHTML = "";
  if (order.isReturning) {
    returningHTML = `<p class="review-returning">✓ Returning customer — Human Number: <strong>${order.formattedNumber}</strong></p>`;
  }

  review.innerHTML = `
    ${returningHTML}
    <div class="review-row"><span>Colour</span><strong>${order.color}</strong></div>
    <div class="review-row"><span>Size</span><strong>${order.size}</strong></div>
    <div class="review-row"><span>Name</span><strong>${order.firstName} ${order.lastName}</strong></div>
    <div class="review-row"><span>Date of Birth</span><strong>${order.dob}</strong></div>
    <div class="review-row"><span>Email</span><strong>${order.email}</strong></div>
  `;
}

document.getElementById("btnPay").addEventListener("click", async () => {
  const payBtn = document.getElementById("btnPay");
  payBtn.textContent = "Processing...";
  payBtn.disabled = true;

  try {
    const res = await fetch(`${API}/api/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      order.humanNumber = data.humanNumber;
      order.formattedNumber = data.formattedNumber;

      // Show confirmation
      document.getElementById("confirmNumber").textContent = data.formattedNumber;

      let confirmHTML = `
        <div class="review-row"><span>Colour</span><strong>${order.color}</strong></div>
        <div class="review-row"><span>Size</span><strong>${order.size}</strong></div>
        <div class="review-row"><span>Name</span><strong>${data.firstName} ${data.lastName}</strong></div>
      `;

      if (data.isReturning) {
        confirmHTML = `<p class="confirm-returning">Welcome back, ${data.firstName}! Same number, new tee.</p>` + confirmHTML;
      }

      document.getElementById("confirmDetails").innerHTML = confirmHTML;
      document.getElementById("emailNote").textContent =
        `A confirmation will be sent to ${order.email}`;

      goToStep(4);
    } else {
      showError("Order failed. Please try again.");
      payBtn.textContent = "Pay £34.00";
      payBtn.disabled = false;
    }
  } catch (err) {
    console.error("Order error:", err);
    showError("Connection error. Is the server running?");
    payBtn.textContent = "Pay £34.00";
    payBtn.disabled = false;
  }
});

// ─── HELPERS ────────────────────────────────────────────

function showError(msg) {
  // Simple alert for now — can be upgraded to toast
  alert(msg);
}