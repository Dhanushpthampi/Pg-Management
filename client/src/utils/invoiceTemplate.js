// src/utils/invoiceTemplate.js

export const generateInvoiceHTML = (invoice) => {
  const subtotal = invoice.subtotal || invoice.totalAmount;
  const cgst = invoice.cgst || subtotal * 0.09;
  const sgst = invoice.sgst || subtotal * 0.09;
  const total = subtotal + cgst + sgst;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convert = (n) => {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore';
    };

    return convert(Math.floor(num));
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 30px 40px;
      color: #222;
    }
    .container {
      max-width: 900px;
      margin: auto;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .top h2 {
      margin: 0;
      font-size: 20px;
    }
    .print-btn {
      padding: 6px 12px;
      border: 1px solid #999;
      background: #f5f5f5;
      cursor: pointer;
      font-size: 12px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      font-size: 13px;
      margin-bottom: 15px;
    }
    .info-grid strong {
      display: inline-block;
      width: 120px;
    }
    .status {
      display: inline-block;
      padding: 4px 10px;
      font-size: 11px;
      border-radius: 4px;
      background: ${invoice.status === "Paid" ? "#4caf50" : "#ff9800"};
      color: #fff;
    }
    hr {
      border: none;
      border-top: 2px solid #444;
      margin: 20px 0;
    }
    .section-title {
      font-weight: bold;
      margin-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 10px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
    }
    th {
      background: #f0f0f0;
      text-align: left;
    }
    td:nth-child(1) {
      text-align: center;
      width: 40px;
    }
    td:nth-child(3),
    td:nth-child(4),
    td:nth-child(5),
    th:nth-child(3),
    th:nth-child(4),
    th:nth-child(5) {
      text-align: right;
    }
    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 20px;
      font-size: 13px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .total-row.final {
      font-weight: bold;
      font-size: 15px;
    }
    .terms {
      font-size: 11px;
      margin-top: 25px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 35px;
      font-size: 12px;
    }
    @media print {
      .print-btn { display: none; }
    }
  </style>
</head>

<body onload="window.print()">
<div class="container">

  <div class="top">
    <h2>PG Invoice Template</h2>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="info-grid">
    <div>
      <div class="section-title">Invoice</div>
      <div>GullyPG</div>
      <div>#257, 3rd Floor, Street Address</div>
      <div>City, State - Pincode</div>
      <div>Phone: +91-9876543210</div>
      <div>Email: billing@yourpg.com</div>
    </div>
    <div>
      <div><strong>Invoice No:</strong> INV-${invoice._id.slice(-6).toUpperCase()}</div>
      <div><strong>Invoice Date:</strong> ${formatDate(invoice.createdAt)}</div>
      <div><strong>Billing Period:</strong> ${invoice.month} ${invoice.year}</div>
      <div><strong>Payment Status:</strong> <span class="status">${invoice.status}</span></div>
    </div>
  </div>

  <hr/>

  <div class="info-grid">
    <div>
      <div class="section-title">Bill To (Tenant)</div>
      <div>Tenant Name: ${invoice.tenant?.name}</div>
      <div>Mobile: ${invoice.tenant?.phone}</div>
      <div>Email: ${invoice.tenant?.email || "N/A"}</div>
      <div>ID Proof: Aadhaar / PAN</div>
    </div>
    <div>
      <div class="section-title">Property & Room Details</div>
      <div>Property: ${invoice.property?.name}</div>
      <div>Building: ${invoice.tenant?.block?.name}, Floor: ${invoice.tenant?.floor?.name}</div>
      <div>Room No: ${invoice.tenant?.room?.number}, Bed No: ${invoice.tenant?.bed?.number}</div>
      <div>Occupancy Type: ${invoice.tenant?.room?.type}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th>Qty</th>
        <th>Rate (₹)</th>
        <th>Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${item.description}</td>
          <td>1</td>
          <td>${item.amount.toFixed(2)}</td>
          <td>${item.amount.toFixed(2)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="bottom-grid">
    <div>
      <div class="section-title">Payment Details</div>
      <div>Bank Name: Axis Bank</div>
      <div>Account Name: GullyPG</div>
      <div>Account No: 123456789012</div>
      <div>IFSC: ABCD0123456</div>
      <div>UPI ID: yourpg@upi</div>
    </div>
    <div>
      <div class="total-row"><span>Subtotal (₹):</span><span>${subtotal.toFixed(2)}</span></div>
      <div class="total-row"><span>CGST @ 9% (₹):</span><span>${cgst.toFixed(2)}</span></div>
      <div class="total-row"><span>SGST @ 9% (₹):</span><span>${sgst.toFixed(2)}</span></div>
      <div class="total-row final"><span>Total Payable (₹):</span><span>${total.toFixed(2)}</span></div>
      <div style="margin-top:8px;font-size:12px;">
        <strong>Amount in Words:</strong><br/>
        ${numberToWords(total)} Rupees Only
      </div>
      <div style="margin-top:10px;">
        <strong>Due Date:</strong> ${formatDate(invoice.dueDate || invoice.createdAt)}
      </div>
    </div>
  </div>

  <div class="terms">
    <strong>Terms & Conditions</strong><br/>
    1. This is a system-generated invoice and does not require a physical signature.<br/>
    2. Payments once made are non-refundable as per PG policy.<br/>
    3. Please share payment confirmation via WhatsApp or email after transfer.
  </div>

  <div class="footer">
    <div></div>
    <div style="text-align:right">
      <strong>GullyPG</strong><br/>
      Authorised Signatory
    </div>
  </div>

</div>
</body>
</html>
`;
};
