// ===== Shared header, footer and icons =====
// Edit this one file and every page updates.

const LINKS = {
  linkedin: "https://www.linkedin.com/in/mih-thierry-01a104377",
  pinterest: "https://pin.it/66Hg5fz6U",
  github: "https://github.com/THI3RRY-ui",
  whatsapp: "https://wa.me/237654989932",
  email: "mailto:mihthierry237@gmail.com",
};

// Services: used by the header menu, the home page button and the Services page
const SERVICES = [
  {
    icon: "code",
    name: "Developer",
    text: "Websites, mobile apps and AI tools",
    href: "developer.html",
  },
  {
    icon: "pen",
    name: "Branding and Design",
    text: "Logos, posters and graphics",
    href: "design.html",
  },
  {
    icon: "ticket",
    name: "Event technology",
    text: "Registration, payments and attendee data for conferences",
    href: "events.html",
  },
];

// Header menu: [link, label, key]
const MENU = [
  ["about.html", "About", "about"],
  ["services", "Services", "services"],
  ["experience.html", "Experience", "experience"],
  ["skills.html", "Skills", "skills"],
  ["contact.html", "Contact", "contact"],
];

// Which menu item is highlighted on each page
const SECTION = {
  about: "about",
  services: "services",
  developer: "services",
  design: "services",
  events: "services",
  rentveed: "services",
  safetiding: "services",
  typofeel: "services",
  africsis: "services",
  "lion-force": "services",
  experience: "experience",
  skills: "skills",
  contact: "contact",
};

const ICONS = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  chat: '<path d="M4 20l1.5-4A8 8 0 1 1 8 18.5z"/>',
  in: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7M8 7v.01M12 17v-7M12 13a3 3 0 0 1 6 0v4"/>',
  code: '<path d="M9 8l-5 4 5 4M15 8l5 4-5 4M13.5 5l-3 14"/>',
  pin: '<path d="M12 3a6 6 0 0 0-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 0 0-6-6z"/><circle cx="12" cy="9" r="2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 7l3 3"/>',
  users:
    '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M16 5a3 3 0 0 1 0 6M18 14c2 1 3 3 3 6"/>',
  ticket: '<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4z"/><path d="M14 6v12"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
};

const icon = (name, cls = "ic") =>
  `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const external = (url) => (url.startsWith("mailto") ? "" : ' target="_blank" rel="noopener"');

const serviceMenu = () => `
  <div class="menu">
    ${SERVICES.map(
      (s) => `
      <a href="${s.href}">
        <span class="mi">${icon(s.icon)}</span>
        <span><b>${s.name}</b><small>${s.text}</small></span>
      </a>`,
    ).join("")}
    <a class="all" href="services.html">See all services ${icon("arrow")}</a>
  </div>`;

const headerHTML = (page) => {
  const active = SECTION[page] || "";
  const items = MENU.map(([href, label, key]) => {
    const on = key === active ? " on" : "";
    if (href !== "services") return `<a class="l${on}" href="${href}">${label}</a>`;
    return `<div class="dd"><button class="l${on}" aria-expanded="false" aria-haspopup="true">${label} ${icon("down", "ic dn")}</button>${serviceMenu()}</div>`;
  }).join("");

  return `
  <nav class="top">
    <div class="w">
      <a class="me" href="index.html">
        <span class="logo"><img src="images/logo.jpg" alt="" onerror="fb(this)" /></span>
        Mih Thierry
      </a>
      <div class="dl">${items}<a class="l m" href="contact.html">Hire me</a></div>
      <a class="pill" href="contact.html">Hire me</a>
      <button id="mb" aria-label="Menu" aria-expanded="false"><i></i></button>
    </div>
  </nav>`;
};

const footerHTML = () => {
  const social = [
    ["mail", "Email", LINKS.email],
    ["chat", "WhatsApp", LINKS.whatsapp],
    ["in", "LinkedIn", LINKS.linkedin],
    ["pin", "Pinterest", LINKS.pinterest],
    ["code", "GitHub", LINKS.github],
  ];
  const pages = MENU.filter(([href]) => href !== "services");
  return `
  <footer>
    <div class="w">
      <div class="fg">
        <div class="fa">
          <h2>Need a website, an app, a brand or your conference tech handled?</h2>
          <p>Based in Douala, Cameroon. Open to freelance work, internships, graduate roles, collaborations and new communities.</p>
          <a class="btn" href="contact.html">Contact and hire me</a>
        </div>
        <div class="fc">
          <h3>Pages</h3>
          ${pages.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
        </div>
        <div class="fc">
          <h3>Services</h3>
          ${SERVICES.map((s) => `<a href="${s.href}">${s.name}</a>`).join("")}
        </div>
        <div class="fc">
          <h3>Connect</h3>
          ${social.map(([i, n, u]) => `<a href="${u}"${external(u)}>${icon(i)}${n}</a>`).join("")}
        </div>
      </div>
      <div class="fb">
        <small>© ${new Date().getFullYear()} Mih Thierry Aji</small>
        <small>Tech Developer for Community Impact</small>
      </div>
    </div>
  </footer>`;
};

// Back link shown on service and project pages
const PARENT = {
  developer: ["services.html", "All services"],
  design: ["services.html", "All services"],
  events: ["services.html", "All services"],
  rentveed: ["developer.html", "Developer"],
  safetiding: ["developer.html", "Developer"],
  typofeel: ["developer.html", "Developer"],
  africsis: ["developer.html", "Developer"],
  "lion-force": ["developer.html", "Developer"],
};

// Build the page
const page = document.body.dataset.page;
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${Object.entries(
  ICONS,
)
  .map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`)
  .join("")}</defs></svg>`;
document.body.insertAdjacentHTML("afterbegin", sprite);
document.getElementById("site-header").innerHTML = headerHTML(page);
document.getElementById("site-footer").innerHTML = footerHTML();

// Favicon: save your logo as images/logo.jpg
document.head.insertAdjacentHTML("beforeend", '<link rel="icon" href="images/logo.jpg" />');

// Services button on the home page
document.querySelectorAll("[data-services]").forEach((el) => {
  el.className = "dd dd-hero";
  el.innerHTML = `<button class="btn" aria-expanded="false" aria-haspopup="true">My services ${icon("down", "ic dn")}</button>${serviceMenu()}`;
});

// Dropdowns: click to open, click outside or press Escape to close
document.addEventListener("click", (event) => {
  const button = event.target.closest(".dd > button");
  document.querySelectorAll(".dd.open").forEach((menu) => {
    if (!button || menu !== button.parentNode) menu.classList.remove("open");
  });
  if (button) {
    const isOpen = button.parentNode.classList.toggle("open");
    button.setAttribute("aria-expanded", isOpen);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape")
    document.querySelectorAll(".dd.open").forEach((m) => m.classList.remove("open"));
});

// Skip link for keyboard users
document.querySelector("main").id = "main";
document.body.insertAdjacentHTML("afterbegin", '<a class="skip" href="#main">Skip to content</a>');

// Back link on service and project pages
if (PARENT[page]) {
  const [href, label] = PARENT[page];
  const heroBox = document.querySelector(".hero .w");
  if (heroBox)
    heroBox.insertAdjacentHTML(
      "afterbegin",
      `<a class="crumb" href="${href}">${icon("arrow")}${label}</a>`,
    );
}

// Mobile action bar: WhatsApp and Hire me are always one tap away
document.body.insertAdjacentHTML(
  "beforeend",
  `<div class="dock">
    <a class="d1" href="${LINKS.whatsapp}" target="_blank" rel="noopener">${icon("chat")}WhatsApp</a>
    <a class="d2" href="contact.html">Hire me</a>
  </div>`,
);

// Header becomes a little slimmer after you start scrolling
const topBar = document.querySelector("nav.top");
addEventListener("scroll", () => topBar.classList.toggle("scrolled", window.scrollY > 20), {
  passive: true,
});
