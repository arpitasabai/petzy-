/* PETZY Admin Payments & Financial Ledger View (Milestone 4) */
import {
  getPaymentRecords,
  refundPaymentRecord
} from '../../services/storage.js';
import { openPaymentReceiptModal } from '../../components/payment-receipt-modal.js';
import { showToast } from '../../components/toast.js';

let paymentSearchQuery = '';
let paymentStatusFilter = 'all';

export function renderAdminPayments() {
  const allPayments = getPaymentRecords();

  let grossRevenue = 0;
  let refundedTotal = 0;
  let paidCount = 0;

  allPayments.forEach(p => {
    const numeric = parseFloat(String(p.amount).replace(/[^0-9.]/g, '')) || 0;
    if (p.status === 'Paid') {
      grossRevenue += numeric;
      paidCount++;
    } else if (p.status === 'Refunded') {
      refundedTotal += numeric;
    }
  });

  const filtered = allPayments.filter(p => {
    const q = paymentSearchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/^#/, '');
    const matchesSearch = !q ||
      (p.id || '').toLowerCase().includes(cleanQ) ||
      (p.transactionId || '').toLowerCase().includes(cleanQ) ||
      (p.appointmentId || '').toLowerCase().includes(cleanQ) ||
      (p.customerName || '').toLowerCase().includes(q) ||
      (p.petName || '').toLowerCase().includes(q) ||
      (p.serviceName || '').toLowerCase().includes(q) ||
      (p.paymentMethod || '').toLowerCase().includes(q) ||
      (p.amount || '').toLowerCase().includes(q);

    const matchesStatus = paymentStatusFilter === 'all' || (p.status || '').toLowerCase() === paymentStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return `
    <div class="admin-tab-content animate-fade-up">
      
      <!-- Top Subhead -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; color: var(--color-forest-green); margin: 0 0 0.25rem; font-family: var(--font-heading);">
            <i class="fa-solid fa-receipt" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i>
            Financial Ledger & Payment Transactions
          </h2>
          <span style="font-size: 0.85rem; color: var(--color-charcoal-muted);">Real-time payment verification records, digital invoices, customer charges, and refund management.</span>
        </div>
      </div>

      <!-- 4 Financial Summary KPI Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        
        <div style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); border-left: 4px solid var(--color-forest-green); box-shadow: var(--shadow-sm);">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Net Gross Revenue</span>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--color-forest-green); font-family: var(--font-heading); margin-top: 0.25rem;">
            $${grossRevenue.toFixed(2)}
          </div>
          <span style="font-size: 0.78rem; color: #27AE60; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> ${paidCount} settled transactions</span>
        </div>

        <div style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Total Transactions</span>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--color-forest-green); font-family: var(--font-heading); margin-top: 0.25rem;">
            ${allPayments.length}
          </div>
          <span style="font-size: 0.78rem; color: var(--color-charcoal-muted);">All historical records</span>
        </div>

        <div style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Refunded Volume</span>
          <div style="font-size: 1.85rem; font-weight: 800; color: #DC2626; font-family: var(--font-heading); margin-top: 0.25rem;">
            $${refundedTotal.toFixed(2)}
          </div>
          <span style="font-size: 0.78rem; color: var(--color-charcoal-muted);">Processed refunds</span>
        </div>

        <div style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Security & Compliance</span>
          <div style="font-size: 1.4rem; font-weight: 800; color: #27AE60; font-family: var(--font-heading); margin-top: 0.4rem;">
            <i class="fa-solid fa-shield-check"></i> PCI Level 1
          </div>
          <span style="font-size: 0.78rem; color: var(--color-charcoal-muted);">256-Bit SSL Encrypted</span>
        </div>

      </div>

      <!-- Search & Status Filter Bar -->
      <div style="background: var(--color-white); padding: 1.15rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="position: relative; flex: 1; min-width: 260px;">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-charcoal-muted); font-size: 0.85rem;"></i>
          <input type="text" id="admin-pay-search-input" class="form-input" placeholder="Search by payment ID, transaction ID, client, pet, service..." value="${paymentSearchQuery}" autocomplete="off" style="padding-left: 2.25rem; padding-right: ${paymentSearchQuery ? '2.25rem' : '0.85rem'}; font-size: 0.85rem;">
          ${paymentSearchQuery ? `
            <button type="button" id="admin-pay-clear-btn" title="Clear Search" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--color-charcoal-muted); cursor: pointer; padding: 4px;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          ` : ''}
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <button type="button" class="quick-action-pill ${paymentStatusFilter === 'all' ? 'primary' : ''}" onclick="window.petzyAdminPayFilter('all')">
            All (${allPayments.length})
          </button>
          <button type="button" class="quick-action-pill ${paymentStatusFilter === 'paid' ? 'primary' : ''}" onclick="window.petzyAdminPayFilter('paid')">
            Paid (${allPayments.filter(p => p.status === 'Paid').length})
          </button>
          <button type="button" class="quick-action-pill ${paymentStatusFilter === 'refunded' ? 'primary' : ''}" onclick="window.petzyAdminPayFilter('refunded')">
            Refunded (${allPayments.filter(p => p.status === 'Refunded').length})
          </button>
        </div>
      </div>

      <!-- Payments Table -->
      <div style="background: var(--color-white); border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); overflow: hidden;">
        ${allPayments.length === 0 ? `
          <div style="text-align: center; padding: 3.5rem 1.5rem;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--color-warm-cream); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.85rem;">
              <i class="fa-solid fa-file-invoice-dollar" style="font-size: 1.75rem; color: var(--color-forest-green);"></i>
            </div>
            <h4 style="color: var(--color-forest-green); font-family: var(--font-heading); margin: 0 0 0.35rem; font-size: 1.2rem;">No Payment Records Recorded</h4>
            <p style="color: var(--color-charcoal-muted); font-size: 0.88rem; margin: 0 auto; max-width: 440px;">Live transactions, digital invoices, and settlement ledgers will populate here automatically when appointments are paid via online checkout (Card, PayPal, Apple Pay).</p>
          </div>
        ` : filtered.length === 0 ? `
          <div style="text-align: center; padding: 3.5rem 1.5rem;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--color-warm-cream); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.85rem;">
              <i class="fa-solid fa-filter-circle-xmark" style="font-size: 1.75rem; color: var(--color-soft-coral);"></i>
            </div>
            <h4 style="color: var(--color-forest-green); font-family: var(--font-heading); margin: 0 0 0.35rem; font-size: 1.2rem;">No Matching Transactions</h4>
            <p style="color: var(--color-charcoal-muted); font-size: 0.88rem; margin: 0 0 1rem;">No payments match your current search query "<strong>${paymentSearchQuery}</strong>" or selected status filter.</p>
            <button type="button" class="btn btn-outline" id="admin-pay-empty-clear-btn" style="font-size: 0.82rem; padding: 0.4rem 1rem;">
              <i class="fa-solid fa-rotate-left"></i>
              <span>Reset Search & Filters</span>
            </button>
          </div>
        ` : `
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="background: var(--color-warm-cream); border-bottom: 1.5px solid var(--color-forest-green); color: var(--color-forest-green); text-align: left; font-family: var(--font-heading); font-size: 0.78rem; text-transform: uppercase;">
                  <th style="padding: 0.85rem 1rem;">Payment Reference</th>
                  <th style="padding: 0.85rem 1rem;">Client / Pet</th>
                  <th style="padding: 0.85rem 1rem;">Clinical Service</th>
                  <th style="padding: 0.85rem 1rem;">Payment Method</th>
                  <th style="padding: 0.85rem 1rem;">Date & Time</th>
                  <th style="padding: 0.85rem 1rem;">Amount</th>
                  <th style="padding: 0.85rem 1rem;">Status</th>
                  <th style="padding: 0.85rem 1rem; text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(p => {
                  const isPaid = p.status === 'Paid';

                  return `
                    <tr style="border-bottom: 1px solid var(--color-border); transition: background 0.15s ease;">
                      <!-- Payment IDs -->
                      <td style="padding: 0.85rem 1rem;">
                        <strong style="color: var(--color-forest-green); font-family: monospace; display: block;">${p.id}</strong>
                        <span style="font-size: 0.72rem; color: var(--color-charcoal-muted); font-family: monospace;">Txn: ${p.transactionId}</span>
                        <span style="font-size: 0.72rem; color: var(--color-forest-green); display: block;">Appt #${p.appointmentId}</span>
                      </td>

                      <!-- Client / Pet -->
                      <td style="padding: 0.85rem 1rem;">
                        <strong style="color: var(--color-charcoal); display: block;">${p.customerName}</strong>
                        <span style="font-size: 0.75rem; color: var(--color-charcoal-muted);"><i class="fa-solid fa-paw" style="color: var(--color-soft-coral); margin-right: 0.2rem;"></i> ${p.petName}</span>
                      </td>

                      <!-- Service -->
                      <td style="padding: 0.85rem 1rem; color: var(--color-forest-green); font-weight: 600;">
                        ${p.serviceName}
                      </td>

                      <!-- Method -->
                      <td style="padding: 0.85rem 1rem; color: var(--color-charcoal);">
                        ${(p.paymentMethod || '').toLowerCase().includes('paypal') 
                          ? `<i class="fa-brands fa-paypal" style="color: #003087; font-size: 1rem; margin-right: 0.3rem;"></i>` 
                          : `<i class="fa-solid fa-credit-card" style="color: var(--color-forest-green); margin-right: 0.3rem;"></i>`}
                        <span>${p.paymentMethod || 'Credit Card •••• 4242'}</span>
                      </td>

                      <!-- Date -->
                      <td style="padding: 0.85rem 1rem; font-size: 0.8rem; color: var(--color-charcoal-muted);">
                        ${new Date(p.paymentDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <!-- Amount -->
                      <td style="padding: 0.85rem 1rem; font-size: 1rem; font-weight: 800; color: var(--color-forest-green); font-family: var(--font-heading);">
                        ${p.amount}
                      </td>

                      <!-- Status -->
                      <td style="padding: 0.85rem 1rem;">
                        <span class="section-badge" style="background: ${isPaid ? '#DCFCE7' : '#FEE2E2'}; color: ${isPaid ? '#16A34A' : '#DC2626'}; font-size: 0.72rem; padding: 0.2rem 0.6rem; margin: 0;">
                          <i class="fa-solid ${isPaid ? 'fa-check' : 'fa-rotate-left'}"></i>
                          <span>${p.status || 'Paid'}</span>
                        </span>
                      </td>

                      <!-- Actions -->
                      <td style="padding: 0.85rem 1rem; text-align: right;">
                        <div style="display: inline-flex; gap: 0.35rem;">
                          <button type="button" class="btn btn-outline" onclick="window.petzyAdminViewReceipt('${p.id}')" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" title="View & Print Official Digital Receipt">
                            <i class="fa-solid fa-file-invoice"></i>
                            <span>Receipt</span>
                          </button>

                          ${isPaid ? `
                            <button type="button" class="btn btn-outline" onclick="window.petzyAdminRefund('${p.id}', '${p.amount}', '${p.customerName}')" style="padding: 0.3rem 0.55rem; font-size: 0.78rem; border-color: #F5B7B1; color: #C0392B;" title="Process Refund">
                              <i class="fa-solid fa-rotate-left"></i>
                              <span>Refund</span>
                            </button>
                          ` : ''}
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

    </div>
  `;
}

export function setupAdminPaymentsEvents(refreshAdmin) {
  document.getElementById('admin-pay-search-input')?.addEventListener('input', (e) => {
    paymentSearchQuery = e.target.value;
    refreshAdmin();
  });

  document.getElementById('admin-pay-clear-btn')?.addEventListener('click', () => {
    paymentSearchQuery = '';
    refreshAdmin();
  });

  document.getElementById('admin-pay-empty-clear-btn')?.addEventListener('click', () => {
    paymentSearchQuery = '';
    paymentStatusFilter = 'all';
    refreshAdmin();
  });

  window.petzyAdminPayFilter = (status) => {
    paymentStatusFilter = status;
    refreshAdmin();
  };

  window.petzyAdminViewReceipt = (paymentId) => {
    openPaymentReceiptModal(paymentId);
  };

  window.petzyAdminRefund = (paymentId, amount, name) => {
    if (confirm(`Are you sure you want to process a full refund of ${amount} for ${name}? This will update the ledger and mark the payment as Refunded.`)) {
      refundPaymentRecord(paymentId);
      showToast(`Refund of ${amount} processed successfully for payment #${paymentId}.`, 'sage', 'fa-solid fa-rotate-left');
      refreshAdmin();
    }
  };
}
