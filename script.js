const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const parallaxArea = document.querySelector("[data-parallax-area]");
const followTarget = document.querySelector("[data-follow-target]");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const bestSellerGrid = document.querySelector(".best-seller-grid");
const homeJuiceCards = document.querySelectorAll('body[data-page="home"] .juice-grid .juice-card');

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (parallaxArea && followTarget && window.matchMedia("(min-width: 761px)").matches) {
  parallaxArea.addEventListener("mousemove", (event) => {
    const rect = parallaxArea.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    followTarget.style.transform = `translate(${x * 22}px, ${y * 16}px)`;
  });

  parallaxArea.addEventListener("mouseleave", () => {
    followTarget.style.transform = "translate(0, 0)";
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
  { threshold: 0.14 }
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

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const required = ["name", "phone", "email", "message"].map((key) =>
      String(data.get(key) || "").trim()
    );

    if (required.some((value) => !value)) {
      formStatus.textContent = "Please complete every field.";
      return;
    }

    if (String(data.get("_honey") || "").trim()) return;

    const email = String(data.get("email") || "").trim();
    data.append("_replyto", email);

    formStatus.textContent = "Sending your message...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      formStatus.textContent = "Message sent successfully. We will reach you by email soon.";
      contactForm.reset();
    } catch (error) {
      formStatus.textContent =
        "We could not send your message right now. Please email us directly at Info@qzeedrinks.in.";
    }
  });
}

homeJuiceCards.forEach((card) => {
  card.setAttribute("role", "link");
  card.setAttribute("tabindex", "0");

  const openProducts = () => {
    window.location.href = "products.html";
  };

  card.addEventListener("click", openProducts);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProducts();
    }
  });
});

if (bestSellerGrid) {
  const slides = Array.from(bestSellerGrid.querySelectorAll(".seller-card"));
  let activeIndex = 0;
  let autoSlideId;

  const goToSlide = (index) => {
    const nextSlide = slides[index];
    if (!nextSlide) return;

    bestSellerGrid.scrollTo({
      left: nextSlide.offsetLeft - bestSellerGrid.offsetLeft,
      behavior: "smooth"
    });
  };

  const startAutoSlide = () => {
    if (slides.length < 2) return;
    clearInterval(autoSlideId);
    autoSlideId = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % slides.length;
      goToSlide(activeIndex);
    }, 2600);
  };

  const stopAutoSlide = () => clearInterval(autoSlideId);

  startAutoSlide();

  bestSellerGrid.addEventListener("mouseenter", stopAutoSlide);
  bestSellerGrid.addEventListener("mouseleave", startAutoSlide);
  bestSellerGrid.addEventListener("touchstart", stopAutoSlide, { passive: true });
  bestSellerGrid.addEventListener("touchend", startAutoSlide, { passive: true });
}
