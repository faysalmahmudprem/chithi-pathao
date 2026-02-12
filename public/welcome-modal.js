(function () {
  var modal = document.getElementById("cpWelcomeModal");
  if (!modal) return;

  var path = window.location.pathname;
  var isHome = path === "/" || path === "/index.html";
  if (!isHome) return;

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  var closeButtons = modal.querySelectorAll("[data-close-welcome]");
  closeButtons.forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  window.requestAnimationFrame(openModal);
})();
