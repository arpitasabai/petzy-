/* PETZY Privacy Policy View (Veterinary Platform) */
import { siteData } from '../data.js';
import { renderBackButton } from '../components/back-button.js';
import { showToast } from '../components/toast.js';

export function renderPrivacyPolicy() {
  return `
    <!-- Inner Page Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container">
        <div style="display: flex; justify-content: flex-start; margin-bottom: 0.5rem;">
          ${renderBackButton('#/')}
        </div>
        <div class="section-badge" style="background: rgba(255, 255, 255, 0.15); color: var(--color-warm-cream); border: none; margin-bottom: 1rem;">
          <i class="fa-solid fa-shield-halved"></i>
          <span>Trust & Confidentiality</span>
        </div>
        <h1>Privacy Policy</h1>
        <p>Learn how PETZY collects, protects, and handles your personal data, pet medical records, and digital consultation details.</p>
        
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem; align-items: center;">
          <span class="legal-badge-pill"><i class="fa-regular fa-clock"></i> Last Updated: August 2026</span>
          <span class="legal-badge-pill"><i class="fa-solid fa-code-branch"></i> Version 2.4</span>
          <span class="legal-badge-pill"><i class="fa-solid fa-hospital-user"></i> AAHA & Fear-Free Certified Compliant</span>
        </div>
      </div>
    </section>

    <!-- Privacy Policy Content Section -->
    <section class="section" style="padding-top: 0;">
      <div class="container">
        
        <!-- Live Filter / Search Bar -->
        <div class="legal-search-wrapper">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--color-forest-green); font-size: 1.1rem;"></i>
          <input type="text" id="privacy-search-input" class="legal-search-input" placeholder="Search privacy topics (e.g. medical records, sharing, cookies, encryption)...">
        </div>

        <div class="legal-layout">
          
          <!-- Sticky Sidebar Navigation -->
          <aside class="legal-sidebar">
            <div class="legal-toc-card">
              <div class="legal-toc-title">
                <i class="fa-solid fa-list-ul"></i>
                <span>Table of Contents</span>
              </div>
              <nav class="legal-toc-list" id="privacy-toc">
                <a href="#sec-overview" class="legal-toc-link active" data-target="sec-overview">
                  <span>1. Overview & Commitment</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-collection" class="legal-toc-link" data-target="sec-collection">
                  <span>2. Information We Collect</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-use" class="legal-toc-link" data-target="sec-use">
                  <span>3. How We Use Information</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-security" class="legal-toc-link" data-target="sec-security">
                  <span>4. Medical Confidentiality</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-sharing" class="legal-toc-link" data-target="sec-sharing">
                  <span>5. Third-Party Sharing</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-cookies" class="legal-toc-link" data-target="sec-cookies">
                  <span>6. Cookies & Tracking</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-rights" class="legal-toc-link" data-target="sec-rights">
                  <span>7. Pet Parent Rights</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-retention" class="legal-toc-link" data-target="sec-retention">
                  <span>8. Data Retention</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
                <a href="#sec-contact" class="legal-toc-link" data-target="sec-contact">
                  <span>9. Privacy Officer Contact</span>
                  <i class="fa-solid fa-angle-right"></i>
                </a>
              </nav>
            </div>

            <!-- Quick Document Actions -->
            <div class="legal-quick-actions">
              <button type="button" class="legal-action-btn" id="print-privacy-btn">
                <i class="fa-solid fa-print"></i>
                <span>Print Policy</span>
              </button>
              <button type="button" class="legal-action-btn" id="copy-privacy-link-btn">
                <i class="fa-solid fa-link"></i>
                <span>Copy Page Link</span>
              </button>
            </div>

            <!-- Need Help Card -->
            <div style="background: var(--color-sage-green-soft); border: 1px solid var(--color-sage-green); border-radius: var(--radius-xl); padding: 1.5rem; text-align: center;">
              <i class="fa-solid fa-circle-question" style="font-size: 2rem; color: var(--color-forest-green); margin-bottom: 0.75rem;"></i>
              <h4 style="color: var(--color-forest-green); font-size: 1.05rem; margin-bottom: 0.5rem;">Have Privacy Questions?</h4>
              <p style="font-size: 0.85rem; color: var(--color-charcoal-muted); margin-bottom: 1rem;">Our Data Protection Team is available to assist with records requests.</p>
              <a href="#/contact" class="btn btn-teal btn-sm" style="width: 100%;">Contact Care Desk</a>
            </div>
          </aside>

          <!-- Main Legal Articles -->
          <main class="legal-content-main" id="privacy-content-main">
            
            <!-- Section 1: Overview -->
            <article class="legal-card" id="sec-overview">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-shield-dog"></i></div>
                <h2>1. Overview & Commitment to Confidentiality</h2>
              </div>
              <div class="legal-card-body">
                <p>Welcome to PETZY Veterinary & Pet Healthcare ("PETZY," "we," "our," or "us"). We recognize that your companion animals are treasured family members, and the personal details and medical history you entrust to us deserve the highest level of confidentiality and ethical protection.</p>
                <p>This Privacy Policy applies to all services provided across our hospital clinics, outpatient centers, mobile emergency response units, website (petzy.health), patient portals, and digital consultation systems.</p>
                <div class="legal-callout callout-info">
                  <i class="fa-solid fa-circle-info"></i>
                  <div>
                    <strong>Summary in Plain English:</strong> We treat your pet's health records with the same stringent confidentiality standards as human healthcare systems. We never sell your personal data or your pet's medical records to third-party advertisers.
                  </div>
                </div>
              </div>
            </article>

            <!-- Section 2: Information We Collect -->
            <article class="legal-card" id="sec-collection">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-folder-open"></i></div>
                <h2>2. Information We Collect</h2>
              </div>
              <div class="legal-card-body">
                <p>To deliver world-class veterinary diagnosis, treatment, and ongoing wellness care, we collect specific categories of personal and clinical information:</p>
                
                <h3>A. Pet Parent & Household Information</h3>
                <ul class="legal-list">
                  <li class="legal-list-item">
                    <i class="fa-solid fa-circle-check"></i>
                    <span><strong>Contact Information:</strong> Full name, primary & emergency telephone numbers, email address, and home residential address.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-circle-check"></i>
                    <span><strong>Authentication Data:</strong> Usernames, encrypted passwords, and security verification logs for the PETZY Patient Portal.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-circle-check"></i>
                    <span><strong>Billing & Insurance:</strong> Payment billing details, insurance provider policy numbers, and co-pay transaction receipts. (Payment cards are tokenized via PCI-DSS compliant payment gateways).</span>
                  </li>
                </ul>

                <h3>B. Pet Biological & Veterinary Medical Data</h3>
                <ul class="legal-list">
                  <li class="legal-list-item">
                    <i class="fa-solid fa-paw"></i>
                    <span><strong>Patient Identity:</strong> Pet's name, species, breed, sex, spay/neuter status, date of birth, color markings, and microchip registration ID.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-paw"></i>
                    <span><strong>Clinical History:</strong> Diagnostic pathology results, digital radiography/ultrasound imaging, surgical notes, immunization records, prescription histories, allergy profiles, and vital sign logs.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-paw"></i>
                    <span><strong>Behavioral & Dietary Profiles:</strong> Nutritional diet records, behavioral temperaments (e.g., Fear-Free handling preferences), and lifestyle activity notes.</span>
                  </li>
                </ul>
              </div>
            </article>

            <!-- Section 3: How We Use Information -->
            <article class="legal-card" id="sec-use">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-stethoscope"></i></div>
                <h2>3. How We Use Clinical & Patient Information</h2>
              </div>
              <div class="legal-card-body">
                <p>We process collected data exclusively for legitimate medical, operational, and clinical communication purposes:</p>
                <ul class="legal-list">
                  <li class="legal-list-item">
                    <i class="fa-solid fa-check"></i>
                    <span><strong>Clinical Care Delivery:</strong> Providing preventative checkups, emergency stabilization, surgical interventions, laboratory analyses, and pharmaceutical dispensing.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-check"></i>
                    <span><strong>Automated Health Reminders:</strong> Sending critical reminders for core vaccinations (Rabies, DHPP, FVRCP), parasite prevention schedules, and postoperative re-check appointments.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-check"></i>
                    <span><strong>Doctor-to-Parent Telehealth:</strong> Enabling secure live video consultations, medical chat inquiries, and digital prescription renewals.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-check"></i>
                    <span><strong>Hospital Quality & Safety:</strong> Internal clinical audits, staff training on Fear-Free handling techniques, and continuous service enhancement.</span>
                  </li>
                </ul>
              </div>
            </article>

            <!-- Section 4: Security Safeguards -->
            <article class="legal-card" id="sec-security">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-lock"></i></div>
                <h2>4. Medical Confidentiality & Security Protocols</h2>
              </div>
              <div class="legal-card-body">
                <p>PETZY implements multi-layered administrative, physical, and technological security controls to safeguard sensitive records against unauthorized access, loss, or alteration:</p>
                <div class="legal-callout callout-info">
                  <i class="fa-solid fa-shield-check"></i>
                  <div>
                    <strong>256-Bit SSL/TLS Encryption:</strong> All communications between your browser, mobile app, and our electronic veterinary medical records (EVMR) systems are encrypted in transit and at rest using enterprise AES-256 standard.
                  </div>
                </div>
                <p>Access to individual pet health records is strictly restricted to licensed veterinarians, veterinary technicians, and authorized practice managers directly involved in your companion's care.</p>
              </div>
            </article>

            <!-- Section 5: Third-Party Sharing -->
            <article class="legal-card" id="sec-sharing">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-handshake-angle"></i></div>
                <h2>5. Sharing With Diagnostic Labs & Specialists</h2>
              </div>
              <div class="legal-card-body">
                <p>We do NOT sell, rent, or trade your personal data. We only share necessary medical details under the following defined circumstances:</p>
                <ul class="legal-list">
                  <li class="legal-list-item">
                    <i class="fa-solid fa-flask"></i>
                    <span><strong>Accredited Reference Laboratories:</strong> Sending biopsy, blood, or genetic specimens to veterinary diagnostic partners (e.g. IDEXX, Antech) for clinical pathology evaluation.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-pills"></i>
                    <span><strong>Licensed Veterinary Pharmacies:</strong> Coordinating custom medication compounding or prescription fulfillment requested by you.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-hospital"></i>
                    <span><strong>Emergency Referral Hospitals:</strong> Forwarding radiograph files, ultrasound scans, and treatment notes when your pet is transferred to an intensive care trauma unit.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-scale-balanced"></i>
                    <span><strong>Legal Compliance:</strong> Complying with mandatory public health reporting laws (e.g., state-mandated rabies registry reporting).</span>
                  </li>
                </ul>
              </div>
            </article>

            <!-- Section 6: Cookies & Tracking -->
            <article class="legal-card" id="sec-cookies">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-cookie-bite"></i></div>
                <h2>6. Cookies & Digital Tracking Technologies</h2>
              </div>
              <div class="legal-card-body">
                <p>Our website utilizes necessary and performance cookies to maintain authenticated session tokens, remember preferred clinic locations, and analyze website speed and performance. You may disable cookies through your browser settings, though certain portal capabilities may be limited.</p>
              </div>
            </article>

            <!-- Section 7: Pet Parent Rights -->
            <article class="legal-card" id="sec-rights">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-user-shield"></i></div>
                <h2>7. Pet Parent Rights & Medical Records Access</h2>
              </div>
              <div class="legal-card-body">
                <p>As an active pet parent at PETZY, you maintain comprehensive rights concerning your personal and veterinary data:</p>
                <ul class="legal-list">
                  <li class="legal-list-item">
                    <i class="fa-solid fa-file-medical"></i>
                    <span><strong>Direct Record Export:</strong> You are entitled to a complete digital copy of your pet's immunization history, diagnostic results, and clinical doctor notes at no extra charge via your Patient Portal.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span><strong>Correction of Inaccuracies:</strong> Request prompt rectification of erroneous contact or medical records.</span>
                  </li>
                  <li class="legal-list-item">
                    <i class="fa-solid fa-bell-slash"></i>
                    <span><strong>Communication Preferences:</strong> Opt out of non-critical educational newsletters or marketing reminders with a single click.</span>
                  </li>
                </ul>
              </div>
            </article>

            <!-- Section 8: Data Retention -->
            <article class="legal-card" id="sec-retention">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
                <h2>8. Data Retention & Archival Guidelines</h2>
              </div>
              <div class="legal-card-body">
                <p>In accordance with statutory state veterinary medical board requirements, patient health histories, surgical logs, and diagnostic records are securely preserved for a minimum of seven (7) years following the last clinical visit to guarantee continuity of lifelong care.</p>
              </div>
            </article>

            <!-- Section 9: Contact -->
            <article class="legal-card" id="sec-contact">
              <div class="legal-card-header">
                <div class="legal-card-icon"><i class="fa-solid fa-envelope-open-text"></i></div>
                <h2>9. Policy Updates & Privacy Officer Contact</h2>
              </div>
              <div class="legal-card-body">
                <p>We may periodically update this policy to reflect evolving medical regulations and system enhancements. If significant modifications occur, notice will be posted across the PETZY portal and emailed to active account holders.</p>
                <div class="legal-callout callout-info" style="margin-top: 1.5rem;">
                  <i class="fa-solid fa-building-shield"></i>
                  <div>
                    <strong>PETZY Data Protection & Medical Records Office:</strong><br>
                    Email: <a href="mailto:privacy@petzy.health" style="color: var(--color-forest-green); font-weight: 700; text-decoration: underline;">privacy@petzy.health</a><br>
                    Hotline: ${siteData.brand.phone}<br>
                    Address: ${siteData.brand.address}
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

export function setupPrivacyPolicyEvents() {
  const searchInput = document.getElementById('privacy-search-input');
  const articles = document.querySelectorAll('#privacy-content-main .legal-card');
  const tocLinks = document.querySelectorAll('#privacy-toc .legal-toc-link');
  const printBtn = document.getElementById('print-privacy-btn');
  const copyLinkBtn = document.getElementById('copy-privacy-link-btn');

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

  // 4. Print Policy
  printBtn?.addEventListener('click', () => {
    window.print();
  });

  // 5. Copy Link
  copyLinkBtn?.addEventListener('click', () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast('Privacy Policy link copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Link copied: ' + url, 'info');
    });
  });
}
