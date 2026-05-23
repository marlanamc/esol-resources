const active = document.body.dataset.active;
document.querySelectorAll("nav a").forEach((link) => {
  if (link.dataset.slug === active) {
    link.setAttribute("aria-current", "page");
  }
});