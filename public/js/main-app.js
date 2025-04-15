/**
 * main-app.js - Main JavaScript functionality for PetPals
 * This file contains common functionality used across the application
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('PetPals application initialized');

  // Initialize theme handling
  initializeTheme();

  // Add event listeners for interactive elements
  setupEventListeners();
});

/**
 * Initialize theme handling (light/dark mode)
 */
function initializeTheme() {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply theme
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Add theme toggle functionality if toggle exists
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
}
