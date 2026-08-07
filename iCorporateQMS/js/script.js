/* ==========================================================================
   iCorporateQMS — Boutique Management Consulting Client Script
   Single-Page Scroll, Active Nav Highlight, Interactive PDCA, Zoho CRM Integration
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Menu Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = navLinks.classList.contains('active');
      navLinks.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Smooth Scroll for Nav Links & CTA Buttons
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. Active Navigation Observer on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
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

  // 4. Scroll Reveal Animations (IntersectionObserver)
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
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 5. Interactive Circular PDCA Selector
  const pdcaQuadrants = document.querySelectorAll('.pdca-quadrant');
  const pdcaPhaseCards = document.querySelectorAll('.pdca-phase-card');

  const activatePDCA = (phase) => {
    pdcaQuadrants.forEach(quad => {
      if (quad.dataset.phase === phase) {
        quad.classList.add('active');
      } else {
        quad.classList.remove('active');
      }
    });

    pdcaPhaseCards.forEach(card => {
      if (card.dataset.phase === phase) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  };

  pdcaQuadrants.forEach(quad => {
    quad.addEventListener('click', () => activatePDCA(quad.dataset.phase));
    quad.addEventListener('mouseenter', () => activatePDCA(quad.dataset.phase));
  });

  pdcaPhaseCards.forEach(card => {
    card.addEventListener('click', () => activatePDCA(card.dataset.phase));
    card.addEventListener('mouseenter', () => activatePDCA(card.dataset.phase));
  });

  // 6. Consultation Form Submission & Zoho CRM Lead Integration
  const consultationForm = document.getElementById('consultation-form');
  const formSuccess = document.getElementById('form-success');

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;

      submitBtn.disabled = true;
      submitBtn.innerText = 'Submitting Request...';

      // Collect form data
      const formData = {
        organizationName: document.getElementById('organizationName')?.value || '',
        contactPerson: document.getElementById('contactPerson')?.value || '',
        designation: document.getElementById('designation')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        organizationType: document.getElementById('organizationType')?.value || '',
        areasOfInterest: Array.from(document.querySelectorAll('input[name="areaOfInterest"]:checked')).map(cb => cb.value),
        message: document.getElementById('message')?.value || '',
        submittedAt: new Date().toISOString(),
        source: 'iCorporateQMS Single Page'
      };

      // Save to local storage leads database
      try {
        const existingLeads = JSON.parse(localStorage.getItem('icqms_leads') || '[]');
        existingLeads.push(formData);
        localStorage.setItem('icqms_leads', JSON.stringify(existingLeads));
      } catch (err) {
        console.warn('Could not store lead to localStorage:', err);
      }

      // Check if Zoho CRM Webhook URL is defined in window environment or data attribute
      const zohoWebhookUrl = consultationForm.dataset.zohoWebhookUrl || window.ZOHO_CRM_WEBHOOK_URL;

      const finishSubmission = () => {
        consultationForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;

        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          setTimeout(() => {
            formSuccess.style.display = 'none';
          }, 8000);
        }
      };

      if (zohoWebhookUrl) {
        fetch(zohoWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        .then(() => finishSubmission())
        .catch(err => {
          console.warn('Zoho CRM Webhook notification:', err);
          finishSubmission();
        });
      } else {
        setTimeout(finishSubmission, 900);
      }
    });
  }
});
