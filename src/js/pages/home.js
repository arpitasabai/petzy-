/* PETZY Homepage View (Milestone 1) */
import { siteData } from '../data.js';
import { showToast } from '../components/toast.js';
import { incrementWishlist, decrementWishlist, incrementCart } from '../components/header.js';

export function renderHome() {
  return `
    <!-- 1. HERO SECTION -->
    <section class="section home-hero animate-fade-in">
      <div class="container">
        <div class="hero-grid">
          <!-- Hero Text -->
          <div class="hero-content">
            <div class="section-subtitle coral">
              <i class="fa-solid fa-sparkles"></i>
              <span>Premium Pet Care & Lifestyle</span>
            </div>
            <h1>Everything Your Pet Needs, All in One Place.</h1>
            <p class="hero-lead">Discover thoughtfully selected pet essentials and trusted care services designed to make pet parenting easier and happier.</p>
            
            <div class="hero-buttons">
              <a href="#featured-products" class="btn btn-primary btn-lg" id="hero-shop-btn">
                <span>Shop Now</span>
                <i class="fa-solid fa-arrow-right"></i>
              </a>
              <a href="#/services" class="btn btn-outline btn-lg">
                <i class="fa-solid fa-stethoscope"></i>
                <span>Explore Services</span>
              </a>
            </div>

            <!-- Trust Bar -->
            <div class="hero-trust-summary">
              <div class="trust-avatar-stack">
                <img src="${siteData.petImages.avatar1}" alt="Happy pet parent">
                <img src="${siteData.petImages.avatar2}" alt="Happy pet parent">
                <img src="${siteData.petImages.avatar3}" alt="Happy pet parent">
              </div>
              <div class="trust-text">
                <strong>50,000+ Happy Pet Parents</strong>
                <div>Join a community that puts pets first every single day.</div>
              </div>
            </div>
          </div>

          <!-- Hero Visual: Large Realistic Golden Retriever with Paws Resting Over CTA Card -->
          <div class="hero-visual">
            <div class="hero-card-frame hover-lift">
              <img src="${siteData.petImages.heroDog}" alt="Friendly Golden Retriever resting paws" class="hero-dog-image">
              
              <!-- Paws Resting Directly Over Floating CTA Card -->
              <div class="hero-paws-cta-card">
                <div class="paw-touch-indicator">
                  <i class="fa-solid fa-paw"></i>
                  <span>Golden Approved</span>
                </div>
                <div class="cta-info">
                  <h4>Try PETZY Signature Bundle</h4>
                  <p>Organic treats + toy + free spa session</p>
                </div>
                <button class="btn btn-primary btn-sm add-hero-bundle-btn" id="hero-bundle-btn">
                  <span>Claim $18 Off</span>
                </button>
              </div>
            </div>

            <!-- Floating Trust Badges with Glassmorphism -->
            <div class="floating-badge badge-rating-top float-gentle">
              <div class="badge-icon yellow">
                <i class="fa-solid fa-star"></i>
              </div>
              <div class="badge-info">
                <h5>4.9 ★ Customer Rating</h5>
                <p>From 12,400+ verified pet reviews</p>
              </div>
            </div>

            <div class="floating-badge badge-parents-bottom float-slow">
              <div class="badge-icon sage">
                <i class="fa-solid fa-shield-heart"></i>
              </div>
              <div class="badge-info">
                <h5>100% Vetted Quality</h5>
                <p>Zero artificial preservatives or toxins</p>
              </div>
            </div>

            <!-- Mini Pet Companions interacting around the Hero -->
            <!-- Peeking Cat -->
            <div class="mini-pet-companion floating-mini-cat float-gentle" title="Curious Feline Companion">
              <img src="${siteData.petImages.heroMiniCat}" alt="Curious Cat">
            </div>

            <!-- Gentle Rabbit -->
            <div class="mini-pet-companion floating-mini-rabbit float-slow" title="Fluffy Lop Rabbit">
              <img src="${siteData.petImages.heroMiniRabbit}" alt="Fluffy Rabbit">
            </div>

            <!-- Perched Songbird -->
            <div class="mini-pet-companion floating-mini-bird float-gentle" title="Colorful Songbird">
              <img src="${siteData.petImages.heroMiniBird}" alt="Perched Bird">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. SHOP BY PET (Interactive Category Cards) -->
    <section class="section section-tight" style="background-color: var(--color-warm-cream-dark); border-radius: var(--radius-2xl);">
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle">
            <i class="fa-solid fa-paw"></i>
            <span>Shop By Pet</span>
          </div>
          <h2 class="section-title">Everything They Love</h2>
          <p class="section-desc">Tailored nutrition, enrichment toys, and comfortable living essentials designed specifically for your pet companion.</p>
        </div>

        <div class="category-grid">
          ${siteData.categories.map((cat, idx) => `
            <div class="category-card ${cat.bgClass} stagger-${idx + 1}" data-category="${cat.id}">
              <!-- Peeking Pet Interaction Badge -->
              ${cat.id === 'cats' ? `
                <div class="peeking-cat-badge">
                  <i class="fa-solid fa-eye"></i>
                  <span>Peeking</span>
                </div>
              ` : ''}

              ${cat.id === 'fish' ? `
                <div class="aquarium-glow-bubble"></div>
                <div class="aquarium-glow-bubble" style="left: auto; right: 14px; bottom: 20px; animation-delay: 1.5s;"></div>
              ` : ''}

              <div class="category-pet-image-wrap">
                <img src="${cat.image}" alt="${cat.title}" class="category-pet-img">
              </div>
              <h3 class="category-title">${cat.title}</h3>
              <span class="category-count">${cat.count}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 3. FEATURED PRODUCTS (PETZY Picks) -->
    <section class="section" id="featured-products">
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle coral">
            <i class="fa-solid fa-fire"></i>
            <span>Curated Collection</span>
          </div>
          <h2 class="section-title">PETZY Picks</h2>
          <p class="section-desc">Top-rated favorites handpicked by our veterinarians and adored by pets nationwide.</p>
        </div>

        <div class="product-grid">
          ${siteData.products.map(prod => `
            <div class="product-card" data-product-id="${prod.id}">
              <!-- Pet Peek Badge on top right -->
              <img src="${prod.petPeek}" alt="Pet peek" class="product-peeking-pet" title="${prod.name} loved by pets">
              
              <div class="product-image-container">
                <span class="product-badge-tag">${prod.tag}</span>
                <button class="product-wishlist-btn" data-id="${prod.id}" title="Save to wishlist" aria-label="Add to wishlist">
                  <i class="fa-regular fa-heart"></i>
                </button>
                <img src="${prod.image}" alt="${prod.name}" loading="lazy">
              </div>

              <div class="product-content">
                <div class="product-rating">
                  <div class="rating-stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                  </div>
                  <span class="rating-score">${prod.rating}</span>
                  <span class="rating-reviews">(${prod.reviewsCount})</span>
                </div>

                <h3 class="product-title">${prod.name}</h3>

                <div class="product-footer">
                  <div class="product-price">
                    $${prod.price.toFixed(2)}
                    <span class="old-price">$${prod.oldPrice.toFixed(2)}</span>
                  </div>
                  <button class="add-to-cart-btn" data-product-id="${prod.id}" data-name="${prod.name}">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 4. SERVICES PREVIEW (More Than Just a Pet Shop.) -->
    <section class="section" style="background-color: #F4F8F3; border-radius: var(--radius-2xl);">
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle">
            <i class="fa-solid fa-hands-holding-circle"></i>
            <span>Holistic Care & Wellness</span>
          </div>
          <h2 class="section-title">More Than Just a Pet Shop.</h2>
          <p class="section-desc">Experience our certified veterinary, grooming spa, and customized wellness services designed for your pet’s physical and mental happiness.</p>
        </div>

        <div class="services-grid">
          ${siteData.services.map(srv => `
            <div class="service-card hover-lift">
              <div class="service-image-box">
                <img src="${srv.image}" alt="${srv.title}" loading="lazy">
                <div class="service-pet-badge">
                  <i class="fa-solid fa-shield-heart"></i>
                  <span>${srv.badge}</span>
                </div>
              </div>
              <div class="service-body">
                <div class="service-icon-pill">
                  <i class="${srv.icon}"></i>
                </div>
                <h3 class="service-title">${srv.title}</h3>
                <p class="service-desc">${srv.shortDesc}</p>
                <a href="#/service-detail" class="service-learn-more">
                  <span>Learn More</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 5. ABOUT / BRAND STORY (Because They're Family.) -->
    <section class="section">
      <div class="container">
        <div class="brand-story-box">
          <div class="story-content">
            <div class="section-subtitle" style="background: rgba(255,255,255,0.7); color: var(--color-forest-green);">
              <i class="fa-solid fa-heart"></i>
              <span>Our Philosophy</span>
            </div>
            <h2>Because They're Family.</h2>
            <p>At PETZY, we believe pets aren’t just animals living in our homes — they are cherished family members who deserve the highest quality nutrition, non-toxic enrichment, and gentle, loving medical care.</p>
            
            <div class="story-values-pills">
              <div class="story-pill"><i class="fa-solid fa-paw"></i> Pet-First Approach</div>
              <div class="story-pill"><i class="fa-solid fa-gem"></i> Premium Quality</div>
              <div class="story-pill"><i class="fa-solid fa-heart-pulse"></i> Holistic Care</div>
              <div class="story-pill"><i class="fa-solid fa-certificate"></i> Certified Trust</div>
            </div>

            <a href="#/about" class="btn btn-forest">
              <span>Read Our Full Story</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div class="story-visual-wrap">
            <img src="${siteData.petImages.storyDogOwner}" alt="Pet owner hugging happy golden retriever" class="story-main-img">
            <!-- Overlapping pet element crossing card boundaries -->
            <div class="story-floating-pet float-gentle">
              <img src="${siteData.petImages.storyPuppy}" alt="Happy puppy">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. PET CARE CONTENT (Happy Pets Start With Good Care.) -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle">
            <i class="fa-solid fa-book-open"></i>
            <span>Expert Pet Advice</span>
          </div>
          <h2 class="section-title">Happy Pets Start With Good Care.</h2>
          <p class="section-desc">Practical health tips, veterinary insights, and enriching lifestyle guides written by our certified pet care professionals.</p>
        </div>

        <div class="content-grid">
          ${siteData.careContent.map(post => `
            <div class="pet-care-card">
              <div class="care-card-img-wrap">
                <span class="care-category-tag">${post.tag}</span>
                <img src="${post.image}" alt="${post.title}" loading="lazy">
              </div>
              <div class="care-body">
                <div class="care-meta">
                  <span><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
                  <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
                </div>
                <h3 class="care-title">${post.title}</h3>
                <p style="font-size: 0.95rem; color: var(--color-charcoal-muted);">${post.summary}</p>
                <a href="#/about" class="care-read-link">
                  <span>Read Article</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 7. TESTIMONIALS (Loved by Pet Parents.) -->
    <section class="section" style="background-color: var(--color-warm-cream-dark); border-radius: var(--radius-2xl);">
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle coral">
            <i class="fa-solid fa-quote-left"></i>
            <span>Real Reviews</span>
          </div>
          <h2 class="section-title">Loved by Pet Parents.</h2>
          <p class="section-desc">See how PETZY is making everyday life healthier and happier for thousands of pets and their parents.</p>
        </div>

        <div class="testimonial-grid">
          ${siteData.testimonials.map(test => `
            <div class="testimonial-card">
              <i class="fa-solid fa-quote-right testimonial-quote-icon"></i>
              <div class="testimonial-rating">
                ${Array(test.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
              </div>
              <p class="testimonial-text">"${test.review}"</p>
              <div class="testimonial-author">
                <img src="${test.avatar}" alt="${test.name}" class="author-avatar">
                <div class="author-info">
                  <h5>${test.name}</h5>
                  <span class="pet-tag-pill"><i class="fa-solid fa-paw"></i> ${test.petName}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 8. FINAL CTA BANNER (Everything They Need. Everything They Deserve.) -->
    <section class="section final-cta-section">
      <div class="container">
        <div class="final-cta-card">
          <!-- Rabbit Peeking Over CTA Card Top Edge -->
          <div class="cta-peeking-rabbit float-gentle">
            <img src="${siteData.petImages.peekingRabbitCta}" alt="Peeking friendly rabbit">
            <span>Hop on over to PETZY!</span>
          </div>

          <h2>Everything They Need. Everything They Deserve.</h2>
          <p>Discover a better, more thoughtful way to care for your pet companion with 100% natural nutrition and trusted wellness services.</p>
          
          <div class="cta-btn-group">
            <a href="#featured-products" class="btn btn-primary btn-lg">
              <i class="fa-solid fa-bag-shopping"></i>
              <span>Shop PETZY</span>
            </a>
            <a href="#/services" class="btn btn-outline-white btn-lg">
              <i class="fa-solid fa-stethoscope"></i>
              <span>Explore Services</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupHomeEvents() {
  // Add to Cart Button Handlers
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prodName = btn.getAttribute('data-name');
      incrementCart();
      showToast(`Added "${prodName}" to your pet bag!`, 'coral', 'fa-solid fa-bag-shopping');
    });
  });

  // Wishlist Toggle Handlers
  document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        icon.className = 'fa-solid fa-heart';
        incrementWishlist();
        showToast('Saved to your favorites wishlist!', 'coral', 'fa-solid fa-heart');
      } else {
        icon.className = 'fa-regular fa-heart';
        decrementWishlist();
        showToast('Removed from your favorites.', 'sage', 'fa-regular fa-heart');
      }
    });
  });

  // Hero bundle button
  const heroBundle = document.getElementById('hero-bundle-btn');
  heroBundle?.addEventListener('click', () => {
    incrementCart();
    showToast('PETZY Signature Bundle ($18 OFF) added to bag!', 'coral', 'fa-solid fa-gift');
  });

  // Category card click filter preview
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      showToast(`Browsing all ${cat.toUpperCase()} essentials & nutrition`, 'sage', 'fa-solid fa-paw');
      const prodSection = document.getElementById('featured-products');
      prodSection?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
