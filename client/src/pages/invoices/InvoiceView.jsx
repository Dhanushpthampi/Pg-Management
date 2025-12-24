import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { Download } from "lucide-react";
import BackButton from "../../components/BackButton";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await api.get(`/invoices/${id}`);
        setInvoice(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleDownload = () => {
    const printWindow = window.open('', '', 'width=900,height=800');

    // Calculate tax amounts
    const subtotal = invoice.subtotal || invoice.totalAmount;
    const cgst = invoice.cgst || (subtotal * 0.09);
    const sgst = invoice.sgst || (subtotal * 0.09);
    const totalWithTax = subtotal + cgst + sgst;

    // Format billing period
    const formatBillingPeriod = () => {
      if (invoice.billingPeriodStart && invoice.billingPeriodEnd) {
        const start = new Date(invoice.billingPeriodStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const end = new Date(invoice.billingPeriodEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        return `${start} - ${end}`;
      }
      return `${invoice.month} ${invoice.year}`;
    };

    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoice._id.slice(-6).toUpperCase()}</title>
  <style>
    body {
      font-family: 'Inter', Arial, sans-serif;
      color: #1f2937;
      margin: 0;
      padding: 32px;
      background: #ffffff;
    }

    .invoice-wrapper {
      max-width: 900px;
      margin: auto;
    }

    /* Header */
    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .brand h1 {
      margin: 0;
      font-size: 26px;
      color: #2563eb;
    }

    .brand p {
      font-size: 12px;
      line-height: 1.6;
      margin: 2px 0;
    }

    .invoice-meta {
      text-align: right;
      font-size: 13px;
    }

    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 6px;
      background: ${invoice.status === 'Paid' ? '#16a34a' : '#f59e0b'};
      color: #fff;
    }

    /* Section */
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 10px;
      text-transform: uppercase;
      color: #374151;
    }

    .info-line {
      font-size: 13px;
      margin-bottom: 6px;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 13px;
    }

    th {
      background: #f3f4f6;
      padding: 12px;
      text-align: left;
      border-bottom: 2px solid #e5e7eb;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }

    th:last-child, td:last-child {
      text-align: right;
    }

    /* Totals */
    .totals {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
    }

    .totals-box {
      width: 360px;
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
    }

    .total-row.final {
      font-size: 18px;
      font-weight: 700;
      border-top: 2px solid #111827;
      padding-top: 12px;
      margin-top: 12px;
    }

    .amount-words {
      font-size: 12px;
      margin-top: 8px;
      font-style: italic;
      color: #374151;
    }

    /* Footer */
    .footer {
      margin-top: 36px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #374151;
    }

    .terms {
      max-width: 60%;
      line-height: 1.6;
    }

    @media print {
      body {
        padding: 16px;
      }
      .print-btn {
        display: none;
      }
    }
  </style>
</head>

<body>
<div class="invoice-wrapper">

  <div class="top-header">
    <div class="brand">
      <h1>GullyPG Pvt Ltd</h1>
      <p>GSTIN: 29ABCDE1234F1Z5</p>
      <p>#257, 3rd Floor, Bengaluru, KA</p>
      <p>billing@gullypg.com | +91 98765 43210</p>
    </div>

    <div class="invoice-meta">
      <div><strong>Invoice No:</strong> INV-${invoice._id.slice(-6).toUpperCase()}</div>
      <div><strong>Invoice Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString('en-GB')}</div>
      <div><strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-GB') : '-'}</div>
      <div class="badge">${invoice.status}</div>
    </div>
  </div>

  <div class="grid">
    <div>
      <div class="section-title">Bill To</div>
      <div class="info-line"><strong>${invoice.tenant?.name}</strong></div>
      <div class="info-line">Phone: ${invoice.tenant?.phone}</div>
      <div class="info-line">Email: ${invoice.tenant?.email || 'N/A'}</div>
    </div>

    <div>
      <div class="section-title">Property Details</div>
      <div class="info-line">Property: ${invoice.property?.name}</div>
      <div class="info-line">Room: ${invoice.tenant?.room?.number} / Bed: ${invoice.tenant?.bed?.number}</div>
      <div class="info-line">Occupancy: ${invoice.tenant?.room?.type}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th>Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${item.description}</td>
          <td>${item.amount.toLocaleString('en-IN')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-box">
      <div class="total-row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
      <div class="total-row"><span>CGST (9%)</span><span>₹${cgst.toFixed(2)}</span></div>
      <div class="total-row"><span>SGST (9%)</span><span>₹${sgst.toFixed(2)}</span></div>
      <div class="total-row final"><span>Total Payable</span><span>₹${totalWithTax.toFixed(2)}</span></div>
      <div class="amount-words">${numberToWords(Math.round(totalWithTax))} Rupees Only</div>
    </div>
  </div>

  <div class="footer">
    <div class="terms">
      <strong>Terms:</strong><br/>
      Payment due within 10 days. Late fee applicable thereafter.<br/>
      This is a system generated invoice.
    </div>
    <div style="text-align:right;">
      <strong>For GullyPG</strong><br/><br/>
      Authorised Signatory
    </div>
  </div>

</div>
</body>
</html>
`;


    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  // Helper function to convert number to words
  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';

    const convert = (n) => {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };

    return convert(Math.floor(num));
  };

  if (!invoice) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <BackButton />

      <PageHeader
        title={`Invoice #${invoice._id.slice(-6).toUpperCase()}`}
        action={
          <button className="btn btn-primary" onClick={handleDownload}>
            <Download size={18} /> Download / Print
          </button>
        }
      />

      <div className="invoice-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30, paddingBottom: 20, borderBottom: '1px solid #eee' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 4 }}>To</div>
            <div style={{ fontWeight: 600, fontSize: 18 }}>{invoice.tenant?.name || "Unknown Tenant"}</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{invoice.property?.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 4 }}>Status</div>
            <span className={`badge ${invoice.status === 'paid' ? 'success' : 'warning'}`}>
              {invoice.status}
            </span>
            <div style={{ fontSize: 13, color: 'var(--secondary)', marginTop: 8 }}>Period</div>
            <div style={{ fontWeight: 500 }}>{invoice.month} {invoice.year}</div>
          </div>
        </div>

        <table style={{ width: '100%', marginBottom: 30 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ textAlign: 'left', padding: '12px', fontSize: 13, color: 'var(--secondary)' }}>Description</th>
              <th style={{ textAlign: 'right', padding: '12px', fontSize: 13, color: 'var(--secondary)' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{item.description}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 500 }}>₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #eee', paddingTop: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, color: 'var(--secondary)', marginBottom: 5 }}>Total Amount</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>₹{invoice.totalAmount}</div>
          </div>
        </div>
      </div>

      <style>{`
        .invoice-card {
           background: white;
           padding: 40px;
           border-radius: var(--radius);
           border: 1px solid var(--border-color);
           box-shadow: var(--shadow-sm);
        }
        table { border-collapse: collapse; }
      `}</style>
    </div>
  );
};

export default InvoiceView;
