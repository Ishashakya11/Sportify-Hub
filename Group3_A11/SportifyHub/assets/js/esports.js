// Game filter
const filterBtns = document.querySelectorAll(".game-filter button");
const cards = document.querySelectorAll(".game-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const game = btn.dataset.game;
    cards.forEach(card => {
      card.style.display = (game === "all" || card.dataset.game === game) ? "block" : "none";
    });
  });
});

// Countdown timers
function updateCountdown() {
  document.querySelectorAll(".countdown").forEach(el => {
    const target = new Date(el.dataset.time).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff <= 0) {
      el.textContent = "Live Now!";
    } else {
      const h = Math.floor((diff % (1000*60*60*24))/(1000*60*60));
      const m = Math.floor((diff % (1000*60*60))/(1000*60));
      const s = Math.floor((diff % (1000*60))/1000);
      el.textContent = `${h}h ${m}m ${s}s`;
    }
  });
}
setInterval(updateCountdown, 1000);
