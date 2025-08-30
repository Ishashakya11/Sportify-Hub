// Mobile nav toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Player modal
const playerCards = document.querySelectorAll(".player-card");
const modal = document.getElementById("playerModal");
const modalBody = modal.querySelector(".modal-body");
const closeBtn = modal.querySelector(".close");

playerCards.forEach(card => {
  card.addEventListener("click", () => {
    const data = card.getAttribute("data-player").split(",");
    modalBody.innerHTML = `
      <h2>${data[0]}</h2>
      <p><strong>Position:</strong> ${data[1]}</p>
      <p><strong>Number:</strong> ${data[2]}</p>
      <p>${data[3]}</p>
    `;
    modal.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
