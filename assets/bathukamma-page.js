(() => {
  const initialiseBathukammaStory = () => {
    const stage = document.querySelector("[data-story-stage]");
    const slides = [...document.querySelectorAll("[data-story-slide]")];
    const tabs = [...document.querySelectorAll("[data-story-tab]")];
    const previous = document.querySelector("[data-story-prev]");
    const next = document.querySelector("[data-story-next]");
    const toggle = document.querySelector("[data-story-toggle]");
    const toggleLabel = document.querySelector("[data-story-toggle-label]");
    const progress = document.querySelector("[data-story-progress]");

    if (!stage || slides.length === 0 || stage.dataset.initialised === "true")
      return;
    stage.dataset.initialised = "true";

    const duration = 7000;
    let currentIndex = 0;
    let paused = false;
    let timer = null;
    let progressFrame = null;
    let progressStart = 0;
    let remaining = duration;
    let pointerStartX = null;

    const setProgress = (value) => {
      if (progress)
        progress.style.width = `${Math.max(0, Math.min(1, value)) * 100}%`;
    };

    const stopTimer = () => {
      if (timer) window.clearTimeout(timer);
      timer = null;

      if (progressFrame) cancelAnimationFrame(progressFrame);
      progressFrame = null;
    };

    const animateProgress = (startTime) => {
      progressStart = startTime;

      const frame = (now) => {
        if (paused) return;

        const elapsed = now - progressStart;
        const ratio = Math.min(elapsed / remaining, 1);
        setProgress(ratio);

        if (ratio < 1) {
          progressFrame = requestAnimationFrame(frame);
        }
      };

      progressFrame = requestAnimationFrame(frame);
    };

    const updateTabsScroll = (index) => {
      const tab = tabs[index];
      const tabList = tab?.parentElement;
      if (!tab || !tabList) return;

      const targetLeft =
        tab.offsetLeft - (tabList.clientWidth - tab.offsetWidth) / 2;

      tabList.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    };

    const showSlide = (index, userInitiated = false) => {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });

      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === currentIndex;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-pressed", String(active));
      });

      setProgress(0);
      remaining = duration;
      updateTabsScroll(currentIndex);

      if (!paused) startTimer();

      if (
        userInitiated &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        stage.focus({ preventScroll: true });
      }
    };

    const startTimer = () => {
      stopTimer();

      if (
        paused ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setProgress(0);
        return;
      }

      animateProgress(performance.now());
      timer = window.setTimeout(() => {
        showSlide(currentIndex + 1);
      }, remaining);
    };

    const setPaused = (value) => {
      paused = value;
      toggle?.setAttribute("aria-pressed", String(paused));
      toggle?.setAttribute(
        "aria-label",
        paused
          ? "Resume automatic chapter progression"
          : "Pause automatic chapter progression",
      );

      if (toggleLabel) toggleLabel.textContent = paused ? "Play" : "Pause";

      if (paused) {
        stopTimer();
      } else {
        remaining = duration;
        setProgress(0);
        startTimer();
      }
    };

    previous?.addEventListener("click", () =>
      showSlide(currentIndex - 1, true),
    );
    next?.addEventListener("click", () => showSlide(currentIndex + 1, true));
    toggle?.addEventListener("click", () => setPaused(!paused));

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => showSlide(index, true));
    });

    stage.addEventListener("mouseenter", () => setPaused(true));
    stage.addEventListener("mouseleave", () => setPaused(false));
    stage.addEventListener("focusin", () => setPaused(true));
    stage.addEventListener("focusout", (event) => {
      if (!stage.contains(event.relatedTarget)) setPaused(false);
    });

    stage.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(currentIndex - 1, true);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(currentIndex + 1, true);
      }

      if (event.key === " ") {
        event.preventDefault();
        setPaused(!paused);
      }
    });

    stage.addEventListener("pointerdown", (event) => {
      pointerStartX = event.clientX;
      setPaused(true);
    });

    stage.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) return;

      const difference = event.clientX - pointerStartX;

      if (Math.abs(difference) > 45) {
        showSlide(currentIndex + (difference < 0 ? 1 : -1), true);
      }

      pointerStartX = null;
      if (!window.matchMedia("(max-width: 760px)").matches) {
        setPaused(false);
      }
    });

    document.addEventListener("visibilitychange", () => {
      setPaused(document.hidden);
    });

    showSlide(0);
  };

  document.addEventListener("DOMContentLoaded", initialiseBathukammaStory);
  document.addEventListener("sectionsLoaded", initialiseBathukammaStory);
})();

(() => {
  const pauseAutoplayOnSmallScreens = () => {
    const toggle = document.querySelector("[data-story-toggle]");
    if (!toggle || toggle.dataset.mobileAutoplayHandled === "true") return;

    toggle.dataset.mobileAutoplayHandled = "true";

    if (window.matchMedia("(max-width: 760px)").matches) {
      requestAnimationFrame(() => {
        if (toggle.getAttribute("aria-pressed") === "false") {
          toggle.click();
        }
      });
    }
  };

  document.addEventListener("DOMContentLoaded", pauseAutoplayOnSmallScreens);
  document.addEventListener("sectionsLoaded", pauseAutoplayOnSmallScreens);
})();

(() => {
  const initialisePhotoMarquee = () => {
    const marquee = document.querySelector("[data-photo-marquee]");
    const track = document.querySelector("[data-photo-track]");
    const previous = document.querySelector("[data-photo-prev]");
    const next = document.querySelector("[data-photo-next]");

    if (!marquee || !track || marquee.dataset.initialised === "true") return;
    marquee.dataset.initialised = "true";

    const originalCards = [...track.children];
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    const isMobile = () => window.matchMedia("(max-width: 760px)").matches;
    const reducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let offset = 0;
    let paused = false;
    let dragging = false;
    let pointerStart = 0;
    let dragStartOffset = 0;
    let frameId = null;
    let lastTime = performance.now();

    const loopWidth = () => track.scrollWidth / 2;

    const normaliseOffset = () => {
      const half = loopWidth();
      if (!half) return;

      if (offset <= -half) offset += half;
      if (offset > 0) offset -= half;
    };

    const applyTransform = () => {
      track.style.transform = `translate3d(${offset}px,0,0)`;
    };

    const moveBy = (amount) => {
      if (isMobile()) {
        marquee.scrollBy({ left: amount, behavior: "smooth" });
        return;
      }

      offset -= amount;
      normaliseOffset();
      applyTransform();
    };

    const cardStep = () => {
      const card = track.querySelector(".bk-photo-card");
      const gap = parseFloat(getComputedStyle(track).gap) || 16;
      return card ? card.getBoundingClientRect().width + gap : 340;
    };

    previous?.addEventListener("click", () => moveBy(-cardStep()));
    next?.addEventListener("click", () => moveBy(cardStep()));

    marquee.addEventListener("mouseenter", () => {
      paused = true;
    });
    marquee.addEventListener("mouseleave", () => {
      paused = false;
    });
    marquee.addEventListener("focusin", () => {
      paused = true;
    });
    marquee.addEventListener("focusout", () => {
      paused = false;
    });

    marquee.addEventListener("pointerdown", (event) => {
      if (isMobile()) return;

      dragging = true;
      paused = true;
      pointerStart = event.clientX;
      dragStartOffset = offset;
      marquee.classList.add("is-dragging");
      marquee.setPointerCapture(event.pointerId);
    });

    marquee.addEventListener("pointermove", (event) => {
      if (!dragging || isMobile()) return;

      offset = dragStartOffset + (event.clientX - pointerStart);
      normaliseOffset();
      applyTransform();
    });

    const stopDragging = (event) => {
      if (!dragging) return;

      dragging = false;
      paused = false;
      marquee.classList.remove("is-dragging");

      if (
        event?.pointerId !== undefined &&
        marquee.hasPointerCapture(event.pointerId)
      ) {
        marquee.releasePointerCapture(event.pointerId);
      }
    };

    marquee.addEventListener("pointerup", stopDragging);
    marquee.addEventListener("pointercancel", stopDragging);

    const animate = (now) => {
      const delta = now - lastTime;
      lastTime = now;

      if (!paused && !dragging && !isMobile() && !reducedMotion()) {
        offset -= delta * 0.035;
        normaliseOffset();
        applyTransform();
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    window.addEventListener(
      "resize",
      () => {
        if (isMobile()) {
          track.style.transform = "";
          offset = 0;
        } else {
          marquee.scrollLeft = 0;
          normaliseOffset();
          applyTransform();
        }
      },
      { passive: true },
    );

    document.addEventListener("visibilitychange", () => {
      paused = document.hidden;
    });
  };

  document.addEventListener("DOMContentLoaded", initialisePhotoMarquee);
  document.addEventListener("sectionsLoaded", initialisePhotoMarquee);
})();
