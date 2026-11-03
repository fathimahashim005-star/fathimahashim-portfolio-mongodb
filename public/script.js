// Small progressive enhancement; portfolio content itself is rendered from MongoDB.
document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});
