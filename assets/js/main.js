/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  /**
   * Mobile nav toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function toggleMobileNav() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }

  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', toggleMobileNav);
  }

  /**
   * Hide mobile nav when clicking on a nav link (same page)
   */
  document.querySelectorAll('#navmenu a').forEach(navLink => {
    navLink.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        toggleMobileNav();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(dropdownToggle => {
    dropdownToggle.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll (AOS)
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init Typed.js for hero typing effect
   */
  const typedElement = document.querySelector('.typed');
  if (typedElement) {
    let typedStrings = typedElement.getAttribute('data-typed-items');
    if (typedStrings) {
      typedStrings = typedStrings.split(',');
      new Typed('.typed', {
        strings: typedStrings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
      });
    }
  }

  /**
   * Initiate Pure Counter for stats
   */
  new PureCounter();

  /**
   * Skills progress bars animation on scroll
   */
  const skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function () {
        const progressBars = item.querySelectorAll('.progress .progress-bar');
        progressBars.forEach(bar => {
          bar.style.width = bar.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate GLightbox for portfolio images
   */
  GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init Isotope layout and filters for portfolio
   */
  document.querySelectorAll('.isotope-layout').forEach(isotopeContainer => {
    const layout = isotopeContainer.getAttribute('data-layout') || 'masonry';
    const defaultFilter = isotopeContainer.getAttribute('data-default-filter') || '*';
    const sortBy = isotopeContainer.getAttribute('data-sort') || 'original-order';

    let iso;

    imagesLoaded(isotopeContainer.querySelector('.isotope-container'), () => {
      iso = new Isotope(isotopeContainer.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: defaultFilter,
        sortBy: sortBy
      });
    });

    isotopeContainer.querySelectorAll('.isotope-filters li').forEach(filterBtn => {
      filterBtn.addEventListener('click', () => {
        isotopeContainer.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        filterBtn.classList.add('filter-active');

        iso.arrange({
          filter: filterBtn.getAttribute('data-filter')
        });

        if (typeof aosInit === 'function') {
          aosInit();
        }
      });
    });
  });

  /**
   * Init Swiper sliders (testimonials, etc.)
   */
  function initSwiper() {
    document.querySelectorAll('.init-swiper').forEach(swiperElement => {
      const configElement = swiperElement.querySelector('.swiper-config');
      if (configElement) {
        const config = JSON.parse(configElement.innerHTML.trim());
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener('load', initSwiper);

  /**
   * Hero Slideshow - Custom fading slideshow
   */
  document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length > 1) {
      let current = 0;

      setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 4000); // Change image every 4 seconds
    }

    // Optional: Preload images to avoid flash/flicker
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.querySelector('img')?.src || slide.getAttribute('src');
    });
  });

  /**
   * Correct scrolling position on page load for hash links
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          const scrollMarginTop = parseInt(getComputedStyle(target).scrollMarginTop);
          window.scrollTo({
            top: target.offsetTop - scrollMarginTop,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu active class on scroll (Scrollspy)
   */
  const navLinks = document.querySelectorAll('.navmenu a');

  function activateNavLink() {
    let position = window.scrollY + 200;

    navLinks.forEach(link => {
      if (!link.hash) return;

      const section = document.querySelector(link.hash);
      if (!section) return;

      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(activeLink => activeLink.classList.remove('active'));
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('load', activateNavLink);
  document.addEventListener('scroll', activateNavLink);

})();

window.addEventListener('scroll', function() {
  const parallax = document.querySelector('.parallax-text');
  if (parallax) {
    let scrollPosition = window.pageYOffset;
    parallax.style.transform = `translateY(calc(-50% + ${scrollPosition * 0.4}px))`;
  }
});
