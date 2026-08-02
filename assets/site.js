/* ==========================================================================
   Shared site interactions
   ========================================================================== */

function initDemoForms(root = document) {
  root.querySelectorAll("form[data-demo]").forEach(form => {
    if (form.dataset.demoInitialised === "true") return;
    form.dataset.demoInitialised = "true";

    form.addEventListener("submit", event => {
      event.preventDefault();

      const button = form.querySelector("button");
      if (!button) return;

      button.textContent = "Thank you — enquiry received";
      button.disabled = true;
    });
  });
}

function initBusinessDirectory(root = document) {
  const search = root.querySelector("#businessSearch");
  const cards = [...root.querySelectorAll(".business-card")];
  const buttons = [...root.querySelectorAll(".filter-chips [data-filter]")];
  const emptyState = root.querySelector("#businessEmpty");

  if (!search || search.dataset.directoryInitialised === "true") return;
  search.dataset.directoryInitialised = "true";

  let activeFilter = "all";

  const updateDirectory = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const category = card.dataset.category || "";
      const haystack = `${card.dataset.search || ""} ${card.textContent || ""}`.toLowerCase();

      const matchesFilter =
        activeFilter === "all" || category === activeFilter;

      const matchesSearch =
        !query || haystack.includes(query);

      const shouldShow = matchesFilter && matchesSearch;

      card.hidden = !shouldShow;

      if (shouldShow) visible += 1;
    });

    if (emptyState) {
      emptyState.style.display = visible ? "none" : "block";
    }
  };

  search.addEventListener("input", updateDirectory);

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      buttons.forEach(item => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      updateDirectory();
    });
  });

  updateDirectory();
}

function initValueFlipCards(root = document) {
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
}

/* Shared social links: visible on desktop and mobile across every page. */
function initSharedSocialLinks(root = document) {
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/melbourne_maguvalu_aus/",
      path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm10.5 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61579073323846",
      path: "M13.7 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H17V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V11H7.5v3h2.8v8h3.4Z"
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@MelbourneMaguvalu",
      path: "M23 12s0-3.5-.4-5.2a3 3 0 0 0-2.1-2.1C18.7 4.2 12 4.2 12 4.2s-6.7 0-8.5.5a3 3 0 0 0-2.1 2.1C1 8.5 1 12 1 12s0 3.5.4 5.2a3 3 0 0 0 2.1 2.1c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a3 3 0 0 0 2.1-2.1C23 15.5 23 12 23 12Zm-13.2 3.4V8.6l6 3.4-6 3.4Z"
    }
  ];

  const makeLinks = () => {
    const group = document.createElement("div");
    group.className = "community-socials";

    socialLinks.forEach(({ name, href, path }) => {
      const link = document.createElement("a");
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `${name} – Melbourne Maguvalu`);
      link.innerHTML = `
        <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
          <path d="${path}"></path>
        </svg>
      `;
      group.appendChild(link);
    });

    return group;
  };

  root.querySelectorAll(".site-header").forEach(header => {
    if (header.dataset.sharedHeaderInitialised === "true") return;
    header.dataset.sharedHeaderInitialised = "true";

    const nav = header.querySelector(".nav");
    const navActions = header.querySelector(".nav-actions");
    const menu = header.querySelector(".menu");
    const mobileNav = header.querySelector(".mobile-nav");

    if (navActions && !navActions.querySelector(".header-community")) {
      const desktopCommunity = document.createElement("div");
      desktopCommunity.className = "header-community";
      desktopCommunity.setAttribute(
        "aria-label",
        "Join our community on social media"
      );
      desktopCommunity.innerHTML = "<span>Join our community</span>";
      desktopCommunity.appendChild(makeLinks());
      navActions.appendChild(desktopCommunity);
    }

    if (nav && menu && !nav.querySelector(".mobile-header-socials")) {
      const mobileHeaderSocials = document.createElement("div");
      mobileHeaderSocials.className = "mobile-header-socials";
      mobileHeaderSocials.setAttribute(
        "aria-label",
        "Join our community on social media"
      );
      mobileHeaderSocials.appendChild(makeLinks());
      nav.insertBefore(mobileHeaderSocials, menu);
    }

    if (mobileNav && !mobileNav.querySelector(".mobile-socials")) {
      const mobileCommunity = document.createElement("div");
      mobileCommunity.className = "mobile-socials";
      mobileCommunity.innerHTML = "<span>Join our community</span>";
      mobileCommunity.appendChild(makeLinks());
      mobileNav.appendChild(mobileCommunity);
    }

    if (menu && mobileNav) {
      if (!mobileNav.id) mobileNav.id = "mobile-navigation";

      menu.setAttribute("aria-controls", mobileNav.id);
      menu.setAttribute(
        "aria-expanded",
        String(mobileNav.classList.contains("open"))
      );

      menu.addEventListener("click", () => {
        const isOpen = mobileNav.classList.toggle("open");

        menu.setAttribute("aria-expanded", String(isOpen));
        menu.setAttribute(
          "aria-label",
          isOpen ? "Close navigation" : "Open navigation"
        );
      });
    }
  });
}

function initSharedSite(root = document) {
  initDemoForms(root);
  initBusinessDirectory(root);
  initValueFlipCards(root);
  initSharedSocialLinks(root);
}

document.addEventListener("DOMContentLoaded", () => initSharedSite());
document.addEventListener("sectionsLoaded", () => initSharedSite());
