/* PETZY Terms & Conditions View (Veterinary Platform) */
import { siteData } from '../data.js';
import { renderBackButton } from '../components/back-button.js';
import { showToast } from '../components/toast.js';

export function renderTermsConditions() {
  return `
    <!-- Inner Page Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container">
        <div style="display: flex; justify-content: flex-start; margin-bottom: 0.5rem;">
          ${renderBackButton('#/')}
        </div>
        <div class="section-badge" style="background: rgba(255, 255, 255, 0.15); color: var(--color-warm-cream); border: none; margin-bottom: 1rem;">
          <i class="fa-solid fa-file-contract"></i>
          <span>Patient Agreement & Clinical Policy</span>
        </div>
        <h1>Terms & Conditions</h1>
        <p>Please review our terms of veterinary service, clinical care protocols, patient portal guidelines, and appointment policies.</p>
        
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem; align-items: center;">
          <span class="legal-badge-pill"><i class="fa-regular fa-clock"></i> Effective Date: August 2026</span>
          <span class="legal-badge-pill"><i class="fa-solid fa-scale-balanced"></i> Version 3.1</span>
          <span class="legal-badge-pill"><i class="fa-solid fa-user-doctor"></i> Licensed Veterinary Hospital Standards</span>
        </div>
      </div>
    </section>

    <!-- Terms & Conditions Content Section -->
    <section class="section" style="padding-top: 0;">
      <div class="container">
        
        <!-- Live Filter / Search Bar -->
        <div class="legal-search-wrapper">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--color-forest-green); font-size: 1.1rem;"></i>
          <input type="text" id="terms-search-input" class="legal-search-input" placeholder="Search terms (e.g. appointments, cancellation, emergency, payments, prescriptions)...">
        </div>

        <div class="legal-layout">
          
          <!-- Sticky Sidebar Navigation -->
          <aside class="legal-sidebar">
            <div class="legal-toc-card">
              <div class="legal-toc-title">
                <i class="fa-solid fa-list-ul"></i>
                <span>Table of Contents</span>
              </div>
              <nav class="legal-toc-list" id="terms-toc">
                <a href="#sec-agreement" class="legal-toc-link active" data-target="sec-agreement">
                  <span>1. Agreement & Consent</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-services" class="legal-toc-link" data-target="sec-services">
                  <span>2. Veterinary Services</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-emergency" class="legal-toc-link" data-target="sec-emergency">
                  <span>3. Emergency Care Protocols</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-appointments" class="legal-toc-link" data-target="sec-appointments">
                  <span>4. Booking & Cancellations</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-portal" class="legal-toc-link" data-target="sec-portal">
                  <span>5. Patient Portal Accounts</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-financial" class="legal-toc-link" data-target="sec-financial">
                  <span>6. Fees & Insurance</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-prescriptions" class="legal-toc-link" data-target="sec-prescriptions">
                  <span>7. Pharmacy & Prescriptions</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-liability" class="legal-toc-link" data-target="sec-liability">
                  <span>8. Limitation of Liability</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-ip" class="legal-toc-link" data-target="sec-ip">
                  <span>9. Intellectual Property</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-disputes" class="legal-toc-link" data-target="sec-disputes">
                  <span>10. Governing Law</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
              </nav>
            </div>

            <!-- Quick Document Actions -->
            <div class="legal-quick-actions">
              <button type="button" class="legal-action-btn" id="print-terms-btn">
                <i class="fa-solid fa-print"></i>
                <span>Print Terms</span>
              </button>
              <button type="button" class="legal-action-btn" id="copy-terms-link-btn">
                <i class="fa-solid fa-link"></i>
                <span>Copy Page Link</span>
              </button>
            </div>

            <!-- Need Help Card -->
            <div style="background: var(--color-warm-cream-dark); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: 1.5rem; text-align: center;">
              <i class="fa-solid fa-headset" style="font-size: 2rem; color: var(--color-forest-green); margin-bottom: 0.75rem;"></i>
              <h4 style="color: var(--color-forest-green); font-size: 1.05rem; margin-bottom: 0.5rem;">Questions Regarding Terms?</h4>
              <p style="font-size: 0.85rem; color: var(--color-charcoal-muted); margin-bottom: 1rem;">Our Hospital Practice Management team is happy to clarify any clinical policies.</p>
              <a href="#/contact" class="btn btn-coral btn-sm" style="width: 100%;">Contact Clinic Staff</a>
            </div>
          </aside>

          <!-- Main Legal Articles -->
          <main class="legal-content-main" id="terms-content-main">
            
            <!-- Section 1: Agreement -->
            <article class="legal-card" id="sec-agreement">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-handshake"></i></div>
                <h2>1. Acceptance of Terms & Pet Parent Agreement</h2>
              </div>
              <div class="legal-card-body">
                <p>Welcome to PETZY Veterinary & Pet Care Center. By booking an appointment, admitting an animal patient to our hospital, utilizing our telemedicine platform, or creating an account on the PETZY Patient Portal, you ("Client," "Pet Parent," or "User") agree to be legally bound by these Terms & Conditions.</p>
                <p>If you do not agree to all terms stated herein, you must refrain from utilizing our online platforms and notify our intake staff prior to the delivery of clinical care.</p>
                <div class="legal-callout callout-info">
                  <i class="fa-solid fa-circle-check"></i>
                  <div>
                    <strong>Authorized Pet Guardian:</strong> You affirm that you are at least 18 years of age and the registered legal owner or authorized custodian of the animal presented for treatment.
                  </div>
                </div>
              </div>
            </article>

            <!-- Section 2: Veterinary Services -->
            <article class="legal-card" id="sec-services">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-stethoscope"></i></div>
                <h2>2. Veterinary Medical Services & Clinical Consultations</h2>
              </div>
              <div class="legal-card-body">
                <p>PETZY delivers clinical services across outpatient preventative wellness, internal medicine, surgery, diagnostics, dentistry, oncology, and emergency triage. All medical evaluations and treatments are conducted by or under the direct supervision of licensed Doctors of Veterinary Medicine (DVM / VMD).</p>
                <p>Veterinary medicine is inherently variable. While our clinical staff exercises rigorous medical standards and adheres to American Animal Hospital Association (AAHA) guidelines, <strong>no guarantee or warranty can be given regarding specific medical or surgical outcomes.</strong></p>
              </div>
            </article>

            <!-- Section 3: Emergency Care Protocols -->
            <article class="legal-card" id="sec-emergency">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-truck-medical"></i></div>
                <h2>3. Emergency Care Protocols & Critical Disclaimers</h2>
              </div>
              <div class="legal-card-body">
                <div class="legal-callout callout-warning">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <div>
                    <strong>CRITICAL MEDICAL NOTICE:</strong> Website contact forms, email messages, and non-emergency telemedicine chats are NOT monitored in real time for life-threatening crises. In an acute emergency (e.g. severe trauma, difficulty breathing, toxic ingestion, collapse), immediately transport your pet to our 24/7 emergency facility or call <strong>+1 (800) 555-PETZY</strong>.
                  </div>
                </div>
                <p>In life-threatening situations where a pet parent cannot be reached immediately, PETZY veterinary clinicians are authorized to perform emergency stabilization, oxygen therapy, pain relief, and resuscitation in accordance with established veterinary ethics to prevent unnecessary animal suffering.</p>
              </div>
            </article>

            <!-- Section 4: Appointment Bookings & Cancellations -->
            <article class="legal-card" id="sec-appointments">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-calendar-days"></i></div>
                <h2>4. Appointment Bookings, Rescheduling & Cancellation Policy</h2>
              </div>
              <div class="legal-card-body">
                <p>To respect our doctors' clinical schedules and guarantee timely care for ill companion animals, PETZY maintains the following appointment policy:</p>
                <ul class="legal-list">
                  <li class="legal-list-item">
                    <i class="fa-solid fa-clock"></i>
                    <span><strong>General Consultations:</strong> Please provide at least <strong>24 hours advance notice</strong> if you need to reschedule or cancel a routine wellness consultation.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-scissors"></i>
                    <span><strong>Specialty Surgery & Anesthesia Procedures:</strong> Surgical procedures require dedicated surgical suite time and anesthesia staffing. A minimum of <strong>48 hours notice</strong> is required for cancellations.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <span><strong>Late Arrivals:</strong> If you arrive more than 15 minutes past your scheduled appointment time, we may need to reschedule your visit or accommodate you in our walk-in triage queue.</span>
                  </li>
                </ul>
              </div>
            </article>

            <!-- Section 5: Patient Portal Accounts -->
            <article class="legal-card" id="sec-portal">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-user-lock"></i></div>
                <h2>5. Patient Portal Accounts & Electronic Pet Records</h2>
              </div>
              <div class="legal-card-body">
                <p>When creating a PETZY Patient Portal account, you agree to maintain the security and confidentiality of your credentials. You are responsible for all activities and booking requests conducted under your account.</p>
                <p>Electronic medical records, diagnostic radiograph images, lab reports, and vaccination certificates made available through the portal remain the property of PETZY and are provided for personal healthcare reference and referral purposes.</p>
              </div>
            </article>

            <!-- Section 6: Fees & Insurance -->
            <article class="legal-card" id="sec-financial">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-credit-card"></i></div>
                <h2>6. Payment Terms, Fee Estimates & Pet Insurance Claims</h2>
              </div>
              <div class="legal-card-body">
                <p>Payment in full is due at the time veterinary services are rendered or upon pet discharge following hospitalization:</p>
                <ul class="legal-list">
                  <li class="legal-list-item">
                    <i class="fa-solid fa-receipt"></i>
                    <span><strong>Treatment Plans & Estimates:</strong> A written treatment estimate will be provided prior to major surgeries, advanced diagnostic imaging, or inpatient hospitalizations.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-credit-card"></i>
                    <span><strong>Accepted Payment Methods:</strong> We accept Visa, MasterCard, American Express, Apple Pay, Google Pay, debit cards, CareCredit, and Scratchpay.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-shield-heart"></i>
                    <span><strong>Pet Health Insurance:</strong> While pet parents are directly responsible for veterinary fees, PETZY happily completes and submits direct insurance claims (e.g. Trupanion, Nationwide, Healthy Paws, MetLife) on your behalf.</span>
                  </li>
                </ul>
              </div>
            </article>

            <!-- Section 7: Prescriptions -->
            <article class="legal-card" id="sec-prescriptions">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-pills"></i></div>
                <h2>7. Pharmacy Dispensing & Prescription Refill Guidelines</h2>
              </div>
              <div class="legal-card-body">
                <p>Under state veterinary medical regulations and the Veterinary-Client-Patient Relationship (VCPR), <strong>prescription medications cannot be dispensed or refilled without an active clinical examination of the patient within the preceding 12 months</strong>.</p>
                <p>Refill requests placed via phone or portal require 24 to 48 business hours for veterinarian review, verification, and compounding packaging.</p>
              </div>
            </article>

            <!-- Section 8: Limitation of Liability -->
            <article class="legal-card" id="sec-liability">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-scale-balanced"></i></div>
                <h2>8. Professional Disclaimers & Limitation of Liability</h2>
              </div>
              <div class="legal-card-body">
                <p>To the maximum extent permitted by applicable law, PETZY, its licensed veterinary surgeons, nursing staff, officers, and employees shall not be liable for indirect, incidental, punitive, or consequential damages arising out of the use of our digital platforms or unforeseen biological reactions to approved veterinary medications.</p>
                <p>Information provided on our educational blog, FAQs, and symptom checklists is intended solely for educational guidance and does not replace in-person veterinary physical examinations.</p>
              </div>
            </article>

            <!-- Section 9: Intellectual Property -->
            <article class="legal-card" id="sec-ip">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-copyright"></i></div>
                <h2>9. Intellectual Property & Permitted Platform Use</h2>
              </div>
              <div class="legal-card-body">
                <p>All trademarks, logos, custom illustrations, medical photography, user interface designs, and code comprising the PETZY platform are the exclusive intellectual property of PETZY Healthcare Inc. Unauthorized copying, scraping, reproduction, or distribution without prior written consent is strictly prohibited.</p>
              </div>
            </article>

            <!-- Section 10: Governing Law -->
            <article class="legal-card" id="sec-disputes">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-gavel"></i></div>
                <h2>10. Governing Law & Dispute Resolution</h2>
              </div>
              <div class="legal-card-body">
                <p>These Terms & Conditions shall be governed by and construed in accordance with the laws of the State of California and applicable state veterinary practice acts, without regard to conflicts of law principles.</p>
                <div class="legal-callout callout-info" style="margin-top: 1.5rem;">
                  <i class="fa-solid fa-hospital"></i>
                  <div>
                    <strong>PETZY Practice Management Desk:</strong><br>
                    Email: <a href="mailto:support@petzy.health" style="color: var(--color-forest-green); font-weight: 700; text-decoration: underline;">support@petzy.health</a><br>
                    Phone: ${siteData.brand.phone}<br>
                    Hours: Monday – Sunday: 7:00 AM – 9:00 PM (Emergency Trauma: 24/7)
                  </div>
                </div>
              </div>
            </article>

          </main>
        </div>

      </div>
    </section>
  `;
}

export function setupTermsConditionsEvents() {
  const searchInput = document.getElementById('terms-search-input');
  const articles = document.querySelectorAll('#terms-content-main .legal-card');
  const tocLinks = document.querySelectorAll('#terms-toc .legal-toc-link');
  const printBtn = document.getElementById('print-terms-btn');
  const copyLinkBtn = document.getElementById('copy-terms-link-btn');

  // 1. Live Search Filter
  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    articles.forEach(article => {
      const text = article.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        article.style.display = 'block';
      } else {
        article.style.display = 'none';
      }
    });
  });

  // 2. Smooth Scroll for TOC Links
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        tocLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // 3. Highlight TOC on Scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach(link => {
          if (link.getAttribute('data-target') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-80px 0px -60% 0px' });

  articles.forEach(art => observer.observe(art));

  // 4. Print Terms
  printBtn?.addEventListener('click', () => {
    window.print();
  });

  // 5. Copy Link
  copyLinkBtn?.addEventListener('click', () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast('Terms & Conditions link copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Link copied: ' + url, 'info');
    });
  });
}
