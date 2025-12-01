// Slide Presentation JavaScript

(function() {
  'use strict';

  let currentSlideIndex = 0;
  let slides = [];
  let isFullscreen = false;

  // Initialize slides
  function initSlides() {
    slides = Array.from(document.querySelectorAll('.slide'));
    
    if (slides.length === 0) {
      console.warn('No slides found');
      return;
    }

    // Update total slides counter
    const totalSlidesEl = document.getElementById('total-slides');
    if (totalSlidesEl) {
      totalSlidesEl.textContent = slides.length;
    }

    // Show first slide
    showSlide(0);

    // Setup event listeners
    setupEventListeners();
  }

  // Show specific slide
  function showSlide(index) {
    // Validate index
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;

    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });

    // Show current slide
    currentSlideIndex = index;
    if (slides[index]) {
      slides[index].classList.add('active');
    }

    // Update counter
    const currentSlideEl = document.getElementById('current-slide');
    if (currentSlideEl) {
      currentSlideEl.textContent = currentSlideIndex + 1;
    }

    // Update progress bar
    updateProgressBar();

    // Reinitialize icons for the new slide
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Update progress bar
  function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      const progress = ((currentSlideIndex + 1) / slides.length) * 100;
      progressBar.style.width = progress + '%';
    }
  }

  // Next slide
  function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
      showSlide(currentSlideIndex + 1);
    }
  }

  // Previous slide
  function previousSlide() {
    if (currentSlideIndex > 0) {
      showSlide(currentSlideIndex - 1);
    }
  }

  // Go to first slide
  function firstSlide() {
    showSlide(0);
  }

  // Go to last slide
  function lastSlide() {
    showSlide(slides.length - 1);
  }

  // Exit presentation
  function exitPresentation() {
    // Check if there's a referrer (came from another page)
    if (document.referrer && document.referrer !== window.location.href) {
      window.location.href = document.referrer;
    } else {
      // Go to home page or show message
      if (confirm('Exit presentation? You will be redirected to the home page.')) {
        window.location.href = '../index.html';
      }
    }
  }

  // Toggle fullscreen
  function toggleFullscreen() {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  // Toggle keyboard shortcuts help
  function toggleShortcutsHelp() {
    const shortcutsEl = document.getElementById('keyboard-shortcuts');
    if (shortcutsEl) {
      shortcutsEl.style.display = shortcutsEl.style.display === 'none' ? 'block' : 'none';
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Button controls
    const nextBtn = document.getElementById('next-slide');
    const prevBtn = document.getElementById('prev-slide');
    const exitBtn = document.getElementById('exit-presentation');

    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', previousSlide);
    }

    if (exitBtn) {
      exitBtn.addEventListener('click', exitPresentation);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      // Don't interfere with input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch(e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousSlide();
          break;
        case 'Home':
          e.preventDefault();
          firstSlide();
          break;
        case 'End':
          e.preventDefault();
          lastSlide();
          break;
        case 'Escape':
          e.preventDefault();
          exitPresentation();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case '?':
          e.preventDefault();
          toggleShortcutsHelp();
          break;
      }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next slide
          nextSlide();
        } else {
          // Swipe right - previous slide
          previousSlide();
        }
      }
    }

    // Fullscreen change detection
    document.addEventListener('fullscreenchange', updateFullscreenState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenState);
    document.addEventListener('msfullscreenchange', updateFullscreenState);

    function updateFullscreenState() {
      isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    }

    // Prevent context menu on slides (right-click)
    document.addEventListener('contextmenu', function(e) {
      if (e.target.closest('.slide')) {
        e.preventDefault();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlides);
  } else {
    initSlides();
  }

  // Export functions for external use
  window.slidePresentation = {
    next: nextSlide,
    previous: previousSlide,
    goTo: showSlide,
    first: firstSlide,
    last: lastSlide,
    exit: exitPresentation,
    toggleFullscreen: toggleFullscreen
  };

})();

