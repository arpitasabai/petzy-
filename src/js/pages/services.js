/* PETZY Services Overview View (Milestone 1) */
import { siteData } from '../data.js';

export function renderServices() {
  return `
    <!-- Services Hero -->
    <section class="page-hero animate-fade-in">
      <div class="container">
        <div class="section-subtitle coral">
          <i class="fa-solid fa-hands-holding-circle"></i>
          <span>Professional Pet Care</span>
        </div>
        <h1>Comprehensive Care Tailored to Your Pet.</h1>
        <p>From luxurious spa hydrotherapy and stress-free breed styling to preventive veterinary checkups and therapeutic massage, our certified specialists are here for your pet.</p>
      </div>
    </section>

    <!-- Services Deep-Dive Sections -->
    <section class="section">
      <div class="container">
        
        <!-- 1. Grooming Deep Dive -->
        <div class="service-feature-block">
          <div>
            <div class="section-subtitle">
              <i class="fa-solid fa-scissors"></i>
              <span>Spa & Grooming</span>
            </div>
            <h2 class="section-title">Signature Spa Grooming & Styling</h2>
            <p>Our low-stress grooming salons utilize warm hydro-massage baths, organic botanical shampoos, and hand-scissor precision styling to ensure your pet leaves looking and feeling radiant.</p>
            
            <ul class="service-feature-list">
              <li><i class="fa-solid fa-check"></i> Hypoallergenic tearless blueberry facial & coat bath</li>
              <li><i class="fa-solid fa-check"></i> Complete undercoat deshedding & blow-out styling</li>
              <li><i class="fa-solid fa-check"></i> Organic paw pad balm massage & nail smoothing</li>
              <li><i class="fa-solid fa-check"></i> Sanitary ear flush & gentle dental freshening</li>
            </ul>

            <a href="#/service-detail" class="btn btn-forest">
              <span>View Service Details & Inclusions</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div>
            <img src="${siteData.services[0].image}" alt="Luxury dog grooming" class="service-feature-img hover-lift">
          </div>
        </div>

        <!-- 2. Veterinary Care Deep Dive -->
        <div class="service-feature-block reverse">
          <div>
            <div class="section-subtitle coral">
              <i class="fa-solid fa-stethoscope"></i>
              <span>Veterinary Care</span>
            </div>
            <h2 class="section-title">Preventive Clinical Wellness & Diagnostics</h2>
            <p>Compassionate examinations that prioritize early detection, gentle preventative medicine, and personalized health roadmaps for dogs, cats, rabbits, and exotic companions.</p>
            
            <ul class="service-feature-list">
              <li><i class="fa-solid fa-check"></i> Comprehensive nose-to-tail physical health examinations</li>
              <li><i class="fa-solid fa-check"></i> Tailored core vaccination schedules & titer testing</li>
              <li><i class="fa-solid fa-check"></i> Digital in-house diagnostic bloodwork & microscopic screening</li>
              <li><i class="fa-solid fa-check"></i> Preventive senior mobility and heart health tracking</li>
            </ul>

            <a href="#/contact" class="btn btn-primary">
              <span>Consult Our Care Team</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div>
            <img src="${siteData.services[1].image}" alt="Veterinary doctor examining pet" class="service-feature-img hover-lift">
          </div>
        </div>

        <!-- 3. Pet Wellness Deep Dive -->
        <div class="service-feature-block">
          <div>
            <div class="section-subtitle">
              <i class="fa-solid fa-heart-pulse"></i>
              <span>Therapy & Wellness</span>
            </div>
            <h2 class="section-title">Holistic Physical & Emotional Support</h2>
            <p>Designed for aging pets, athletic dogs, and anxious rescues, our wellness sessions restore physical mobility and calm anxious nervous systems through gentle touch and therapy.</p>
            
            <ul class="service-feature-list">
              <li><i class="fa-solid fa-check"></i> Gentle therapeutic canine & feline massage therapy</li>
              <li><i class="fa-solid fa-check"></i> Joint flexibility mobility exercises and cold laser therapy</li>
              <li><i class="fa-solid fa-check"></i> Calming essential oil aromatherapy & sonic sound baths</li>
              <li><i class="fa-solid fa-check"></i> Customized whole-food herbal nutritional consultations</li>
            </ul>

            <a href="#/contact" class="btn btn-forest">
              <span>Inquire About Wellness Plans</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div>
            <img src="${siteData.services[2].image}" alt="Relaxed calm pet enjoying wellness" class="service-feature-img hover-lift">
          </div>
        </div>

      </div>
    </section>

    <!-- Service Benefits Grid -->
    <section class="section" style="background-color: var(--color-warm-cream-dark); border-radius: var(--radius-2xl);">
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle">
            <i class="fa-solid fa-shield-halved"></i>
            <span>The PETZY Difference</span>
          </div>
          <h2 class="section-title">Why Parents Trust PETZY Care</h2>
          <p class="section-desc">Our modern facilities and certified staff ensure a stress-free environment for pets of all personalities.</p>
        </div>

        <div class="service-benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon"><i class="fa-solid fa-medal"></i></div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Certified Specialists</h3>
            <p style="font-size: 0.95rem;">Every team member is Fear-Free certified with over 500+ hours of specialized animal behavior training.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon"><i class="fa-solid fa-spa"></i></div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Stress-Free Spaces</h3>
            <p style="font-size: 0.95rem;">Sound-dampened suites, soothing pheromone diffusers, and private non-slip examination tables.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon"><i class="fa-solid fa-seedling"></i></div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">100% Organic Products</h3>
            <p style="font-size: 0.95rem;">We only formulate and apply botanical, sulfate-free, and veterinary-grade non-toxic formulas.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon"><i class="fa-solid fa-comments"></i></div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Transparent Reports</h3>
            <p style="font-size: 0.95rem;">Detailed digital report cards after each session covering coat health, weight, teeth, and mood notes.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section final-cta-section">
      <div class="container">
        <div class="final-cta-card">
          <div class="cta-peeking-rabbit float-gentle">
            <img src="${siteData.petImages.peekingRabbitCta}" alt="Rabbit">
            <span>Special Care for Every Pet</span>
          </div>
          <h2>Looking for Personalized Care Recommendations?</h2>
          <p>Talk with our certified pet care consultants to design a custom wellness roadmap for your pet companion.</p>
          <div class="cta-btn-group">
            <a href="#/contact" class="btn btn-primary btn-lg">
              <i class="fa-solid fa-envelope"></i>
              <span>Contact Care Team</span>
            </a>
            <a href="#/service-detail" class="btn btn-outline-white btn-lg">
              <i class="fa-solid fa-sparkles"></i>
              <span>View Spa Detail Page</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupServicesEvents() {
  // Service page specific events
}
