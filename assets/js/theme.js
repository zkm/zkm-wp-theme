(function () {
  const toTopButton = document.getElementById('zkm-back-to-top');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let parallaxImages = [];
  let animationFrameRequested = false;

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

  setupParallaxImages();

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', requestParallaxUpdate, { passive: true });
})();
