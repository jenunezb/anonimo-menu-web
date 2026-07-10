const book = document.querySelector("main");
const pages = [...document.querySelectorAll("main > section")];
const previousButton = document.querySelector(".book-prev");
const nextButton = document.querySelector(".book-next");
const currentLabel = document.querySelector(".book-controls b");
const totalLabel = document.querySelector(".book-controls i");
let currentPage = 0;
let wheelLocked = false;

totalLabel.textContent = String(pages.length).padStart(2, "0");

function updateControls(index) {
  currentPage = Math.max(0, Math.min(index, pages.length - 1));
  currentLabel.textContent = String(currentPage + 1).padStart(2, "0");
  previousButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === pages.length - 1;
}

function goToPage(index) {
  const target = Math.max(0, Math.min(index, pages.length - 1));
  book.scrollTo({ left: target * book.clientWidth, behavior: "smooth" });
  updateControls(target);
}

previousButton.addEventListener("click", () => goToPage(currentPage - 1));
nextButton.addEventListener("click", () => goToPage(currentPage + 1));

document.addEventListener("keydown", (event) => {
  if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); goToPage(currentPage + 1); }
  if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); goToPage(currentPage - 1); }
});

book.addEventListener("wheel", (event) => {
  const active = pages[currentPage];
  const forward = event.deltaY > 0 || event.deltaX > 0;
  const inside = active.scrollHeight > active.clientHeight;
  const atTop = active.scrollTop <= 1;
  const atBottom = active.scrollTop + active.clientHeight >= active.scrollHeight - 1;
  if (inside && ((forward && !atBottom) || (!forward && !atTop))) return;
  event.preventDefault();
  if (wheelLocked || Math.max(Math.abs(event.deltaX), Math.abs(event.deltaY)) < 12) return;
  wheelLocked = true;
  goToPage(currentPage + (forward ? 1 : -1));
  setTimeout(() => { wheelLocked = false; }, 650);
}, { passive: false });

let scrollTimer;
book.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => updateControls(Math.round(book.scrollLeft / book.clientWidth)), 80);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", (event) => {
  const target = document.querySelector(link.getAttribute("href"));
  const index = pages.indexOf(target);
  if (index >= 0) { event.preventDefault(); goToPage(index); }
}));

updateControls(0);
