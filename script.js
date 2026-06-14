const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const form = document.querySelector(".lead-form");

toggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const nome = data.get("nome");
  const telefone = data.get("telefone");
  const interesse = data.get("interesse");
  const mensagem = data.get("mensagem") || "Sem mensagem adicional.";

  const text = [
    "Olá, quero fazer uma simulação com a Seven Gold.",
    "",
    `Nome: ${nome}`,
    `WhatsApp: ${telefone}`,
    `Interesse: ${interesse}`,
    `Mensagem: ${mensagem}`,
  ].join("\n");

  window.open(`https://wa.me/551190382161?text=${encodeURIComponent(text)}`, "_blank", "noreferrer");
});
