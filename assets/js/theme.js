(function () {
  const toTopButton = document.getElementById('zkm-back-to-top');
  const themeToggleButton = document.getElementById('zkm-theme-toggle');
  const menuToggleButton = document.getElementById('zkm-menu-toggle');
  const primaryNav = document.getElementById('zkm-primary-menu');
  const mobileMenuQuery = window.matchMedia('(max-width: 800px)');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const colorModeStorageKey = 'zkm-color-mode';
  let parallaxImages = [];
  let animationFrameRequested = false;

  const readStoredTheme = () => {
    try {
      return window.localStorage.getItem(colorModeStorageKey);
    } catch (error) {
      return null;
    }
  };

  const writeStoredTheme = (theme) => {
    try {
      window.localStorage.setItem(colorModeStorageKey, theme);
    } catch (error) {
      // Ignore storage failures so interaction logic keeps working.
    }
  };

  const updateThemeToggleLabel = (theme) => {
    if (!themeToggleButton) {
      return;
    }

    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    themeToggleButton.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    themeToggleButton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');

    const label = themeToggleButton.querySelector('.theme-toggle-label');
    if (label) {
      label.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
  };

  const applyTheme = (theme, persistPreference) => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    if (persistPreference) {
      writeStoredTheme(theme);
    }

    const activeTheme = document.documentElement.getAttribute('data-theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    updateThemeToggleLabel(activeTheme);
  };

  const initializeTheme = () => {
    const savedTheme = readStoredTheme();

    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme, false);
      return;
    }

    applyTheme('auto', false);
  };

  const resetParallax = () => {
    parallaxImages.forEach((image) => {
      image.style.transform = '';
    });
  };

  const updateParallax = () => {
    animationFrameRequested = false;

    if (prefersReducedMotion || window.innerWidth < 900 || parallaxImages.length === 0) {
      resetParallax();
      return;
    }

    const viewportCenter = window.innerHeight * 0.5;

    parallaxImages.forEach((image, index) => {
      const rect = image.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        return;
      }

      const depth = index === 0 ? 0.045 : 0.075;
      const imageCenter = rect.top + rect.height / 2;
      const offset = imageCenter - viewportCenter;
      const translateY = Math.max(-18, Math.min(18, -offset * depth));

      image.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
    });
  };

  const requestParallaxUpdate = () => {
    if (!animationFrameRequested) {
      animationFrameRequested = true;
      window.requestAnimationFrame(updateParallax);
    }
  };

  const setupParallaxImages = () => {
    const contentImages = Array.from(document.querySelectorAll('.entry-content img')).slice(0, 2);

    parallaxImages = contentImages;
    parallaxImages.forEach((image) => {
      image.classList.add('zkm-parallax-target');
    });

    requestParallaxUpdate();
  };

  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;

    if (toTopButton) {
      if (y > 420) {
        toTopButton.classList.add('is-visible');
      } else {
        toTopButton.classList.remove('is-visible');
      }
    }

    requestParallaxUpdate();
  };

  if (toTopButton) {
    toTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      applyTheme(nextTheme, true);
    });
  }

  const handlePreferredSchemeChange = () => {
    const savedTheme = readStoredTheme();
    if (savedTheme !== 'light' && savedTheme !== 'dark') {
      applyTheme('auto', false);
    }
  };

  if (typeof prefersDarkScheme.addEventListener === 'function') {
    prefersDarkScheme.addEventListener('change', handlePreferredSchemeChange);
  } else if (typeof prefersDarkScheme.addListener === 'function') {
    prefersDarkScheme.addListener(handlePreferredSchemeChange);
  }

  const setMenuState = (isOpen) => {
    if (!menuToggleButton || !primaryNav) {
      return;
    }

    primaryNav.classList.toggle('is-open', isOpen);
    menuToggleButton.classList.toggle('is-active', isOpen);
    menuToggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuToggleButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  };

  const closeMenu = () => setMenuState(false);

  const themeToggleHome = themeToggleButton ? themeToggleButton.parentElement : null;

  const positionThemeToggle = () => {
    if (!themeToggleButton || !primaryNav || !themeToggleHome) {
      return;
    }

    if (mobileMenuQuery.matches) {
      if (themeToggleButton.parentElement !== primaryNav) {
        primaryNav.appendChild(themeToggleButton);
        themeToggleButton.classList.add('theme-toggle--in-menu');
      }
    } else if (themeToggleButton.parentElement !== themeToggleHome) {
      themeToggleHome.appendChild(themeToggleButton);
      themeToggleButton.classList.remove('theme-toggle--in-menu');
    }
  };

  positionThemeToggle();

  if (menuToggleButton && primaryNav) {
    menuToggleButton.addEventListener('click', () => {
      setMenuState(!primaryNav.classList.contains('is-open'));
    });

    primaryNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeMenu();
        menuToggleButton.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (
        primaryNav.classList.contains('is-open') &&
        !primaryNav.contains(event.target) &&
        !menuToggleButton.contains(event.target)
      ) {
        closeMenu();
      }
    });

    const handleMenuQueryChange = (event) => {
      positionThemeToggle();
      if (!event.matches) {
        closeMenu();
      }
    };

    if (typeof mobileMenuQuery.addEventListener === 'function') {
      mobileMenuQuery.addEventListener('change', handleMenuQueryChange);
    } else if (typeof mobileMenuQuery.addListener === 'function') {
      mobileMenuQuery.addListener(handleMenuQueryChange);
    }
  }

  initializeTheme();

  setupParallaxImages();

  document.body.classList.add('zkm-animate');

  window.requestAnimationFrame(() => {
    document.body.classList.add('zkm-ready');
  });

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', requestParallaxUpdate, { passive: true });
})();
