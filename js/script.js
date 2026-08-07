/* ==========================================================================
   iCorporateQMS — Client Script & Navigation Handler
   Recreated from Mock-Up Reference Specifications
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Toggle Navigation
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = navMenu.classList.contains('active');
      navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Smooth Scrolling to Anchor Links
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 72;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. Active Nav Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-menu-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 90;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);

  // 4. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 5. Consultation Form & Zoho CRM Submission Handler
  const consultationForm = document.getElementById('consultation-form');
  const formSuccess = document.getElementById('form-success');

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting...';

      const formData = {
        name: document.getElementById('formName')?.value || '',
        organization: document.getElementById('formOrganization')?.value || '',
        email: document.getElementById('formEmail')?.value || '',
        phone: document.getElementById('formPhone')?.value || '',
        sector: document.getElementById('formSector')?.value || '',
        message: document.getElementById('formMessage')?.value || '',
        submittedAt: new Date().toISOString(),
        source: 'iCorporateQMS Mock-Up Site'
      };

      try {
        const existingLeads = JSON.parse(localStorage.getItem('icqms_leads') || '[]');
        existingLeads.push(formData);
        localStorage.setItem('icqms_leads', JSON.stringify(existingLeads));
      } catch (err) {
        console.warn('Lead save notice:', err);
      }

      setTimeout(() => {
        consultationForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        if (formSuccess) {
          formSuccess.style.display = 'block';
          setTimeout(() => {
            formSuccess.style.display = 'none';
          }, 7000);
        }
      }, 800);
    });
  }
});
