const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const followTarget = document.querySelector("[data-follow-target]");
const heroScene = document.querySelector(".hero-scene");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (
  followTarget &&
  heroScene &&
  window.matchMedia("(min-width: 761px)").matches
) {
  heroScene.addEventListener("mousemove", (event) => {
    const rect = heroScene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    followTarget.style.transform = `translate(${x * 26}px, ${y * 20}px) rotate(${x * 8}deg)`;
  });

  heroScene.addEventListener("mouseleave", () => {
    followTarget.style.transform = "translate(0, 0) rotate(0deg)";
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector(".faq-question");
  if (!button) return;

  button.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    document.querySelectorAll(".faq-item").forEach((faq) => faq.classList.remove("active"));
    if (!isActive) item.classList.add("active");
  });
});

const animateCounter = (element) => {
  const rawValue = element.dataset.counter;
  if (!rawValue) return;

  const target = Number.parseInt(rawValue, 10);
  if (Number.isNaN(target)) return;

  const suffix = element.textContent.trim().replace(/[0-9]/g, "");
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
    element.textContent = `${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));
