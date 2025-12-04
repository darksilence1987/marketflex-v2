document.addEventListener("DOMContentLoaded", function () {
  // Initialize all dropdowns
  var dropdowns = document.querySelectorAll(".dropdown-toggle");
  dropdowns.forEach(function (dropdown) {
    new bootstrap.Dropdown(dropdown);
  });

  // Initialize all tooltips
  var tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltips.forEach(function (tooltip) {
    new bootstrap.Tooltip(tooltip);
  });
});

function updateCartBadge(count) {
    const badge = document.querySelector('.badge-danger');
    if (badge) {
        badge.textContent = count;
    }
}
