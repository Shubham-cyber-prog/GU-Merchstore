// ─── services/emailService.js ─────────────────────────────────────────────────
// M2 Owned — Nodemailer SMTP service with reusable templates

const nodemailer = require('nodemailer');

let transporter = null;

/**
 * Lazy-initialize nodemailer transporter
 */
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST || 'smtp.gmail.com',
      port:   parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,  // STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
  }
  return transporter;
};

/**
 * Core send function
 * @param {string} to        - Recipient email
 * @param {string} subject   - Email subject
 * @param {string} html      - HTML body
 * @param {string} [text]    - Plain text fallback
 */
const sendEmail = async (to, subject, html, text = '') => {
  const t = getTransporter();

  const mailOptions = {
    from: `"MerchStore 🎓" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ' '),
  };

  try {
    const info = await t.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.message);
    throw err;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// HTML Email Templates
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Build HTML for low-stock alert email
 * @param {Array<{name: string, sku: string, size: string, stock: number}>} products
 */
const buildLowStockHTML = (products) => {
  const rows = products.map(p => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-weight:600;">${p.name}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-family:monospace;color:#6b7280;">${p.sku || 'N/A'}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;text-align:center;">${p.size}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;text-align:center;">
        <span style="background:${p.stock === 0 ? '#fee2e2' : '#fef9c3'};color:${p.stock === 0 ? '#dc2626' : '#92400e'};padding:4px 10px;border-radius:9999px;font-weight:700;font-size:13px;">
          ${p.stock === 0 ? 'OUT OF STOCK' : `${p.stock} left`}
        </span>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);padding:32px 40px;">
            <table width="100%"><tr>
              <td>
                <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">🎓 MerchStore</h1>
                <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">Geeta University · Inventory Management</p>
              </td>
              <td align="right">
                <span style="background:#ef4444;color:#fff;padding:6px 14px;border-radius:9999px;font-size:12px;font-weight:700;">⚠️ LOW STOCK ALERT</span>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px;">Inventory Alert — Action Required</h2>
            <p style="margin:0 0 24px;color:#64748b;line-height:1.6;">
              The following products are running low on stock (below threshold of <strong>${process.env.LOW_STOCK_THRESHOLD || 10} units</strong>). 
              Please restock to avoid disruption.
            </p>

            <!-- Products Table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:12px 16px;text-align:left;color:#374151;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Product</th>
                  <th style="padding:12px 16px;text-align:left;color:#374151;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">SKU</th>
                  <th style="padding:12px 16px;text-align:center;color:#374151;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Size</th>
                  <th style="padding:12px 16px;text-align:center;color:#374151;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Stock</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>

            <p style="margin:24px 0 0;color:#64748b;font-size:13px;">
              Report generated: <strong>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
              This is an automated alert from MerchStore · Geeta University<br>
              Do not reply to this email — contact IT at <a href="mailto:it@geetauniversity.ac.in" style="color:#3b82f6;">it@geetauniversity.ac.in</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Build a premium HTML order receipt email
 * @param {Object} order  - Mongoose order document
 * @param {Object} user   - { name, email }
 */
const buildOrderConfirmHTML = (order, user) => {
  const orderId = order._id.toString().slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleString('en-IN', {
    timeZone:    'Asia/Kolkata',
    day:         '2-digit',
    month:       'long',
    year:        'numeric',
    hour:        '2-digit',
    minute:      '2-digit',
  });

  const paymentLabel = {
    cod:    '💵 Cash on Delivery',
    upi:    '📱 UPI Payment',
    stripe: '💳 Card Payment (Stripe)',
  }[order.paymentMethod] || order.paymentMethod;

  const statusLabel = {
    paid:    { text: 'PAID', bg: '#dcfce7', color: '#15803d' },
    pending: { text: 'PENDING', bg: '#fef9c3', color: '#92400e' },
    failed:  { text: 'FAILED', bg: '#fee2e2', color: '#dc2626' },
  }[order.paymentStatus] || { text: order.paymentStatus?.toUpperCase(), bg: '#f0f0f0', color: '#374151' };

  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:14px 18px;border-bottom:1px solid #f3f4f6;vertical-align:middle;">
        <div style="font-weight:600;color:#111827;font-size:14px;">${item.name}</div>
        <div style="font-size:12px;color:#9ca3af;margin-top:3px;">Size: <strong>${item.size}</strong></div>
      </td>
      <td style="padding:14px 18px;border-bottom:1px solid #f3f4f6;text-align:center;color:#6b7280;font-size:14px;">×${item.qty}</td>
      <td style="padding:14px 18px;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:600;color:#111827;font-size:14px;">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const addressBlock = order.address
    ? `${order.address.fullName || ''}, ${order.address.street || ''}, ${order.address.city || ''}, ${order.address.state || ''} - ${order.address.pincode || ''}`
    : 'Address on file';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Order Confirmed - MerchStore</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- ══ HEADER ════════════════════════════════════════════════════════ -->
        <tr>
          <td style="background:linear-gradient(135deg,#6d0b2f 0%,#9a1040 60%,#8B1538 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:50px;padding:6px 18px;margin-bottom:16px;">
              <span style="color:#f0c040;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Order Receipt</span>
            </div>
            <div style="font-size:48px;margin-bottom:8px;">✅</div>
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">Order Confirmed!</h1>
            <p style="margin:10px 0 0;color:rgba(255,255,255,0.75);font-size:15px;">
              Hi <strong style="color:#f0c040;">${user.name}</strong>, your order has been placed successfully.
            </p>
          </td>
        </tr>

        <!-- ══ ORDER META ═════════════════════════════════════════════════════ -->
        <tr>
          <td style="background:#ffffff;padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f3f4f6;">
              <tr>
                <td style="padding:20px 40px;border-right:1px solid #f3f4f6;text-align:center;">
                  <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Order ID</div>
                  <div style="font-size:16px;font-weight:800;color:#111827;font-family:monospace;background:#f9fafb;padding:6px 12px;border-radius:8px;border:1px solid #e5e7eb;">#${orderId}</div>
                </td>
                <td style="padding:20px 40px;border-right:1px solid #f3f4f6;text-align:center;">
                  <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Date</div>
                  <div style="font-size:14px;font-weight:600;color:#374151;">${orderDate} IST</div>
                </td>
                <td style="padding:20px 40px;text-align:center;">
                  <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Payment</div>
                  <span style="background:${statusLabel.bg};color:${statusLabel.color};padding:5px 12px;border-radius:9999px;font-size:12px;font-weight:700;">${statusLabel.text}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ ITEMS TABLE ═══════════════════════════════════════════════════ -->
        <tr>
          <td style="background:#ffffff;padding:28px 40px 0;">
            <h2 style="margin:0 0 16px;font-size:16px;font-weight:700;color:#111827;border-bottom:2px solid #f9fafb;padding-bottom:12px;">🛍️ Order Items</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <thead>
                <tr style="background:#f9fafb;">
                  <th style="padding:12px 18px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
                  <th style="padding:12px 18px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
                  <th style="padding:12px 18px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Amount</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
          </td>
        </tr>

        <!-- ══ TOTALS ═════════════════════════════════════════════════════════ -->
        <tr>
          <td style="background:#ffffff;padding:0 40px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
              ${order.discountAmount > 0 ? `
              <tr>
                <td style="padding:8px 0;color:#6b7280;font-size:14px;">Subtotal</td>
                <td style="padding:8px 0;text-align:right;color:#374151;font-size:14px;">₹${order.totalAmount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#16a34a;font-size:14px;">🏷️ Discount (${order.couponCode})</td>
                <td style="padding:8px 0;text-align:right;color:#16a34a;font-size:14px;font-weight:600;">−₹${order.discountAmount.toLocaleString('en-IN')}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding:14px 18px;background:linear-gradient(135deg,#6d0b2f,#9a1040);border-radius:10px 0 0 10px;">
                  <span style="color:#ffffff;font-size:15px;font-weight:700;">Total Paid</span>
                </td>
                <td style="padding:14px 18px;background:linear-gradient(135deg,#9a1040,#6d0b2f);border-radius:0 10px 10px 0;text-align:right;">
                  <span style="color:#f0c040;font-size:20px;font-weight:800;">₹${order.finalAmount.toLocaleString('en-IN')}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ PAYMENT & ADDRESS ══════════════════════════════════════════════ -->
        <tr>
          <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:50%;vertical-align:top;padding-right:16px;">
                  <div style="font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-weight:600;">Payment Method</div>
                  <div style="font-size:14px;color:#374151;font-weight:600;">${paymentLabel}</div>
                </td>
                <td style="width:50%;vertical-align:top;padding-left:16px;border-left:1px solid #e5e7eb;">
                  <div style="font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-weight:600;">📦 Delivery Address</div>
                  <div style="font-size:13px;color:#374151;line-height:1.6;">${addressBlock}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ CTA BUTTON ══════════════════════════════════════════════════════ -->
        <tr>
          <td style="background:#ffffff;padding:28px 40px;text-align:center;border-top:1px solid #f3f4f6;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard"
               style="display:inline-block;background:linear-gradient(135deg,#6d0b2f,#9a1040);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
              📦 Track Your Order
            </a>
            <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
              You can view your full order history in your MerchStore dashboard.
            </p>
          </td>
        </tr>

        <!-- ══ FOOTER ══════════════════════════════════════════════════════════ -->
        <tr>
          <td style="background:linear-gradient(135deg,#1f2937,#111827);border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
            <div style="font-size:18px;font-weight:800;color:#ffffff;margin-bottom:6px;">🎓 MerchStore</div>
            <div style="font-size:12px;color:#6b7280;margin-bottom:16px;">Geeta University Official Store</div>
            <div style="font-size:12px;color:#6b7280;line-height:1.8;">
              This is an automated receipt. Do not reply to this email.<br>
              For support, contact us at 
              <a href="mailto:sn343555@gmail.com" style="color:#f0c040;text-decoration:none;">sn343555@gmail.com</a>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * High-level helper: send order confirmation to buyer
 * Silently fails to not break the order flow if email is down.
 * @param {Object} order  - Saved Mongoose order document
 * @param {Object} user   - { name, email }
 */
const sendOrderConfirmation = async (order, user) => {
  if (!user?.email) return;
  try {
    const html = buildOrderConfirmHTML(order, user);
    const orderId = order._id.toString().slice(-8).toUpperCase();
    await sendEmail(
      user.email,
      `✅ Order Confirmed #${orderId} — MerchStore`,
      html
    );
  } catch (err) {
    // Log but don't crash the order flow
    console.error('⚠️ Order confirmation email failed (non-fatal):', err.message);
  }
};

// For testing: allow transporter reset
const _resetForTest = () => { transporter = null; };

module.exports = {
  sendEmail,
  buildLowStockHTML,
  buildOrderConfirmHTML,
  sendOrderConfirmation,
  _resetForTest,
};
