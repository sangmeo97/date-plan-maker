// Global State
let userNameInput = "";
let selectedDate = "";
let selectedTime = "";
let selectedFood = "";
let selectedMessage = "";
let countdownInterval = null;
let noClickCount = 0;
let yayTimeout = null;

// Helper: Normalize string to remove Vietnamese accents and spaces
function cleanString(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// 1. Floating Hearts Background Generator
function initFloatingHearts() {
  const container = document.getElementById("hearts-container");
  const heartTypes = ["❤️", "💖", "💗", "💕", "✨", "🎈", "🌸"];

  // Create initial hearts
  for (let i = 0; i < 15; i++) {
    createHeart(container, heartTypes, true);
  }

  // Generate new hearts periodically
  setInterval(() => {
    createHeart(container, heartTypes, false);
  }, 1200);
}

function createHeart(container, types, initial = false) {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.innerText = types[Math.floor(Math.random() * types.length)];

  // Random horizontal position
  heart.style.left = Math.random() * 100 + "%";

  // Random sizing
  const size = Math.random() * 1.2 + 0.8; // 0.8rem to 2rem
  heart.style.fontSize = size + "rem";

  // Random animation characteristics
  const duration = Math.random() * 6 + 6; // 6s to 12s
  heart.style.animationDuration = duration + "s";

  // Random delay
  const delay = initial ? Math.random() * -10 : Math.random() * 2;
  heart.style.animationDelay = delay + "s";

  container.appendChild(heart);

  // Clean up element after animation ends
  setTimeout(
    () => {
      heart.remove();
    },
    (duration + delay) * 1000,
  );
}

// 2. Navigation between Stages
function goToStage(currentStageId, nextStageId) {
  const current = document.getElementById(currentStageId);
  const next = document.getElementById(nextStageId);

  current.style.display = "none";
  current.classList.remove("active");

  next.style.display = "block";
  setTimeout(() => {
    next.classList.add("active");
  }, 50);
}

// 3. Login Validation
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("username").value;
  const passwordInput = document.getElementById("password").value;
  const errorEl = document.getElementById("login-error");
  const loginCard = document.getElementById("stage-login");

  const normalizedName = cleanString(nameInput);
  const normalizedPassword = passwordInput.trim();

  // Reset errors and animations
  errorEl.classList.add("hidden");
  loginCard.classList.remove("shake");

  // Username validation: ha phuong (case-insensitive, accent-insensitive)
  if (normalizedName !== "ha phuong") {
    loginCard.classList.add("shake");
    errorEl.classList.remove("hidden");

    // Check if they input parts of the name
    if (normalizedName.includes("ha") || normalizedName.includes("phuong")) {
      errorEl.innerHTML =
        '<i class="fa-solid fa-triangle-exclamation"></i> Gần đúng rồi! Vui lòng nhập đầy đủ cả họ và tên nhé! 😉';
    } else {
      errorEl.innerHTML =
        '<i class="fa-solid fa-triangle-exclamation"></i> Hừm... Không phải bạn này rồi! Trang web này chỉ dành riêng cho <strong>Hà Phương</strong> thôi! 😤';
    }
    return;
  }

  // Password validation: Just check that it is not empty, and prevent negative/hate words
  if (!normalizedPassword) {
    loginCard.classList.add("shake");
    errorEl.classList.remove("hidden");
    errorEl.innerHTML =
      '<i class="fa-solid fa-triangle-exclamation"></i> Vui lòng nhập mật khẩu mở khóa!';
    return;
  }

  const cleanPass = cleanString(normalizedPassword);
  if (
    cleanPass.includes("khong yeu") ||
    cleanPass.includes("het yeu") ||
    cleanPass.includes("ghet")
  ) {
    loginCard.classList.add("shake");
    errorEl.classList.remove("hidden");
    errorEl.innerHTML =
      '<i class="fa-solid fa-triangle-exclamation"></i> Mật khẩu này sai rồi nha! Hãy nhập mật khẩu nào vui vẻ hơn đi! 😠';
    return;
  }

  // Login successful
  userNameInput = nameInput.trim();
  goToStage("stage-login", "stage-proposal");
});

// Password Hint Toggle
document.getElementById("hint-btn").addEventListener("click", function () {
  const hintText = document.getElementById("hint-text");
  hintText.classList.toggle("hidden");
});

// 4. Date Proposal (Yes / No) Logic
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

noBtn.addEventListener("click", function () {
  noClickCount++;

  // Shake button effect
  noBtn.classList.add("no-shake");
  setTimeout(() => {
    noBtn.classList.remove("no-shake");
  }, 400);

  if (noClickCount === 1) {
    // 1st click: Change text to Really sure?
    noBtn.innerText = "Chắc chưa thế? 🥺";
    // Slightly grow yes button
    yesBtn.style.transform = "scale(1.15)";
  } else if (noClickCount === 2) {
    // 2nd click: Change text to Think again...
    noBtn.innerText = "Nghĩ kĩ lại đi... 😢";
    // Grow yes button bigger
    yesBtn.style.transform = "scale(1.35)";
  } else if (noClickCount >= 3) {
    // 3rd click: Hide the No button entirely! Only Yes remains.
    noBtn.style.display = "none";
    // Grow Yes button to fill most of the container row
    yesBtn.style.transform = "scale(1.6)";
    yesBtn.style.margin = "10px auto";
    yesBtn.style.animation = "pulseLock 1.5s infinite ease-in-out";
  }
});

yesBtn.addEventListener("click", function () {
  // Move to Stage 3: YAYYYYYYY Celebration
  goToStage("stage-proposal", "stage-yay");

  // Trigger double-sided fireworks!
  triggerDoubleFireworks();

  // Setup default dates for later stage
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  document.getElementById("date-select").setAttribute("min", tomorrowStr);
  document.getElementById("date-select").value = tomorrowStr;
  document.getElementById("time-select").value = "19:00";

  // Automatically transition to Stage 4 after 3.5 seconds
  yayTimeout = setTimeout(() => {
    goToStage("stage-yay", "stage-datetime");
  }, 3500);
});

// YAY next button (to speed up transition manually)
document.getElementById("yay-next-btn").addEventListener("click", function () {
  if (yayTimeout) {
    clearTimeout(yayTimeout);
  }
  goToStage("stage-yay", "stage-datetime");
});

// 5. Double-sided fireworks effect
function triggerDoubleFireworks() {
  const duration = 3.5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    // Left Cannon
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.85 },
      colors: ["#ff5c8a", "#ff9ebe", "#2ec4b6", "#f7a072"],
    });
    // Right Cannon
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.85 },
      colors: ["#ff5c8a", "#ff9ebe", "#2ec4b6", "#f7a072"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// 6. Datetime Next Step
document
  .getElementById("datetime-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    selectedDate = document.getElementById("date-select").value;
    selectedTime = document.getElementById("time-select").value;

    if (!selectedDate || !selectedTime) {
      alert("Vui lòng chọn đầy đủ ngày và giờ đi chơi nhé!");
      return;
    }

    goToStage("stage-datetime", "stage-food");
  });

// 7. Food Selection Next Step
document.getElementById("food-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const foodEl = document.querySelector('input[name="food"]:checked');
  selectedFood = foodEl ? foodEl.value : "Chưa chọn";
  selectedMessage = document.getElementById("message").value.trim();

  // Format Date to DD/MM/YYYY for summary
  const dateParts = selectedDate.split("-");
  const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

  // Populate summary screen fields
  document.getElementById("sum-date").innerText = formattedDate;
  document.getElementById("sum-time").innerText = selectedTime;
  document.getElementById("sum-food").innerText = selectedFood;

  goToStage("stage-food", "stage-summary");
});

// 8. Confirm & Send — save to localStorage (works on Vercel static deploy)
document
  .getElementById("confirm-send-btn")
  .addEventListener("click", function () {
    const confirmBtn = document.getElementById("confirm-send-btn");

    // Disable button to prevent double submits
    confirmBtn.disabled = true;
    confirmBtn.innerHTML =
      'Đang gửi... <i class="fa-solid fa-spinner fa-spin"></i>';

    // Build record
    const dateParts = selectedDate.split("-");
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    const newDateRecord = {
      id: Date.now().toString(),
      name: userNameInput || "Nguyễn Phương Thủy",
      date: selectedDate,
      time: selectedTime,
      location: "Đi ăn " + selectedFood,
      food: selectedFood,
      message: selectedMessage,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem("datePlans") || "[]");
      existing.push(newDateRecord);
      localStorage.setItem("datePlans", JSON.stringify(existing));
    } catch (err) {
      console.warn("localStorage save failed:", err);
    }

    // Set summary cards in letter
    document.getElementById("summary-date").innerText = formattedDate;
    document.getElementById("summary-time").innerText = selectedTime;
    document.getElementById("summary-food").innerText = selectedFood;

    // Go to final Success Screen
    goToStage("stage-summary", "stage-success");

    // Trigger envelope opening animation
    setTimeout(() => {
      const successCard = document.getElementById("stage-success");
      successCard.classList.add("open-envelope");

      // Show detail info and countdown
      setTimeout(() => {
        document.getElementById("success-info").classList.remove("hidden");
      }, 1200);

      // Run countdown clock and confetti burst
      startCountdown(selectedDate, selectedTime);

      // Final quick pop confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 500);
  });

// 9. Countdown Timer
function startCountdown(dateStr, timeStr) {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  const targetDateStr = `${dateStr}T${timeStr}:00`;
  const targetDate = new Date(targetDateStr);

  function updateTimer() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      document.querySelector(".countdown-timer").innerHTML = `
        <div style="font-size: 1.1rem; font-weight: 700; color: #ff5c8a; width: 100%; text-align: center; padding: 10px 0;">
          🎉 ĐÃ ĐẾN GIỜ HẸN RỒI! CHÚC TỤI MÌNH ĐI CHƠI VUI VẺ! 🙌
        </div>
      `;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("cd-days").innerText = days
      .toString()
      .padStart(2, "0");
    document.getElementById("cd-hours").innerText = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("cd-minutes").innerText = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("cd-seconds").innerText = seconds
      .toString()
      .padStart(2, "0");
  }

  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
}

// Init floating elements
window.addEventListener("DOMContentLoaded", () => {
  initFloatingHearts();
});
