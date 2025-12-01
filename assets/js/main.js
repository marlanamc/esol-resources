// ESOL Teacher Resources - Main JavaScript

// Dark Mode Toggle
function initDarkMode() {
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  
  // Get saved theme or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
  }
  
  // Update toggle button icon
  function updateToggleIcon() {
    if (!themeToggle) return;
    const currentTheme = html.getAttribute('data-theme');
    themeToggle.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    
    // Clear all children (including any SVG icons Lucide created)
    themeToggle.innerHTML = '';
    
    // Create new icon
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', currentTheme === 'dark' ? 'sun' : 'moon');
    icon.className = 'icon';
    themeToggle.appendChild(icon);
    
    // Initialize only this specific icon
    if (typeof lucide !== 'undefined') {
      lucide.createIcons(themeToggle);
    }
  }
  
  // Toggle theme
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleIcon();
    });
    
    updateToggleIcon();
  }
  
  // Listen for system theme changes (if no manual preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateToggleIcon();
    }
  });
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  // Initialize dark mode first
  initDarkMode();
  
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');
  
  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      const isExpanded = nav.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        nav.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.focus();
      }
    });
  }
  
  // Dropdown menu handling
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    
    if (link) {
      link.addEventListener('click', function(e) {
        // On mobile, toggle dropdown
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    }
  });
  
  // Initialize subcategory accordions
  initSubcategoryAccordions();
  
  // Initialize nested subcategory accordions
  initNestedSubcategoryAccordions();
  
  // Activity filtering
  initActivityFilters();
  
  // Keyboard navigation for activity items
  const activityItems = document.querySelectorAll('.activity-item');
  activityItems.forEach(item => {
    item.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        item.click();
      }
    });
  });
});

// Subcategory accordion functionality
function initSubcategoryAccordions() {
  const toggles = document.querySelectorAll('.subcategory-toggle');
  
  toggles.forEach(toggle => {
    const section = toggle.closest('.subcategory-section');
    if (!section) return;
    
    // Set initial aria-expanded - default to false (collapsed)
    const initialExpanded = toggle.getAttribute('aria-expanded') === 'true';
    section.setAttribute('aria-expanded', initialExpanded);
    toggle.setAttribute('aria-expanded', initialExpanded);
    
    // Set initial state - collapsed by default
    const content = section.querySelector('.subcategory-content');
    if (content) {
      if (initialExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
      } else {
        content.style.maxHeight = '0';
        content.style.opacity = '0';
      }
    }
    
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const isCurrentlyExpanded = section.getAttribute('aria-expanded') === 'true';
      const newExpanded = !isCurrentlyExpanded;
      
      section.setAttribute('aria-expanded', newExpanded);
      toggle.setAttribute('aria-expanded', newExpanded);
      
      const content = section.querySelector('.subcategory-content');
      if (content) {
        if (newExpanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.opacity = '1';
        } else {
          content.style.maxHeight = '0';
          content.style.opacity = '0';
        }
      }
      
      // Update icon
      if (typeof lucide !== 'undefined') {
        lucide.createIcons(toggle);
      }
    });
  });
}

// Nested subcategory accordion functionality
function initNestedSubcategoryAccordions() {
  const toggles = document.querySelectorAll('.nested-subcategory-toggle');
  
  // Helper function to update parent subcategory max-height
  function updateParentSubcategoryHeight(nestedSection) {
    const parentSection = nestedSection.closest('.subcategory-section');
    if (!parentSection) return;
    
    const parentContent = parentSection.querySelector('.subcategory-content');
    if (!parentContent) return;
    
    // Only update if parent is expanded
    if (parentSection.getAttribute('aria-expanded') === 'true') {
      // Use requestAnimationFrame to ensure DOM has updated and layout is recalculated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          parentContent.style.maxHeight = parentContent.scrollHeight + 'px';
        });
      });
    }
  }
  
  toggles.forEach(toggle => {
    const nestedSection = toggle.closest('.nested-subcategory');
    if (!nestedSection) return;
    
    // Set initial aria-expanded - default to false (collapsed)
    const initialExpanded = toggle.getAttribute('aria-expanded') === 'true';
    nestedSection.setAttribute('aria-expanded', initialExpanded);
    toggle.setAttribute('aria-expanded', initialExpanded);
    
    // Set initial state - collapsed by default
    const content = nestedSection.querySelector('.nested-subcategory-content');
    if (content) {
      if (initialExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
      } else {
        content.style.maxHeight = '0';
        content.style.opacity = '0';
      }
    }
    
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent parent toggle from firing
      const isCurrentlyExpanded = nestedSection.getAttribute('aria-expanded') === 'true';
      const newExpanded = !isCurrentlyExpanded;
      
      nestedSection.setAttribute('aria-expanded', newExpanded);
      toggle.setAttribute('aria-expanded', newExpanded);
      
      const content = nestedSection.querySelector('.nested-subcategory-content');
      if (content) {
        if (newExpanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.opacity = '1';
        } else {
          content.style.maxHeight = '0';
          content.style.opacity = '0';
        }
      }
      
      // Update parent subcategory height after nested content changes
      updateParentSubcategoryHeight(nestedSection);
      
      // Update icon
      if (typeof lucide !== 'undefined') {
        lucide.createIcons(toggle);
      }
    });
  });
}

// Activity filtering functionality
function initActivityFilters() {
  const searchInput = document.getElementById('search-activities');
  const activityItems = document.querySelectorAll('.activity-item');
  const subcategorySections = document.querySelectorAll('.subcategory-section');
  const nestedSubcategories = document.querySelectorAll('.nested-subcategory');
  
  if (!activityItems.length) return;
  
  function filterActivities() {
    const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    let visibleCount = 0;
    
    subcategorySections.forEach(section => {
      const nestedSections = section.querySelectorAll('.nested-subcategory');
      let sectionVisibleCount = 0;
      
      // Handle nested subcategories
      nestedSections.forEach(nestedSection => {
        const items = nestedSection.querySelectorAll('.activity-item');
        let nestedVisibleCount = 0;
        
        items.forEach(item => {
          const itemText = item.textContent.toLowerCase();
          const matches = !searchValue || itemText.includes(searchValue);
          
          if (matches) {
            item.classList.remove('hidden');
            nestedVisibleCount++;
            sectionVisibleCount++;
            visibleCount++;
          } else {
            item.classList.add('hidden');
          }
        });
        
        // Show/hide nested subcategory based on visible items
        if (nestedVisibleCount > 0) {
          nestedSection.classList.remove('hidden');
          // Auto-expand nested section if searching
          if (searchValue && nestedSection.getAttribute('aria-expanded') === 'false') {
            nestedSection.setAttribute('aria-expanded', 'true');
            const nestedToggle = nestedSection.querySelector('.nested-subcategory-toggle');
            if (nestedToggle) {
              nestedToggle.setAttribute('aria-expanded', 'true');
              const nestedContent = nestedSection.querySelector('.nested-subcategory-content');
              if (nestedContent) {
                nestedContent.style.maxHeight = nestedContent.scrollHeight + 'px';
                nestedContent.style.opacity = '1';
              }
              if (typeof lucide !== 'undefined') {
                lucide.createIcons(nestedToggle);
              }
            }
          }
        } else {
          nestedSection.classList.add('hidden');
        }
      });
      
      // Handle direct activity items (not in nested sections)
      const directItems = section.querySelectorAll('.subcategory-content > .activity-list > .activity-item');
      directItems.forEach(item => {
        const itemText = item.textContent.toLowerCase();
        const matches = !searchValue || itemText.includes(searchValue);
        
        if (matches) {
          item.classList.remove('hidden');
          sectionVisibleCount++;
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });
      
      // Show/hide subcategory section based on visible items
      if (sectionVisibleCount > 0) {
        section.classList.remove('hidden');
        // Auto-expand if searching
        if (searchValue && section.getAttribute('aria-expanded') === 'false') {
          section.setAttribute('aria-expanded', 'true');
          const toggle = section.querySelector('.subcategory-toggle');
          if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
            const content = section.querySelector('.subcategory-content');
            if (content) {
              content.style.maxHeight = content.scrollHeight + 'px';
              content.style.opacity = '1';
            }
            if (typeof lucide !== 'undefined') {
              lucide.createIcons(toggle);
            }
          }
        }
      } else {
        section.classList.add('hidden');
      }
    });
    
    // Show/hide "no results" message
    let noResultsMsg = document.getElementById('no-results');
    if (visibleCount === 0 && searchValue) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results';
        noResultsMsg.className = 'text-center mt-xl';
        noResultsMsg.style.padding = 'var(--spacing-2xl)';
        noResultsMsg.style.color = 'var(--color-text-muted)';
        noResultsMsg.textContent = 'No activities found matching your search.';
        const container = document.querySelector('.subcategories-container');
        if (container) {
          container.parentNode.insertBefore(noResultsMsg, container.nextSibling);
        }
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
    
    // Reset sections if search is cleared
    if (!searchValue) {
      subcategorySections.forEach(section => {
        section.classList.remove('hidden');
      });
      nestedSubcategories.forEach(nestedSection => {
        nestedSection.classList.remove('hidden');
      });
      if (noResultsMsg) {
        noResultsMsg.remove();
      }
    }
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', filterActivities);
  }
}

// Set active navigation item based on current page
function setActiveNavItem() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('.html', ''))) {
      link.classList.add('active');
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', setActiveNavItem);

