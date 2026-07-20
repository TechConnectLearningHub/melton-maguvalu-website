function initSiteInteractions() {
  /* ---------- Contact form: inline feedback instead of alert() ---------- */
  const contactForm = document.querySelector(".contact-form");
  const feedback = document.querySelector(".form-feedback");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;

      if (feedback) {
        feedback.textContent = "Thanks — your enquiry has been captured. We'll be in touch soon.";
        feedback.classList.remove("is-error");
        feedback.classList.add("is-visible");
      }

      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) submitBtn.disabled = false;
        const interest = contactForm.querySelector("[name='interest']");
        if (interest) interest.selectedIndex = 0;
      }, 600);
    });
  }

  /* ---------- Quick actions / journey cards pre-fill the interest field ---------- */
  document.querySelectorAll("[data-interest]").forEach(link => {
    link.addEventListener("click", () => {
      const interestField = document.querySelector(".contact-form [name='interest']");
      if (!interestField) return;
      const value = link.dataset.interest;
      const match = Array.from(interestField.options).find(opt => opt.value === value);
      if (match) {
        interestField.value = value;
        setTimeout(() => {
          const nameField = document.querySelector(".contact-form [name='name']");
          if (nameField) nameField.focus({ preventScroll: true });
        }, 450);
      }
    });
  });

  /* ---------- Business directory: search + filter + empty state ---------- */
  const search = document.getElementById("businessSearch");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".business-card");
  const emptyState = document.getElementById("businessEmpty");
  let activeFilter = "all";

  function applyBusinessFilters() {
    const term = (search?.value || "").toLowerCase().trim();
    let visibleCount = 0;
    cards.forEach(card => {
      const category = card.dataset.category || "";
      const text = card.textContent.toLowerCase();
      const matchesFilter = activeFilter === "all" || category === activeFilter;
      const matchesSearch = !term || text.includes(term);
      const show = matchesFilter && matchesSearch;
      card.style.display = show ? "block" : "none";
      if (show) visibleCount += 1;
    });
    if (emptyState) emptyState.classList.toggle("is-visible", visibleCount === 0);
  }

  if (search) search.addEventListener("input", applyBusinessFilters);
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      activeFilter = button.dataset.filter;
      applyBusinessFilters();
    });
  });

  /* ---------- Featured event countdown ---------- */
  const countdown = document.querySelector("[data-countdown]");
  if (countdown) {
    const target = new Date(countdown.dataset.countdown).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { countdown.textContent = "Event date ready to update"; return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      countdown.textContent = `${days} days ${hours} hours to go`;
    };
    tick();
    setInterval(tick, 3600000);
  }

  /* ---------- Photo marquee: pause on hover/tap ---------- */
  const marqueeTrack = document.getElementById("heroMarqueeTrack");
  if (marqueeTrack) {
    const pause = () => marqueeTrack.classList.add("is-paused");
    const resume = () => marqueeTrack.classList.remove("is-paused");
    marqueeTrack.addEventListener("mouseenter", pause);
    marqueeTrack.addEventListener("mouseleave", resume);
    marqueeTrack.addEventListener("touchstart", pause, { passive: true });
    marqueeTrack.addEventListener("touchend", resume, { passive: true });
    marqueeTrack.addEventListener("focusin", pause);
    marqueeTrack.addEventListener("focusout", resume);
  }

  /* ---------- Header: elevate on scroll ---------- */
  const header = document.querySelector(".site-header[data-elevate]");
  if (header) {
    const setElevation = () => header.classList.toggle("is-elevated", window.scrollY > 8);
    setElevation();
    window.addEventListener("scroll", setElevation, { passive: true });
  }

  /* ---------- Scroll-spy: highlight current section in nav + bottom nav ---------- */
  const navLinks = document.querySelectorAll(".desktop-nav a[href^='#'], .bottom-nav a[href^='#']");
  const sectionIds = Array.from(new Set(
    Array.from(navLinks)
      .map(a => a.getAttribute("href"))
      .filter(href => href && href.length > 1)
      .map(href => href.slice(1))
  ));
  const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  if (sectionEls.length && "IntersectionObserver" in window) {
    const setActive = (id) => {
      navLinks.forEach(link => {
        const isMatch = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isMatch);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });

    sectionEls.forEach(section => observer.observe(section));
  }
}

document.addEventListener("sectionsLoaded", initSiteInteractions);
document.addEventListener("DOMContentLoaded", initSiteInteractions);
