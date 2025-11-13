function initializeCountdown() {
  const countdownEl = document.querySelector('.countdown');
  const endDateStr = countdownEl.getAttribute('data-countdown');
  const targetDate = new Date(endDateStr);

  const daysEl = countdownEl.querySelector('.days');
  const hoursEl = countdownEl.querySelector('.hours');
  const minutesEl = countdownEl.querySelector('.minutes');
  const secondsEl = countdownEl.querySelector('.seconds');

  function updateCountdown() {
    const now = new Date();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
}

// Run countdown
initializeCountdown();
