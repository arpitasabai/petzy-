/* PETZY Homepage View (Veterinary Platform) */
import { siteData } from '../data.js';
import { showToast } from '../components/toast.js';

let currentTestimonialIndex = 0;

export function renderHome() {
  return `
    <!-- 1. HERO SECTION -->
    <section class="veterinary-hero animate-fade-up">
      <div class="hero-bg-blob-1 blob-morph"></div>
      <div class="hero-bg-blob-2 blob-morph"></div>

      <div class="container">
        <div class="hero-grid-layout">
          <!-- Text Content -->
          <div class="hero-text-col">
            <div class="section-badge coral">
              <i class="fa-solid fa-shield-heart"></i>
              <span>Compassionate Veterinary Care</span>
            </div>
            <h1>Because Every Paw Deserves the Best Care.</h1>
            <p class="hero-subtitle">Trusted veterinary care, wellness services, and compassionate support for every stage of your pet's life.</p>
            
            <div class="hero-cta-group">
              <a href="#/contact" class="btn btn-teal btn-lg" id="hero-book-cta">
                <i class="fa-solid fa-calendar-check"></i>
                <span>Book an Appointment</span>
              </a>
              <a href="#/services" class="btn btn-outline btn-lg">
                <i class="fa-solid fa-stethoscope"></i>
                <span>Explore Services</span>
              </a>
            </div>

            <!-- Mini Trust Elements -->
            <div style="display: flex; align-items: center; gap: 1.25rem; margin-top: 1rem;">
              <div style="display: flex; color: #E2BF67; font-size: 1rem; gap: 0.2rem;">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <span style="font-size: 0.95rem; font-weight: 700; color: var(--color-forest-green);">
                4.9 ★ Rating from 500+ Verified Pet Parents
              </span>
            </div>
          </div>

          <!-- Hero Visual with 4-Pet Sliding Carousel & 3 Floating Information Cards -->
          <div class="hero-visual-stage">
            <div class="hero-main-pet-frame">
              <div class="hero-carousel-viewport" id="hero-carousel-viewport">
                <div class="hero-carousel-track" id="hero-carousel-track">
                  ${siteData.images.heroCarousel.map((slide, idx) => `
                    <div class="hero-pet-slide" data-hero-slide="${idx}">
                      <img src="${slide.src}" alt="${slide.animal} at PETZY Veterinary Hospital" class="hero-pet-image" loading="${idx === 0 ? 'eager' : 'lazy'}">
                    </div>
                  `).join('')}
                  <!-- Seamless Infinite Loop Clone of Slide 0 (Dog) -->
                  <div class="hero-pet-slide hero-pet-clone" data-hero-slide="0">
                    <img src="${siteData.images.heroCarousel[0].src}" alt="${siteData.images.heroCarousel[0].animal} at PETZY Veterinary Hospital" class="hero-pet-image" loading="lazy">
                  </div>
                </div>

                <!-- Subtle Hero Indicator Dots -->
                <div class="hero-carousel-dots" id="hero-carousel-dots">
                  ${siteData.images.heroCarousel.map((slide, idx) => `
                    <button type="button" class="hero-dot ${idx === 0 ? 'active' : ''}" data-hero-dot="${idx}" aria-label="${slide.animal}"></button>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Floating Card 1: 500+ Happy Pets -->
            <div class="hero-float-card pos-top-left float-gentle">
              <div class="float-card-icon sage">
                <i class="fa-solid fa-paw"></i>
              </div>
              <div class="float-card-content">
                <h5>500+</h5>
                <p>Happy Pets Cared</p>
              </div>
            </div>

            <!-- Floating Card 2: 20+ Expert Vets -->
            <div class="hero-float-card pos-mid-right float-slow">
              <div class="float-card-icon coral">
                <i class="fa-solid fa-user-doctor"></i>
              </div>
              <div class="float-card-content">
                <h5>20+</h5>
                <p>Expert Vets & Staff</p>
              </div>
            </div>

            <!-- Floating Card 3: 24/7 Pet Support -->
            <div class="hero-float-card pos-bottom-right float-gentle">
              <div class="float-card-icon yellow">
                <i class="fa-solid fa-clock"></i>
              </div>
              <div class="float-card-content">
                <h5>24/7</h5>
                <p>Pet Emergency Care</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. TRUST & STATISTICS STRIP -->
        <div class="stats-strip">
          <div class="stats-grid" id="stats-counter-strip">
            ${siteData.statistics.map((stat, idx) => `
              <div class="stat-item">
                <div class="stat-icon-box">
                  <i class="${stat.icon}"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-number" data-target="${stat.value}">${stat.value}${stat.suffix}</div>
                  <div class="stat-label">${stat.label}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- 3. ABOUT PETZY SECTION -->
    <section class="section" id="about-section">
      <div class="container">
        <div class="about-petzy-layout">
          <!-- Visual Side -->
          <div class="about-visual-side">
            <img src="${siteData.images.aboutVet}" alt="Compassionate veterinarian examining pet" class="about-primary-photo">
            
            <!-- Trusted Badge -->
            <div class="about-trusted-badge float-gentle">
              <div class="trusted-badge-icon">
                <i class="fa-solid fa-award"></i>
              </div>
              <div>
                <h4 style="color: var(--color-warm-cream); font-size: 1.15rem; margin-bottom: 0.2rem;">Trusted Pet Care</h4>
                <p style="color: var(--color-sage-green-light); font-size: 0.85rem; margin: 0;">Certified Fear-Free Clinical Standards</p>
              </div>
            </div>
          </div>

          <!-- Text Side -->
          <div class="about-text-side">
            <div class="section-badge">
              <i class="fa-solid fa-heart"></i>
              <span>About PETZY</span>
            </div>
            <h2 class="section-title">Care That Feels Like Family.</h2>
            <p style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem;">At PETZY, we know your pet isn't just an animal — they are a beloved family member. We provide compassionate, professional, and personalized veterinary care designed to keep tails wagging and purrs going strong.</p>
            
            <!-- 3 Feature Points -->
            <div class="about-features-list">
              <div class="about-feature-item">
                <div class="about-feature-icon"><i class="fa-solid fa-hands-holding-heart"></i></div>
                <div>
                  <h4>Compassionate Care</h4>
                  <p>Gentle, stress-free clinical visits prioritizing your pet's physical comfort and emotional ease.</p>
                </div>
              </div>

              <div class="about-feature-item">
                <div class="about-feature-icon"><i class="fa-solid fa-user-doctor"></i></div>
                <div>
                  <h4>Experienced Professionals</h4>
                  <p>Board-certified veterinary surgeons, physicians, and licensed clinical technicians.</p>
                </div>
              </div>

              <div class="about-feature-item">
                <div class="about-feature-icon"><i class="fa-solid fa-hospital"></i></div>
                <div>
                  <h4>Modern Facilities</h4>
                  <p>Advanced in-house digital imaging, clean sterile surgical suites, and dedicated cat/dog zones.</p>
                </div>
              </div>
            </div>

            <div style="margin-top: 2rem;">
              <a href="#/about" class="btn btn-teal">
                <span>Learn More About Us</span>
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. SERVICES SECTION (6 CARDS) -->
    <section class="section" style="background-color: var(--color-warm-cream-dark); border-radius: var(--radius-2xl);">
      <div class="container">
        <div class="section-header">
          <div class="section-badge coral">
            <i class="fa-solid fa-stethoscope"></i>
            <span>Our Veterinary Solutions</span>
          </div>
          <h2 class="section-title">Everything Your Pet Needs, Under One Roof.</h2>
          <p class="section-desc">From routine preventive wellness checkups to specialized surgery and round-the-clock emergency care.</p>
        </div>

        <div class="services-grid-6">
          ${siteData.services.map((srv, idx) => `
            <div class="service-card-item ${srv.bgClass} stagger-${idx + 1}" data-service-id="${srv.id}">
              <div class="service-card-header">
                <div class="service-line-icon">
                  <i class="${srv.icon}"></i>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
                  <span class="service-card-badge">${srv.badge}</span>
                  <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-forest-green); opacity: 0.85;">
                    <i class="${srv.petTypeIcon || 'fa-solid fa-paw'}" style="font-size: 0.68rem; margin-right: 0.2rem; color: var(--color-soft-coral);"></i>${srv.petTypeLabel}
                  </span>
                </div>
              </div>
              <h3>${srv.title}</h3>
              <p>${srv.shortDesc}</p>
              <a href="#/service-detail" class="service-arrow-link">
                <span>Learn More</span>
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center; margin-top: 3.5rem;">
          <a href="#/services" class="btn btn-teal btn-lg">
            <span>View All Services</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- 5. WHY CHOOSE PETZY SECTION -->
    <section class="section paw-pattern-bg">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">
            <i class="fa-solid fa-shield-halved"></i>
            <span>Why Pet Parents Choose Us</span>
          </div>
          <h2 class="section-title">Why Pet Parents Choose PETZY</h2>
          <p class="section-desc">Discover the gold standard in modern veterinary medicine and holistic pet wellness.</p>
        </div>

        <div class="benefits-grid-4">
          ${siteData.benefits.map((b, idx) => `
            <div class="benefit-card-box stagger-${idx + 1}">
              <div class="benefit-top-row">
                <span class="benefit-number">${b.number}</span>
                <div class="benefit-icon-pill">
                  <i class="${b.icon}"></i>
                </div>
              </div>
              <h3>${b.title}</h3>
              <p style="font-size: 0.95rem; color: var(--color-charcoal-muted);">${b.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 6. VETERINARIAN SECTION -->
    <section class="section" style="background-color: var(--color-warm-cream-dark); border-radius: var(--radius-2xl);">
      <div class="container">
        <div class="section-header">
          <div class="section-badge coral">
            <i class="fa-solid fa-user-doctor"></i>
            <span>Our Specialists</span>
          </div>
          <h2 class="section-title">Meet Our Veterinary Experts</h2>
          <p class="section-desc">Experienced doctors dedicated to the health, longevity, and happiness of your beloved companion.</p>
        </div>

        <div class="vets-grid">
          ${siteData.veterinarians.map(vet => `
            <div class="vet-card">
              <div class="vet-image-box hover-zoom-img">
                <img src="${vet.image}" alt="${vet.name}" loading="lazy">
                <span class="vet-badge-overlay">${vet.badge}</span>
              </div>
              <div class="vet-card-body">
                <h3>${vet.name}</h3>
                <div class="vet-specialty">${vet.title}</div>
                <div class="vet-experience">
                  <i class="fa-solid fa-medal" style="color: #DEB853;"></i>
                  <span>${vet.experience}</span>
                </div>
                <a href="#/veterinarians/${vet.slug || vet.id}" class="vet-view-profile-btn">
                  <span>View Profile</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center; margin-top: 3rem;">
          <a href="#/veterinarians" class="btn btn-teal btn-lg">
            <span>Meet All Veterinarians</span>
            <i class="fa-solid fa-users"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- 7. PET CARE CTA SECTION -->
    <section class="section">
      <div class="container">
        <div class="pet-care-cta-box">
          <i class="fa-solid fa-heart cta-floating-heart float-slow"></i>
          <i class="fa-solid fa-paw cta-floating-paw float-gentle"></i>

          <div class="cta-content-side">
            <div class="section-badge" style="background: rgba(255,255,255,0.15); color: var(--color-warm-cream); border: none;">
              <i class="fa-solid fa-sparkles"></i>
              <span>Book In Under 60 Seconds</span>
            </div>
            <h2>Your Pet's Health Starts With One Appointment.</h2>
            <p>Give your furry companion the care, attention, and expertise they deserve from our certified veterinary team.</p>
            
            <a href="#/contact" class="btn btn-coral btn-lg" id="cta-book-appointment">
              <i class="fa-solid fa-calendar-check"></i>
              <span>Book an Appointment</span>
            </a>
          </div>

          <div class="cta-img-side">
            <img src="${siteData.images.ctaPet}" alt="Happy golden retriever" class="cta-main-pet-img float-gentle">
          </div>
        </div>
      </div>
    </section>

    <!-- 8. TESTIMONIALS SECTION (CAROUSEL) -->
    <section class="section" style="background-color: var(--color-warm-cream-dark); border-radius: var(--radius-2xl);">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">
            <i class="fa-solid fa-quote-left"></i>
            <span>Parent Stories</span>
          </div>
          <h2 class="section-title">What Pet Parents Say About Us</h2>
          <p class="section-desc">Real stories from families whose pets have experienced our compassionate care.</p>
        </div>

        <div class="testimonial-carousel-wrap">
          <div class="testimonial-slide-box" id="testimonial-slide-container">
            <i class="fa-solid fa-quote-left carousel-quote-icon"></i>
            <p class="carousel-text" id="testimonial-quote-text">"${siteData.testimonials[0].review}"</p>
            <div class="carousel-author-wrap">
              <img src="${siteData.testimonials[0].avatar}" alt="${siteData.testimonials[0].author}" class="carousel-avatar" id="testimonial-avatar-img">
              <div class="carousel-author-info">
                <div class="carousel-stars">
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                </div>
                <h4 id="testimonial-author-name">${siteData.testimonials[0].author}</h4>
                <div class="carousel-pet-tag" id="testimonial-pet-tag"><i class="fa-solid fa-paw"></i> ${siteData.testimonials[0].petName}</div>
              </div>
            </div>
          </div>

          <!-- Carousel Controls -->
          <div class="carousel-controls">
            <button class="carousel-nav-btn" id="testimonial-prev-btn" aria-label="Previous review">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div class="carousel-indicators">
              <span class="carousel-dot active" data-index="0"></span>
              <span class="carousel-dot" data-index="1"></span>
              <span class="carousel-dot" data-index="2"></span>
            </div>
            <button class="carousel-nav-btn" id="testimonial-next-btn" aria-label="Next review">
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. FAQ SECTION -->
    <section class="section">
      <div class="container container-narrow">
        <div class="section-header">
          <div class="section-badge coral">
            <i class="fa-solid fa-circle-question"></i>
            <span>Clear Answers</span>
          </div>
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-desc">Quick answers to common questions about clinic visits, services, and doctor appointments.</p>
        </div>

        <div class="accordion-wrapper" id="home-faq-accordion">
          ${siteData.faqs.map((faq, idx) => `
            <div class="accordion-item ${idx === 0 ? 'active' : ''}">
              <button class="accordion-header">
                <span>${faq.q}</span>
                <span class="accordion-icon"><i class="fa-solid fa-chevron-down"></i></span>
              </button>
              <div class="accordion-content">
                <p>${faq.a}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 10. CONTACT SECTION -->
    <section class="section" style="background-color: var(--color-warm-cream-dark); border-radius: var(--radius-2xl);">
      <div class="container">
        <div class="contact-grid-wrap">
          <!-- Form Side -->
          <div class="contact-form-container">
            <div class="section-badge">
              <i class="fa-solid fa-paper-plane"></i>
              <span>Get In Touch</span>
            </div>
            <h2 style="font-size: 1.85rem; margin-bottom: 0.5rem;">Send Us a Message</h2>
            <p style="margin-bottom: 1.75rem;">Have a question about your pet or need to schedule an appointment? Fill out the form below.</p>

            <form id="home-contact-form">
              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label" for="home-contact-name">Full Name *</label>
                  <input type="text" id="home-contact-name" class="form-input" placeholder="e.g. Jessica Miller" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="home-contact-email">Email Address *</label>
                  <input type="email" id="home-contact-email" class="form-input" placeholder="e.g. jessica@example.com" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="home-contact-phone">Phone Number</label>
                <input type="tel" id="home-contact-phone" class="form-input" placeholder="(555) 000-0000">
              </div>

              <div class="form-group">
                <label class="form-label" for="home-contact-message">Your Message *</label>
                <textarea id="home-contact-message" class="form-textarea" placeholder="Tell us about your pet, symptoms, or appointment inquiry..." required></textarea>
              </div>

              <button type="submit" class="btn btn-teal btn-lg" style="width: 100%;">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Send Message</span>
              </button>
            </form>
          </div>

          <!-- Contact Info & Map Side -->
          <div class="contact-info-list">
            <div class="contact-info-card hover-card-lift">
              <div class="contact-info-icon"><i class="fa-solid fa-location-dot"></i></div>
              <div>
                <h4 style="color: var(--color-forest-green); margin-bottom: 0.25rem;">Clinic Address</h4>
                <p style="font-size: 0.95rem; color: var(--color-charcoal);">${siteData.brand.address}</p>
              </div>
            </div>

            <div class="contact-info-card hover-card-lift">
              <div class="contact-info-icon"><i class="fa-solid fa-phone"></i></div>
              <div>
                <h4 style="color: var(--color-forest-green); margin-bottom: 0.25rem;">Phone Numbers</h4>
                <p style="font-size: 0.95rem; color: var(--color-charcoal); margin-bottom: 0.2rem;">Main: <strong>${siteData.brand.phone}</strong></p>
                <p style="font-size: 0.85rem; color: var(--color-soft-coral); font-weight: 700;">Emergency: ${siteData.brand.emergencyPhone}</p>
              </div>
            </div>

            <div class="contact-info-card hover-card-lift">
              <div class="contact-info-icon"><i class="fa-solid fa-clock"></i></div>
              <div>
                <h4 style="color: var(--color-forest-green); margin-bottom: 0.25rem;">Opening Hours</h4>
                <p style="font-size: 0.95rem; color: var(--color-charcoal);">${siteData.brand.hours}</p>
              </div>
            </div>

            <!-- Map Placeholder -->
            <div class="map-placeholder-box">
              <i class="fa-solid fa-map-location-dot" style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--color-forest-green);"></i>
              <h4 style="color: var(--color-forest-green); margin-bottom: 0.2rem;">San Francisco Veterinary Hospital</h4>
              <p style="font-size: 0.85rem; color: var(--color-charcoal-muted); margin: 0;">742 Evergreen Paws Way • Convenient pet parking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupHomeEvents() {
  // 1. Hero 4-Pet Continuous Sliding Carousel (2s display + 800ms smooth slide)
  const heroTrack = document.getElementById('hero-carousel-track');
  const heroDots = document.querySelectorAll('.hero-dot');
  let heroTimer = null;
  let heroCurrentIndex = 0;
  const totalRealSlides = 4; // Dog, Cat, Rabbit, Bird (and index 4 is seamless clone of Dog)

  function updateHeroDots(activeIdx) {
    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === (activeIdx % totalRealSlides));
    });
  }

  function slideToHeroIndex(index, withAnimation = true) {
    if (!heroTrack) return;
    if (withAnimation) {
      heroTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    } else {
      heroTrack.style.transition = 'none';
    }
    heroTrack.style.transform = `translateX(-${index * 100}%)`;
    updateHeroDots(index);
  }

  function advanceHeroSlide() {
    heroCurrentIndex++;
    slideToHeroIndex(heroCurrentIndex, true);

    // When we reach the clone (index 4), seamlessly reset to index 0 after the 800ms slide completes
    if (heroCurrentIndex === totalRealSlides) {
      setTimeout(() => {
        heroCurrentIndex = 0;
        slideToHeroIndex(0, false);
      }, 800);
    }
  }

  function startHeroAutoPlay() {
    if (heroTimer) clearInterval(heroTimer);
    // Exactly 2000ms display time + 800ms slide duration = 2800ms loop
    heroTimer = setInterval(() => {
      advanceHeroSlide();
    }, 2800);
  }

  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-hero-dot'), 10);
      heroCurrentIndex = targetIdx;
      slideToHeroIndex(heroCurrentIndex, true);
      startHeroAutoPlay();
    });
  });

  if (heroTrack) {
    startHeroAutoPlay();
  }

  // 2. Accordion Listeners
  const accordion = document.getElementById('home-faq-accordion');
  if (accordion) {
    const items = accordion.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const header = item.querySelector('.accordion-header');
      header?.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!wasActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // 3. Testimonials Carousel
  const prevBtn = document.getElementById('testimonial-prev-btn');
  const nextBtn = document.getElementById('testimonial-next-btn');
  const dots = document.querySelectorAll('.carousel-dot');

  function updateCarousel(index) {
    currentTestimonialIndex = (index + siteData.testimonials.length) % siteData.testimonials.length;
    const test = siteData.testimonials[currentTestimonialIndex];
    
    const quoteEl = document.getElementById('testimonial-quote-text');
    const avatarEl = document.getElementById('testimonial-avatar-img');
    const authorEl = document.getElementById('testimonial-author-name');
    const petTagEl = document.getElementById('testimonial-pet-tag');

    if (quoteEl && test) {
      quoteEl.textContent = `"${test.review}"`;
      avatarEl.src = test.avatar;
      authorEl.textContent = test.author;
      petTagEl.innerHTML = `<i class="fa-solid fa-paw"></i> ${test.petName}`;
    }

    dots.forEach((dot, i) => {
      if (i === currentTestimonialIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  prevBtn?.addEventListener('click', () => updateCarousel(currentTestimonialIndex - 1));
  nextBtn?.addEventListener('click', () => updateCarousel(currentTestimonialIndex + 1));
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => updateCarousel(idx));
  });

  // 4. Contact Form Submission
  const form = document.getElementById('home-contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('home-contact-name')?.value || 'Pet Parent';
    showToast(`Thank you, ${name}! Your inquiry has been sent to our veterinary care desk.`, 'coral', 'fa-solid fa-circle-check');
    form.reset();
  });
}
