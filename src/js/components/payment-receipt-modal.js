/* PETZY Digital Payment Receipt Modal Component */
import { getPaymentById, getPaymentByAppointmentId } from '../services/storage.js';

export function openPaymentReceiptModal(paymentOrApptId) {
  // Try fetching by payment ID first, then by appointment ID
  let payment = getPaymentById(paymentOrApptId) || getPaymentByAppointmentId(paymentOrApptId);

  if (!payment) {
    // If not in records, construct receipt view from appointment info
    payment = {
      id: `PAY-${paymentOrApptId}`,
      transactionId: `TXN_${Math.floor(100000000 + Math.random() * 900000000)}`,
      appointmentId: paymentOrApptId,
      customerName: 'Valued Pet Parent',
      petName: 'Companion Pet',
      serviceName: 'Veterinary Care',
      amount: '$55.00',
      paymentMethod: 'Credit Card •••• 4242',
      paymentDate: new Date().toISOString(),
      status: 'Paid'
    };
  }

  // Remove existing receipt modal if any
  const existing = document.getElementById('petzy-receipt-modal');
  if (existing) existing.remove();

  const formattedDate = new Date(payment.paymentDate || Date.now()).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const modalEl = document.createElement('div');
  modalEl.id = 'petzy-receipt-modal';
  modalEl.className = 'modal-backdrop animate-fade-in';
  modalEl.style.zIndex = '1050';

  modalEl.innerHTML = `
    <div class="modal-dialog" style="max-width: 620px; margin: 2rem auto; padding: 0; background: transparent; box-shadow: none;">
      <div class="receipt-paper-box animate-scale-up" id="receipt-print-area" style="background: #ffffff; border-radius: var(--radius-xl); padding: 2.25rem 2rem; border: 1px solid var(--color-border); box-shadow: var(--shadow-xl); position: relative; color: var(--color-charcoal);">
        
        <!-- Close Button -->
        <button type="button" class="modal-close-btn" id="close-receipt-modal-btn" aria-label="Close Receipt" style="position: absolute; top: 18px; right: 18px; background: var(--color-warm-cream); border: 1px solid var(--color-border); width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--color-forest-green); font-size: 1rem;">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- Top Header & Clinic Info -->
        <div style="text-align: center; border-bottom: 2px dashed var(--color-border); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div style="width: 36px; height: 36px; border-radius: var(--radius-full); background: var(--color-forest-green); color: var(--color-warm-cream); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              <i class="fa-solid fa-paw"></i>
            </div>
            <span style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--color-forest-green); letter-spacing: -0.5px;">PETZY</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--color-charcoal-muted); margin: 0; line-height: 1.4;">
            PETZY Veterinary Hospital & Healthcare Center<br>
            742 Evergreen Paws Way, Suite 400, San Francisco, CA 94107<br>
            Tel: +1 (800) 555-PETZY | 24/7 Hotline: +1 (800) 911-PAWS
          </p>
          
          <div style="display: inline-block; margin-top: 0.75rem; background: var(--color-sage-green-soft); color: var(--color-forest-green); font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); border: 1px solid var(--color-border);">
            <i class="fa-solid fa-file-invoice" style="margin-right: 0.3rem;"></i> OFFICIAL CLINICAL RECEIPT & PROOF OF PAYMENT
          </div>
        </div>

        <!-- Receipt Metadata Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: var(--color-warm-cream); padding: 1.15rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem; font-size: 0.85rem; border: 1px solid var(--color-border-subtle);">
          <div>
            <span style="color: var(--color-charcoal-muted); display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Receipt Number</span>
            <strong style="color: var(--color-forest-green); font-family: monospace; font-size: 0.95rem;">${payment.id}</strong>
          </div>
          <div>
            <span style="color: var(--color-charcoal-muted); display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Transaction Reference</span>
            <strong style="color: var(--color-charcoal); font-family: monospace;">${payment.transactionId}</strong>
          </div>
          <div>
            <span style="color: var(--color-charcoal-muted); display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Issue Date & Time</span>
            <strong style="color: var(--color-charcoal);">${formattedDate}</strong>
          </div>
          <div>
            <span style="color: var(--color-charcoal-muted); display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Payment Method</span>
            <strong style="color: var(--color-charcoal);"><i class="fa-solid fa-credit-card" style="color: var(--color-forest-green); margin-right: 0.25rem;"></i> ${payment.paymentMethod || 'Credit Card •••• 4242'}</strong>
          </div>
        </div>

        <!-- Customer & Patient Summary -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; font-size: 0.88rem; padding: 0 0.5rem;">
          <div>
            <span style="color: var(--color-charcoal-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 700; display: block;">Pet Parent / Client</span>
            <strong style="color: var(--color-forest-green); font-size: 1rem;">${payment.customerName}</strong>
            ${payment.customerEmail ? `<span style="display: block; font-size: 0.8rem; color: var(--color-charcoal-muted);">${payment.customerEmail}</span>` : ''}
          </div>
          <div>
            <span style="color: var(--color-charcoal-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 700; display: block;">Patient (Pet)</span>
            <strong style="color: var(--color-forest-green); font-size: 1rem;"><i class="fa-solid fa-paw" style="color: var(--color-soft-coral); margin-right: 0.3rem;"></i> ${payment.petName}</strong>
            <span style="display: block; font-size: 0.8rem; color: var(--color-charcoal-muted);">Appointment ID: #${payment.appointmentId}</span>
          </div>
        </div>

        <!-- Service & Charges Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.88rem;">
          <thead>
            <tr style="border-bottom: 1.5px solid var(--color-forest-green); color: var(--color-forest-green); font-family: var(--font-heading); font-size: 0.82rem; text-transform: uppercase;">
              <th style="text-align: left; padding: 0.5rem 0;">Description</th>
              <th style="text-align: right; padding: 0.5rem 0;">Qty</th>
              <th style="text-align: right; padding: 0.5rem 0;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--color-border);">
              <td style="padding: 0.85rem 0;">
                <strong style="color: var(--color-forest-green); display: block;">${payment.serviceName}</strong>
                <span style="font-size: 0.78rem; color: var(--color-charcoal-muted);">Fear-Free Certified Clinical Veterinary Care</span>
              </td>
              <td style="text-align: right; padding: 0.85rem 0; color: var(--color-charcoal);">1</td>
              <td style="text-align: right; padding: 0.85rem 0; font-weight: 700; color: var(--color-forest-green);">${payment.amount}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-border); font-size: 0.82rem; color: var(--color-charcoal-muted);">
              <td style="padding: 0.5rem 0;">Hospital Facility & Digital Records Fee</td>
              <td style="text-align: right; padding: 0.5rem 0;">1</td>
              <td style="text-align: right; padding: 0.5rem 0; color: #27AE60; font-weight: 600;">$0.00 (Waived)</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-border); font-size: 0.82rem; color: var(--color-charcoal-muted);">
              <td style="padding: 0.5rem 0;">Clinical Supplies & Surcharge</td>
              <td style="text-align: right; padding: 0.5rem 0;">1</td>
              <td style="text-align: right; padding: 0.5rem 0; color: #27AE60; font-weight: 600;">$0.00 (Included)</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding-top: 1rem; text-align: right; font-size: 0.95rem; font-weight: 700; color: var(--color-forest-green);">Total Paid:</td>
              <td style="padding-top: 1rem; text-align: right; font-size: 1.3rem; font-weight: 800; color: var(--color-forest-green); font-family: var(--font-heading);">${payment.amount}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Verification Badge / Status -->
        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-sage-green-soft); border-left: 4px solid #27AE60; padding: 0.85rem 1.15rem; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: #1e7e44; font-weight: 700;">
            <i class="fa-solid fa-circle-check" style="font-size: 1.1rem;"></i>
            <span>Payment Status: <strong>${payment.status || 'PAID'}</strong></span>
          </div>
          <span style="font-size: 0.78rem; color: var(--color-forest-green); font-weight: 600;">Auth Code: #AUTH-29481</span>
        </div>

        <!-- Footer Notice -->
        <div style="text-align: center; font-size: 0.75rem; color: var(--color-charcoal-light); margin-bottom: 1.5rem;">
          Thank you for trusting PETZY with your companion's care. For billing inquiries, contact billing@petzy.com.
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
          <button type="button" class="btn btn-outline" id="print-receipt-btn" style="font-size: 0.85rem;">
            <i class="fa-solid fa-print"></i>
            <span>Print Receipt</span>
          </button>
          <button type="button" class="btn btn-teal" id="done-receipt-btn" style="font-size: 0.85rem;">
            <span>Done</span>
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  // Event Listeners
  const closeModal = () => modalEl.remove();

  document.getElementById('close-receipt-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('done-receipt-btn')?.addEventListener('click', closeModal);
  
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  document.getElementById('print-receipt-btn')?.addEventListener('click', () => {
    window.print();
  });
}
