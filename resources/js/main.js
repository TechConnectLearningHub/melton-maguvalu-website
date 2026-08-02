/* ==========================================================================
   Homepage and dynamically loaded section interactions
   ========================================================================== */

function initSiteInteractions() {
  const root = document;

  /* ---------- Contact form: inline feedback instead of alert() ---------- */
  const contactForm = root.querySelector(".contact-form");
  const feedback = root.querySelector(".form-feedback");

  if (contactForm && contactForm.dataset.contactInitialised !== "true") {
    contactForm.dataset.contactInitialised = "true";

    contactForm.addEventListener("submit", event => {
      event.preventDefault();

      const submitBtn = contactForm.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;

      if (feedback) {
        feedback.textContent =
          "Thanks — your enquiry has been captured. We'll be in touch soon.";
        feedback.classList.remove("is-error");
        feedback.classList.add("is-visible");
      }

      window.setTimeout(() => {
        contactForm.reset();

        if (submitBtn) submitBtn.disabled = false;

        const interest = contactForm.querySelector("[name='interest']");
        if (interest) interest.selectedIndex = 0;
      }, 600);
    });
  }

  /* ---------- Quick actions / journey cards pre-fill the interest field ---------- */
  root.querySelectorAll("[data-interest]").forEach(link => {
    if (link.dataset.interestInitialised === "true") return;
    link.dataset.interestInitialised = "true";

    link.addEventListener("click", () => {
      const interestField = root.querySelector(".contact-form [name='interest']");
      if (!interestField) return;

      const value = link.dataset.interest;
      const match = Array.from(interestField.options).find(
        option => option.value === value
      );

      if (!match) return;

      interestField.value = value;

      window.setTimeout(() => {
        const nameField = root.querySelector(".contact-form [name='name']");
        if (nameField) nameField.focus({ preventScroll: true });
      }, 450);
    });
  });

  /* ---------- Business directory: search + filter + empty state ---------- */
  const search = root.getElementById("businessSearch");
  const filterButtons = [...root.querySelectorAll("[data-filter]")];
  const cards = [...root.querySelectorAll(".business-card")];
  const emptyState = root.getElementById("businessEmpty");

  if (search && search.dataset.mainDirectoryInitialised !== "true") {
    search.dataset.mainDirectoryInitialised = "true";
    let activeFilter = "all";

    const applyBusinessFilters = () => {
      const term = search.value.toLowerCase().trim();
      let visibleCount = 0;

      cards.forEach(card => {
        const category = card.dataset.category || "";
        const text = card.textContent.toLowerCase();

        const matchesFilter =
          activeFilter === "all" || category === activeFilter;

        const matchesSearch =
          !term || text.includes(term);

        const shouldShow = matchesFilter && matchesSearch;

        card.hidden = !shouldShow;

        if (shouldShow) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.classList.toggle("is-visible", visibleCount === 0);
      }
    };

    search.addEventListener("input", applyBusinessFilters);

    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        filterButtons.forEach(item => {
          item.classList.remove("active");
          item.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        activeFilter = button.dataset.filter || "all";
        applyBusinessFilters();
      });
    });

    applyBusinessFilters();
  }

  /* ---------- Featured event countdown ---------- */
  const countdown = root.querySelector("[data-countdown]");

  if (countdown && countdown.dataset.countdownInitialised !== "true") {
    countdown.dataset.countdownInitialised = "true";

    const target = new Date(countdown.dataset.countdown).getTime();

    const tick = () => {
      const diff = target - Date.now();

      if (!Number.isFinite(target) || diff <= 0) {
        countdown.textContent = "Event date ready to update";
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);

      countdown.textContent = `${days} days ${hours} hours to go`;
    };

    tick();
    window.setInterval(tick, 3600000);
  }

  /* ---------- Photo marquee: pause on hover/tap/focus ---------- */
  const marqueeTrack = root.getElementById("heroMarqueeTrack");

  if (marqueeTrack && marqueeTrack.dataset.marqueeInitialised !== "true") {
    marqueeTrack.dataset.marqueeInitialised = "true";

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
  const header = root.querySelector(".site-header[data-elevate]");

  if (header && header.dataset.elevationInitialised !== "true") {
    header.dataset.elevationInitialised = "true";

    const setElevation = () => {
      header.classList.toggle("is-elevated", window.scrollY > 8);
    };

    setElevation();
    window.addEventListener("scroll", setElevation, { passive: true });
  }

  /* ---------- Accessible values flip cards ---------- */
  root.querySelectorAll(".value-flip-card").forEach(card => {
    if (card.dataset.flipInitialised === "true") return;
    card.dataset.flipInitialised = "true";

    const trigger = card.querySelector(".value-flip-trigger");
    if (!trigger) return;

    const setFlipped = isFlipped => {
      card.classList.toggle("is-flipped", isFlipped);
      trigger.setAttribute("aria-pressed", String(isFlipped));
    };

    trigger.addEventListener("click", () => {
      setFlipped(!card.classList.contains("is-flipped"));
    });

    trigger.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        setFlipped(false);
        trigger.blur();
      }
    });
  });

  /* ---------- Scroll-spy: highlight current section ---------- */
  const navLinks = [
    ...root.querySelectorAll(
      ".desktop-nav a[href^='#'], .bottom-nav a[href^='#']"
    )
  ];

  const sectionIds = [
    ...new Set(
      navLinks
        .map(link => link.getAttribute("href"))
        .filter(href => href && href.length > 1)
        .map(href => href.slice(1))
    )
  ];

  const sectionEls = sectionIds
    .map(id => root.getElementById(id))
    .filter(Boolean);

  if (
    sectionEls.length &&
    "IntersectionObserver" in window &&
    !root.documentElement.dataset.scrollSpyInitialised
  ) {
    root.documentElement.dataset.scrollSpyInitialised = "true";

    const setActive = id => {
      navLinks.forEach(link => {
        const isMatch = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isMatch);
        link.toggleAttribute("aria-current", isMatch);
      });
    };

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(visible.target.id);
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    sectionEls.forEach(section => observer.observe(section));
  }
}

document.addEventListener("sectionsLoaded", initSiteInteractions);
document.addEventListener("DOMContentLoaded", initSiteInteractions);
