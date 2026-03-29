const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const parallaxArea = document.querySelector("[data-parallax-area]");
const followTarget = document.querySelector("[data-follow-target]");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (parallaxArea && followTarget && window.matchMedia("(min-width: 761px)").matches) {
  parallaxArea.addEventListener("mousemove", (event) => {
    const rect = parallaxArea.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    followTarget.style.transform =
      `translate3d(${x * 30}px, ${y * 24}px, 0) rotate(${x * 11}deg)`;
  });

  parallaxArea.addEventListener("mouseleave", () => {
    followTarget.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".faq-item").forEach((item) => {
  const trigger = item.querySelector(".faq-question");
  if (!trigger) return;

  trigger.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    document.querySelectorAll(".faq-item").forEach((faq) => faq.classList.remove("active"));
    if (!isActive) item.classList.add("active");
  });
});

const animateCounter = (element) => {
  const target = Number.parseInt(element.dataset.counter || "", 10);
  if (Number.isNaN(target)) return;

  const suffix = element.textContent.replace(/[0-9]/g, "");
  const startTime = performance.now();
  const duration = 1200;

  const frame = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const value = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
    element.textContent = `${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
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

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const values = ["name", "phone", "email", "message"].map((key) =>
      String(data.get(key) || "").trim()
    );

    if (values.some((value) => !value)) {
      formStatus.textContent = "Please complete all fields before sending your message.";
      return;
    }

    formStatus.textContent =
      "Message prepared successfully. You can connect this form to email, WhatsApp, or your backend next.";
    contactForm.reset();
  });
}
