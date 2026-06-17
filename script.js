const root = document.documentElement;
const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const storedTheme = localStorage.getItem("theme");
const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetScrollToTop() {
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

resetScrollToTop();

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    resetScrollToTop();
    setTimeout(resetScrollToTop, 0);
  });
});

window.addEventListener("pageshow", resetScrollToTop);

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
}

setTheme(storedTheme || (preferredDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navAnchors.forEach((anchor) => {
  anchor.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((anchor) => {
        anchor.classList.toggle("active", anchor.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
);

sections.forEach((section) => {
  activeObserver.observe(section);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
});
