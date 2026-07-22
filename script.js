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
const statsSections = document.querySelectorAll(".home-stats, .success-stats");
const countUpFormatter = new Intl.NumberFormat("pt-BR");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatCountUpNumber(element, value) {
  const prefix = element.dataset.prefix || "";
  const suffix = element.dataset.suffix || "";
  return `${prefix}${countUpFormatter.format(value)}${suffix}`;
}

function showFinalCountUpNumbers(section) {
  const numbers = [...section.querySelectorAll("[data-count-up]")];
  numbers.forEach((element) => {
    element.textContent = formatCountUpNumber(element, Number(element.dataset.countUp));
  });
}

function animateCountUpNumbers(section) {
  const numbers = [...section.querySelectorAll("[data-count-up]")];
  const duration = 1700;
  const startTime = performance.now();

  function updateCountUpNumbers(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    numbers.forEach((element) => {
      const finalValue = Number(element.dataset.countUp);
      const currentValue = Math.round(finalValue * easedProgress);
      element.textContent = formatCountUpNumber(element, currentValue);
    });

    if (progress < 1) {
      window.requestAnimationFrame(updateCountUpNumbers);
      return;
    }

    showFinalCountUpNumbers(section);
  }

  window.requestAnimationFrame(updateCountUpNumbers);
}

statsSections.forEach((section) => {
  const numbers = [...section.querySelectorAll("[data-count-up]")];
  if (!numbers.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    showFinalCountUpNumbers(section);
  } else {
    numbers.forEach((element) => {
      element.textContent = formatCountUpNumber(element, 0);
    });

    const countUpObserver = new IntersectionObserver(([entry], observer) => {
      if (!entry.isIntersecting) return;
      animateCountUpNumbers(section);
      observer.disconnect();
    }, { threshold: 0.3, rootMargin: "0px 0px -6% 0px" });

    countUpObserver.observe(section);
  }
});

if ("IntersectionObserver" in window && !prefersReducedMotion) {
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
  return 2;
}

function getPageStarts() {
  const n = specialistCards.length;
  if (n === 0) return [];
  const v = visibleSpecialists();
  if (v >= n) return [0];
  const starts = [];
  let current = 0;
  while (current < n - v) {
    starts.push(current);
    current += v;
  }
  starts.push(n - v);
  return [...new Set(starts)];
}

function specialistPages() {
  return getPageStarts().length;
}

function getCardScrollPosition(cardIndex) {
  const card = specialistCards[cardIndex];
  if (!card || !specialistsTrack) return 0;
  const trackRect = specialistsTrack.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  return specialistsTrack.scrollLeft + cardRect.left - trackRect.left;
}

function renderSpecialistDots() {
  if (!carouselDots) return;
  carouselDots.innerHTML = "";
  const pages = getPageStarts();
  for (let index = 0; index < pages.length; index += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver grupo ${index + 1} de especialistas`);
    dot.classList.toggle("active", index === activeSpecialist);
    dot.addEventListener("click", () => moveToSpecialist(index));
    carouselDots.appendChild(dot);
  }
}

function showSpecialist(index) {
  const pages = getPageStarts();
  if (pages.length === 0) return;
  activeSpecialist = (index + pages.length) % pages.length;
  const targetCardIndex = pages[activeSpecialist];
  const targetScrollLeft = getCardScrollPosition(targetCardIndex);
  specialistsTrack?.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
  carouselDots?.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSpecialist);
  });
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
    const pages = getPageStarts();
    const currentScroll = specialistsTrack.scrollLeft;
    
    let closestPageIndex = 0;
    let minDifference = Infinity;
    
    pages.forEach((cardIndex, pageIndex) => {
      const targetScroll = getCardScrollPosition(cardIndex);
      const diff = Math.abs(currentScroll - targetScroll);
      if (diff < minDifference) {
        minDifference = diff;
        closestPageIndex = pageIndex;
      }
    });
    
    if (closestPageIndex !== activeSpecialist) {
      activeSpecialist = closestPageIndex;
      carouselDots?.querySelectorAll("button").forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === activeSpecialist);
      });
    }
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
