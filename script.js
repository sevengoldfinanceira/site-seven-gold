const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const form = document.querySelector(".lead-form");
const brand = document.querySelector(".site-header .brand");

function scrollToPageStart(event) {
  const isHomePage = !document.body.classList.contains("inner-page");
  if (!isHomePage) return;

  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", `${location.pathname}${location.search}`);
}

brand?.addEventListener("click", scrollToPageStart);

document.querySelectorAll('.main-nav a[href="#inicio"], .footer a[href="#inicio"]').forEach((link) => {
  link.addEventListener("click", scrollToPageStart);
});

function updateHeaderAppearance() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeaderAppearance, { passive: true });
updateHeaderAppearance();

const dreamWall = document.querySelector(".dream-wall");

if (dreamWall) {
  const photos = [...dreamWall.children];

  for (let index = photos.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [photos[index], photos[randomIndex]] = [photos[randomIndex], photos[index]];
  }

  const shuffledPhotos = document.createDocumentFragment();
  photos.forEach((photo) => shuffledPhotos.appendChild(photo));
  dreamWall.appendChild(shuffledPhotos);
}

const featuredClientCards = document.querySelector(".client-cards");

if (featuredClientCards) {
  const cards = [...featuredClientCards.children];

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }

  const shuffledCards = document.createDocumentFragment();
  cards.forEach((card) => shuffledCards.appendChild(card));
  featuredClientCards.appendChild(shuffledCards);
}

const animatedSections = [...document.querySelectorAll("main > section")];

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("reveal-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  animatedSections.forEach((section) => {
    section.classList.add("reveal-section");
    sectionObserver.observe(section);
  });
} else {
  animatedSections.forEach((section) => section.classList.add("reveal-section", "reveal-visible"));
}

toggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", (event) => {
    header.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");

    const isMobileContactLink =
      link.getAttribute("href") === "#contato" &&
      window.matchMedia("(max-width: 900px)").matches;
    const footerContact = document.querySelector(".footer-contact");

    if (!isMobileContactLink || !footerContact) return;

    event.preventDefault();
    footerContact.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `${location.pathname}${location.search}#contato`);
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const nome = data.get("nome");
  const telefone = data.get("telefone");
  const interesse = data.get("interesse");
  const mensagem = data.get("mensagem") || "Sem mensagem adicional.";
  const valorImovel = data.get("valor_imovel");
  const entrada = data.get("entrada");
  const valorParcela = data.get("valor_parcela");

  const text = [
    "Olá, quero fazer uma simulação com a Seven Gold.",
    "",
    `Nome: ${nome}`,
    `WhatsApp: ${telefone}`,
    `Interesse: ${interesse}`,
    valorImovel ? `Valor aproximado do imóvel: ${valorImovel}` : null,
    entrada ? `Valor disponível para entrada: ${entrada}` : null,
    valorParcela ? `Valor da parcela: ${valorParcela}` : null,
    `Mensagem: ${mensagem}`,
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/551190382161?text=${encodeURIComponent(text)}`, "_blank", "noreferrer");
});

const specialistsTrack = document.querySelector(".specialists-track");
const specialistCards = [...document.querySelectorAll(".specialist-card")];
const carouselDots = document.querySelector(".carousel-dots");
const previousSpecialist = document.querySelector(".carousel-prev");
const nextSpecialist = document.querySelector(".carousel-next");
const specialistCarousel = document.querySelector(".specialists-carousel");
let activeSpecialist = 0;
let specialistAutoTimer;
let specialistCarouselVisible = false;
let specialistCarouselPaused = false;

function visibleSpecialists() {
  if (window.innerWidth <= 650) return 1;
  if (window.innerWidth <= 1000) return 2;
  return 3;
}

function specialistPages() {
  return Math.ceil(specialistCards.length / visibleSpecialists());
}

function renderSpecialistDots() {
  if (!carouselDots) return;
  carouselDots.innerHTML = "";
  for (let index = 0; index < specialistPages(); index += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver grupo ${index + 1} de especialistas`);
    dot.classList.toggle("active", index === activeSpecialist);
    dot.addEventListener("click", () => moveToSpecialist(index));
    carouselDots.appendChild(dot);
  }
}

function showSpecialist(index) {
  activeSpecialist = (index + specialistPages()) % specialistPages();
  specialistsTrack?.scrollTo({ left: specialistsTrack.clientWidth * activeSpecialist, behavior: "smooth" });
  carouselDots?.querySelectorAll("button").forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === activeSpecialist));
}

function stopSpecialistAutoPlay() {
  window.clearTimeout(specialistAutoTimer);
}

function scheduleSpecialistAutoPlay() {
  stopSpecialistAutoPlay();
  if (!specialistCarouselVisible || specialistCarouselPaused || specialistPages() <= 1 || document.hidden) return;

  specialistAutoTimer = window.setTimeout(() => {
    showSpecialist(activeSpecialist + 1);
    scheduleSpecialistAutoPlay();
  }, 2000);
}

function moveToSpecialist(index) {
  showSpecialist(index);
  scheduleSpecialistAutoPlay();
}

previousSpecialist?.addEventListener("click", () => moveToSpecialist(activeSpecialist - 1));
nextSpecialist?.addEventListener("click", () => moveToSpecialist(activeSpecialist + 1));

specialistsTrack?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveToSpecialist(activeSpecialist - 1);
  if (event.key === "ArrowRight") moveToSpecialist(activeSpecialist + 1);
});

specialistCarousel?.addEventListener("mouseenter", () => {
  specialistCarouselPaused = true;
  stopSpecialistAutoPlay();
});

specialistCarousel?.addEventListener("mouseleave", () => {
  specialistCarouselPaused = false;
  scheduleSpecialistAutoPlay();
});

specialistCarousel?.addEventListener("focusin", () => {
  specialistCarouselPaused = true;
  stopSpecialistAutoPlay();
});

specialistCarousel?.addEventListener("focusout", () => {
  specialistCarouselPaused = false;
  scheduleSpecialistAutoPlay();
});

specialistsTrack?.addEventListener("scroll", () => {
  window.clearTimeout(specialistsTrack.scrollTimer);
  specialistsTrack.scrollTimer = window.setTimeout(() => {
    const index = Math.round(specialistsTrack.scrollLeft / specialistsTrack.clientWidth);
    if (index !== activeSpecialist) showSpecialist(index);
  }, 80);
});

window.addEventListener("resize", () => {
  activeSpecialist = 0;
  renderSpecialistDots();
  specialistsTrack?.scrollTo({ left: 0 });
  scheduleSpecialistAutoPlay();
});

renderSpecialistDots();

if (specialistCarousel && "IntersectionObserver" in window) {
  const specialistVisibilityObserver = new IntersectionObserver(([entry]) => {
    specialistCarouselVisible = entry.isIntersecting;
    if (specialistCarouselVisible) scheduleSpecialistAutoPlay();
    else stopSpecialistAutoPlay();
  }, { threshold: 0.25 });
  specialistVisibilityObserver.observe(specialistCarousel);
} else if (specialistCarousel) {
  specialistCarouselVisible = true;
  scheduleSpecialistAutoPlay();
}

document.addEventListener("visibilitychange", scheduleSpecialistAutoPlay);
