// HeelFix Landing Page Interactivity

document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll background toggle
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile navigation toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // FAQ Accordion Interactivity
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Medical Disclaimer Modal Interactivity
  const disclaimerTriggers = document.querySelectorAll('a[href="#safety"]');
  const disclaimerModal = document.getElementById('disclaimerModal');
  const closeDisclaimerBtn = document.getElementById('closeDisclaimer');

  if (disclaimerModal) {
    const openModal = (e) => {
      e.preventDefault();
      disclaimerModal.classList.add('active');
      disclaimerModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      disclaimerModal.classList.remove('active');
      disclaimerModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    disclaimerTriggers.forEach(trigger => {
      trigger.addEventListener('click', openModal);
    });

    if (closeDisclaimerBtn) {
      closeDisclaimerBtn.addEventListener('click', closeModal);
    }

    disclaimerModal.addEventListener('click', (e) => {
      if (e.target === disclaimerModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && disclaimerModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Contact Form Interactivity
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const sendAnotherBtn = document.getElementById('sendAnotherBtn');
  const directMailLink = document.getElementById('directMailLink');

  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const topicSelect = document.getElementById('contactTopic');
    const messageInput = document.getElementById('contactMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const topicError = document.getElementById('topicError');
    const messageError = document.getElementById('messageError');

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const clearErrors = () => {
      [nameInput, emailInput, topicSelect, messageInput].forEach(el => el?.classList.remove('invalid'));
      [nameError, emailError, topicError, messageError].forEach(el => el?.classList.remove('visible'));
    };

    [nameInput, emailInput, topicSelect, messageInput].forEach(input => {
      input?.addEventListener('input', () => {
        input.classList.remove('invalid');
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const topic = topicSelect.value;
      const message = messageInput.value.trim();

      if (!name || name.length < 2) {
        nameInput.classList.add('invalid');
        nameError.classList.add('visible');
        isValid = false;
      }

      if (!email || !validateEmail(email)) {
        emailInput.classList.add('invalid');
        emailError.classList.add('visible');
        isValid = false;
      }

      if (!topic) {
        topicSelect.classList.add('invalid');
        topicError.classList.add('visible');
        isValid = false;
      }

      if (!message || message.length < 10) {
        messageInput.classList.add('invalid');
        messageError.classList.add('visible');
        isValid = false;
      }

      if (isValid) {
        const submitBtn = document.getElementById('submitBtn');
        const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Sending message...</span>';
        }

        const subject = `[HeelFix Inquiry] ${topic} - ${name}`;
        const subjectEncoded = encodeURIComponent(subject);
        const bodyEncoded = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`);
        const mailtoUrl = `mailto:contact@heelfixcare.com?subject=${subjectEncoded}&body=${bodyEncoded}`;

        if (directMailLink) {
          directMailLink.setAttribute('href', mailtoUrl);
        }

        const payload = {
          access_key: 'd407d642-5985-487c-903c-0006a7b5554b',
          name: name,
          email: email,
          subject: subject,
          topic: topic,
          message: message,
          from_name: 'HeelFix Landing Page Contact Form',
        };

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        })
          .then(async (response) => {
            const data = await response.json().catch(() => ({}));
            if (response.ok && data.success !== false) {
              contactForm.style.display = 'none';
              if (contactSuccess) {
                contactSuccess.style.display = 'block';
              }
            } else {
              alert(data.message || 'There was an issue sending your message. Please click "Open in Email App" to contact us directly.');
              contactForm.style.display = 'none';
              if (contactSuccess) {
                contactSuccess.style.display = 'block';
              }
            }
          })
          .catch((err) => {
            console.error('Contact form submission error:', err);
            contactForm.style.display = 'none';
            if (contactSuccess) {
              contactSuccess.style.display = 'block';
            }
          })
          .finally(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnContent;
            }
          });
      }
    });

    if (sendAnotherBtn) {
      sendAnotherBtn.addEventListener('click', () => {
        contactForm.reset();
        clearErrors();
        contactForm.style.display = 'flex';
        if (contactSuccess) {
          contactSuccess.style.display = 'none';
        }
      });
    }
  }
});
