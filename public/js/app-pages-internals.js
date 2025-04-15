/**
 * app-pages-internals.js - Internal functionality for PetPals app pages
 * This file contains functionality specific to app pages
 */

console.log('PetPals page initialized');

// Initialize app pages when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Dashboard-specific functionality
  initDashboard();
});

// Dashboard initialization
function initDashboard() {
  const dashboardStats = document.querySelectorAll('.dashboard-stat');

  if (dashboardStats.length > 0) {
    // Animate stats on dashboard load
    dashboardStats.forEach((stat, index) => {
      setTimeout(() => {
        stat.classList.add('animate-in');
      }, index * 100);
    });
  }
}
