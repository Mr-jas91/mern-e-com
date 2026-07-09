// utils/printInvoice.js
import showToast from "../../shared/toastMsg/showToast";

export const printOrderInvoice = (targetOrder, orderId) => {
    if (!targetOrder) {
        showToast("error", "Print failed: Target order record not found");
        return;
    }

    const printWindow = window.open("", "_blank", "width=850,height=700");

    // Safe date extraction
    const orderDate = targetOrder.createdAt
        ? new Date(targetOrder.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
        : "N/A";

    const itemsHtml = targetOrder.orderItems?.map(item => `
    <tr>
      <td>
        <div style="font-weight: 600; color: #1a1a1a;">${item.name}</div>
        <div style="font-size: 11px; color: #666; margin-top: 2px;">SKU: ${item._id?.$oid || item._id || "N/A"}</div>
      </td>
      <td style="text-align: center;">₹${item.price.toLocaleString("en-IN")}</td>
      <td style="text-align: center; color: #e53e3e;">- ₹${(item.discount || 0).toLocaleString("en-IN")}</td>
      <td style="text-align: center; font-weight: 600;">${item.quantity}</td>
      <td style="text-align: right; font-weight: 700;">₹${((item.price - (item.discount || 0)) * item.quantity).toLocaleString("en-IN")}</td>
    </tr>
  `).join("") || "";

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${orderId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { padding: 40px; color: #333; background: #fff; line-height: 1.5; font-size: 14px; }
          
          /* Header Layout */
          .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 25px; margin-bottom: 30px; }
          .company-logo { font-size: 24px; font-weight: 700; color: #1e3a8a; letter-spacing: -0.5px; }
          .company-details { text-align: right; font-size: 12px; color: #64748b; line-height: 1.7; }
          
          /* Title & Meta */
          .invoice-title-bar { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-title { font-size: 20px; font-weight: 700; color: #0f172a; text-transform: uppercase; }
          .meta-item { font-size: 13px; margin-bottom: 5px; color: #334155; }
          .meta-item strong { color: #0f172a; }

          /* Address Grid */
          .address-section { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 35px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #f1f5f9; }
          .address-box h3 { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 10px; letter-spacing: 0.5px; }
          .address-box p { font-size: 13px; color: #334155; line-height: 1.6; }

          /* Table Styling */
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background-color: #0f172a; color: #ffffff; font-weight: 600; font-size: 12px; text-transform: uppercase; padding: 12px 16px; letter-spacing: 0.5px; }
          td { padding: 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; vertical-align: middle; }
          tr:last-child td { border-bottom: 2px solid #0f172a; }

          /* Summary Box */
          .summary-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
          .summary-table { width: 300px; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #475569; }
          .summary-row.grand-total { border-top: 1px dashed #cbd5e1; margin-top: 8px; padding-top: 12px; font-size: 16px; font-weight: 700; color: #1e3a8a; }

          /* Footer Notice */
          .invoice-footer { margin-top: 60px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }

          /* Print Optimization */
          @media print {
            body { padding: 0; }
            @page { margin: 1.5cm; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div>
            <div class="company-logo">YOUR STORE LOGO</div>
            <p style="font-size: 12px; color: #64748b; margin-top: 4px;">Premium E-Commerce Logistics</p>
          </div>
          <div class="company-details">
            <strong>Headquarters Office</strong><br>
            123 Business Tech Park, Sector 62<br>
            Noida, Uttar Pradesh - 201301<br>
            support@yourstore.com | +91 99999 88888
          </div>
        </div>

        <div class="invoice-title-bar">
          <div>
            <div class="invoice-title">Tax Invoice</div>
          </div>
          <div>
            <div class="meta-item">Invoice No: <strong>INV-${orderId.substring(0, 8).toUpperCase()}</strong></div>
            <div class="meta-item">Order ID: <strong>${orderId}</strong></div>
            <div class="meta-item">Date: <strong>${orderDate}</strong></div>
          </div>
        </div>

        <div class="address-section">
          <div class="address-box">
            <h3>Shipping Destination</h3>
            <p style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">${`${targetOrder?.customer?.firstName} ${targetOrder?.customer?.lastName}` || "Guest User"}</p>
            <p>${targetOrder?.shippingAddress?.address || "Address details missing"}</p>
            <p style="margin-top: 6px;"><strong>Phone:</strong> ${targetOrder?.customer?.phone || "N/A"}</p>
            <p style="margin-top: 6px;"><strong>Email:</strong> ${targetOrder?.customer?.email || "N/A"}</p>
            <p><strong>Pincode:</strong> ${targetOrder?.shippingAddress?.pincode || "N/A"}</p>
          </div>
          <div class="address-box">
            <h3>Payment & Logistics Profile</h3>
            <p><strong>Method:</strong> ${targetOrder?.paymentOption || "N/A"}</p>
            <p><strong>Payment Status:</strong> ${targetOrder?.paymentStatus || "PENDING"}</p>
            <p><strong>Fulfillment Queue:</strong> Operational Dashboard</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: left; width: 45%;">Product Description</th>
              <th style="text-align: center; width: 15%;">List Price</th>
              <th style="text-align: center; width: 13%;">Discount</th>
              <th style="text-align: center; width: 12%;">Qty</th>
              <th style="text-align: right; width: 15%;">Net Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="summary-wrapper">
          <div class="summary-table">
            <div class="summary-row">
              <span>Subtotal Amount</span>
              <span>₹ ${(targetOrder?.orderValue || 0).toLocaleString("en-IN")}</span>
            </div>
            <div class="summary-row">
              <span>Shipping & Handling</span>
              <span style="color: #10b981; font-weight: 500;">FREE</span>
            </div>
            <div class="summary-row grand-total">
              <span>Grand Total</span>
              <span>₹ ${(targetOrder?.orderValue || 0).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <div class="invoice-footer">
          <p>Thank you for shopping with us! This is a computer-generated tax invoice, signature not required.</p>
        </div>

        <script>
          window.onload = function() { 
            window.print(); 
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
};