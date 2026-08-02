
(() => {
  const init = () => {
    const buttons = [...document.querySelectorAll("[data-model]")];
    const panels = [...document.querySelectorAll("[data-model-panel]")];

    buttons.forEach(button => {
      if (button.dataset.initialised === "true") return;
      button.dataset.initialised = "true";

      button.addEventListener("click", () => {
        const model = button.dataset.model;

        buttons.forEach(item => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", String(active));
        });

        panels.forEach(panel => {
          panel.hidden = panel.dataset.modelPanel !== model;
        });
      });
    });

    const track = document.querySelector("[data-partner-track]");
    if (track && track.dataset.cloned !== "true") {
      track.dataset.cloned = "true";

      [...track.children].forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
    }
  };

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("sectionsLoaded", init);
})();
