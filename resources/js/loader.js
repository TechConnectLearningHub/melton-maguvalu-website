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
  { id: "bottom-nav", file: "./resources/sections/bottom-nav.html" }
];

async function loadSection(section) {
  const container = document.getElementById(section.id);
  if (!container) return;

  try {
    const response = await fetch(section.file);
    if (!response.ok) throw new Error(`Could not load ${section.file}`);
    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
    container.innerHTML = "";
  }
}

async function loadAllSections() {
  const main = document.getElementById("main-content");
  if (main) main.classList.add("sections-loading-state");

  // Fetch every section in parallel — each writes to its own container,
  // so order of arrival doesn't matter, only total load time.
  await Promise.all(sections.map(loadSection));

  if (main) main.classList.remove("sections-loading-state");
  document.dispatchEvent(new Event("sectionsLoaded"));
}

document.addEventListener("DOMContentLoaded", loadAllSections);
