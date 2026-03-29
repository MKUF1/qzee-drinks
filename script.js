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
    followTarget.style.transform = `translate3d(${x * 26}px, ${y * 18}px, 0)`;
  });

  parallaxArea.addEventListener("mouseleave", () => {
    followTarget.style.transform = "translate3d(0, 0, 0)";
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
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

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const values = ["name", "phone", "email", "message"].map((key) =>
      String(data.get(key) || "").trim()
    );

    if (values.some((value) => !value)) {
      formStatus.textContent = "Please complete every field.";
      return;
    }

    formStatus.textContent = "Message ready. Connect this form to email or WhatsApp anytime.";
    contactForm.reset();
  });
}
