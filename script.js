const EVENT_DATE = new Date("2026-08-16T15:00:00-05:00");
const pad = (value) => String(value).padStart(2, "0");

function updateCountdown() {
  const distance = Math.max(0, EVENT_DATE.getTime() - Date.now());
  document.querySelector("#days").textContent = pad(Math.floor(distance / 86400000));
  document.querySelector("#hours").textContent = pad(Math.floor((distance / 3600000) % 24));
  document.querySelector("#minutes").textContent = pad(Math.floor((distance / 60000) % 60));
  document.querySelector("#seconds").textContent = pad(Math.floor((distance / 1000) % 60));
  if (distance === 0) document.querySelector("#countdown-title").textContent = "¡ES HOY!";
}

updateCountdown();
setInterval(updateCountdown, 1000);
setTimeout(() => document.querySelector("#ignition").classList.add("ignition--done"), 1700);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector("#scroll-progress").style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}, { passive: true });

const heroVideo = document.querySelector("#hero-video");
document.querySelector("#sound-toggle").addEventListener("click", () => {
  heroVideo.muted = !heroVideo.muted;
  document.querySelector("#sound-label").textContent = heroVideo.muted ? "SONIDO OFF" : "SONIDO ON";
  document.querySelector(".sound-bars").classList.toggle("is-muted", heroVideo.muted);
  heroVideo.play().catch(() => {});
});

const gallery = document.querySelector("#gallery");
const galleryCards = [...gallery.querySelectorAll(".photo-card")];
const galleryButtons = [...document.querySelectorAll("[data-photo]")];
function updateGallery() {
  const center = gallery.scrollLeft + gallery.clientWidth / 2;
  let active = 0;
  let distance = Infinity;
  galleryCards.forEach((card, index) => {
    const nextDistance = Math.abs(center - (card.offsetLeft + card.offsetWidth / 2));
    if (nextDistance < distance) { active = index; distance = nextDistance; }
  });
  document.querySelector("#gallery-current").textContent = `0${active + 1}`;
  galleryButtons.forEach((button, index) => button.classList.toggle("is-active", index === active));
}
gallery.addEventListener("scroll", updateGallery, { passive: true });
galleryButtons.forEach((button) => button.addEventListener("click", () => {
  galleryCards[Number(button.dataset.photo)].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}));

const modal = document.querySelector("#rsvp-modal");
function openModal() { modal.hidden = false; document.body.style.overflow = "hidden"; modal.querySelector("input").focus(); }
function closeModal() { modal.hidden = true; document.body.style.overflow = ""; }
document.querySelectorAll(".open-rsvp").forEach((button) => button.addEventListener("click", openModal));
document.querySelector("#close-modal").addEventListener("click", closeModal);
modal.addEventListener("mousedown", (event) => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) closeModal(); });

document.querySelector("#rsvp-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    "🏁 *RSVP · Cumple de Ian Jafet*", "",
    `Piloto: ${data.get("name")}`,
    `Respuesta: ${data.get("attendance")}`,
    `Personas: ${data.get("guests")}`,
    data.get("note") ? `Mensaje: ${data.get("note")}` : "", "",
    "¡Nos vemos en la línea de salida! 🏎️💨"
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  closeModal();
});
