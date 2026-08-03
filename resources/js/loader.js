/* ==========================================================================
   Dynamic section loader
   ========================================================================== */

const sections = [
  { id: "header", file: "./resources/sections/header.html" },
  { id: "hero", file: "./resources/sections/hero.html" },
  { id: "quick-actions", file: "./resources/sections/quick-actions.html" },
  { id: "events", file: "./resources/sections/events.html" },
  { id: "impact", file: "./resources/sections/impact.html" },
  { id: "ecosystem", file: "./resources/sections/ecosystem.html" },
  { id: "partners", file: "./resources/sections/partners.html" },
  { id: "directory", file: "./resources/sections/directory.html" },
  { id: "stories", file: "./resources/sections/stories.html" },
  { id: "contact", file: "./resources/sections/contact.html" },
  { id: "footer", file: "./resources/sections/footer.html" },
  { id: "bottom-nav", file: "./resources/sections/bottom-nav.html" },
];

async function loadSection(section) {
  const container = document.getElementById(section.id);

  if (!container) {
    return {
      id: section.id,
      status: "skipped",
    };
  }

  container.setAttribute("aria-busy", "true");

  try {
    const response = await fetch(section.file, {
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(
        `Could not load ${section.file}: ${response.status} ${response.statusText}`,
      );
    }

    container.innerHTML = await response.text();
    container.removeAttribute("aria-busy");

    return {
      id: section.id,
      status: "loaded",
    };
  } catch (error) {
    console.error(error);

    container.innerHTML = "";
    container.removeAttribute("aria-busy");
    container.dataset.loadError = "true";

    return {
      id: section.id,
      status: "failed",
      error,
    };
  }
}

async function loadAllSections() {
  const main = document.getElementById("main-content");

  if (main) {
    main.classList.add("sections-loading-state");
    main.setAttribute("aria-busy", "true");
  }

  const results = await Promise.all(sections.map(loadSection));

  if (main) {
    main.classList.remove("sections-loading-state");
    main.removeAttribute("aria-busy");
  }

  document.dispatchEvent(
    new CustomEvent("sectionsLoaded", {
      detail: {
        results,
        loaded: results.filter((result) => result.status === "loaded").length,
        failed: results.filter((result) => result.status === "failed").length,
      },
    }),
  );
}

document.addEventListener("DOMContentLoaded", loadAllSections);
