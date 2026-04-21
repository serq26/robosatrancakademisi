const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section[id]");
const revealElements = document.querySelectorAll(".reveal");
const faqItems = document.querySelectorAll(".faq-item");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxVisual = document.getElementById("lightboxVisual");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById("lightboxDescription");
const lightboxClose = document.querySelector(".lightbox-close");
const showcaseVideoTrigger = document.querySelector(".video-preview");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

// Aktif menü durumunu görünür bölüme göre günceller.
const updateActiveNavLink = () => {
  const headerOffset = (document.querySelector(".header")?.offsetHeight || 0) + 24;
  const scrollPosition = window.scrollY + headerOffset;

  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = currentSectionId && link.getAttribute("href") === `#${currentSectionId}`;
    link.classList.toggle("active", isActive);
  });
};

window.addEventListener("scroll", updateActiveNavLink, { passive: true });
window.addEventListener("resize", updateActiveNavLink);
window.addEventListener("load", updateActiveNavLink);
updateActiveNavLink();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  button.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((faqItem) => {
      faqItem.classList.remove("active");
      faqItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      faqItem.querySelector(".faq-answer").style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

const clearLightboxVisual = () => {
  lightboxVisual.innerHTML = "";
  lightboxVisual.style.backgroundImage = "";
  lightboxVisual.classList.remove("has-video");
};

const openLightbox = ({ title, description, image, video, poster, type = "image" }) => {
  lightboxTitle.textContent = title;
  lightboxDescription.textContent = description;
  clearLightboxVisual();

  if (type === "video" && video) {
    const videoElement = document.createElement("video");
    videoElement.src = video;
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.preload = "metadata";

    if (poster) {
      videoElement.poster = poster;
    }

    lightboxVisual.classList.add("has-video");
    lightboxVisual.appendChild(videoElement);
  } else if (image) {
    lightboxVisual.style.backgroundImage = `url("${image}")`;
  }

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
};

const closeLightbox = () => {
  const activeVideo = lightboxVisual.querySelector("video");

  if (activeVideo) {
    activeVideo.pause();
    activeVideo.currentTime = 0;
  }

  clearLightboxVisual();
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
};

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    openLightbox({
      title: item.dataset.title,
      description: item.dataset.description,
      image: item.dataset.image,
    });
  });
});

if (showcaseVideoTrigger) {
  showcaseVideoTrigger.addEventListener("click", () => {
    openLightbox({
      title: showcaseVideoTrigger.dataset.title,
      description: showcaseVideoTrigger.dataset.description,
      video: showcaseVideoTrigger.dataset.video,
      poster: showcaseVideoTrigger.dataset.poster,
      type: showcaseVideoTrigger.dataset.lightboxType,
    });
  });
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});
