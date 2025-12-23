import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { ArrowLeft, Download } from "lucide-react";

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
    const printWindow = window.open('', '', 'width=800,height=600');

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice._id.slice(-6).toUpperCase()}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
          .header h1 { font-size: 24px; font-weight: bold; }
          .print-btn { padding: 8px 16px; border: 1px solid #666; background: white; cursor: pointer; border-radius: 4px; }
          .invoice-details { margin-bottom: 30px; }
          .invoice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
          .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
          .info-line { margin-bottom: 5px; font-size: 13px; line-height: 1.6; }
          .label { font-weight: 600; display: inline-block; min-width: 140px; }
          .status-badge { display: inline-block; padding: 4px 12px; background: #ff9800; color: white; border-radius: 4px; font-size: 12px; }
          .divider { border-top: 2px solid #333; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #f5f5f5; padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: 600; }
          td { padding: 12px; border: 1px solid #ddd; }
          .totals { margin-top: 20px; }
          .totals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .total-row.final { font-weight: bold; font-size: 16px; border-top: 2px solid #333; padding-top: 12px; margin-top: 8px; }
          .payment-details { font-size: 13px; line-height: 1.8; }
          .terms { margin-top: 30px; font-size: 11px; line-height: 1.6; }
          .footer { margin-top: 40px; text-align: right; }
          @media print {
            .print-btn { display: none; }
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PG Invoice Template</h1>
          <button class="print-btn" onclick="window.print()">Print/ Save as PDF</button>
        </div>

        <div class="invoice-grid">
          <div>
            <div class="section-title">Invoice</div>
            <div class="info-line">GullyPG</div>
            <div class="info-line">#257, 3rd Floor, Street Address,</div>
            <div class="info-line">City, State - Pincode</div>
            <div class="info-line">Phone: +91-9876543210</div>
            <div class="info-line">Email: billing@yourpg.com</div>
          </div>
          <div style="text-align: right;">
            <div class="info-line"><span class="label">Invoice No:</span> INV-${invoice._id.slice(-6).toUpperCase()}</div>
            <div class="info-line"><span class="label">Invoice Date:</span> ${new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div class="info-line"><span class="label">Billing Period:</span> ${invoice.month} ${invoice.year}</div>
            <div class="info-line"><span class="label">Payment Status:</span> <span class="status-badge">${invoice.status}</span></div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="invoice-grid">
          <div>
            <div class="section-title">Bill To (Tenant)</div>
            <div class="info-line"><strong>${invoice.tenant?.name || 'N/A'}</strong></div>
            <div class="info-line">Mobile: ${invoice.tenant?.phone || 'N/A'}</div>
            <div class="info-line">Email: ${invoice.tenant?.email || 'N/A'}</div>
            <div class="info-line">ID Proof: Aadhaar / PAN - XXXX1234X</div>
          </div>
          <div>
            <div class="section-title">Property & Room Details</div>
            <div class="info-line">Property: ${invoice.property?.name || 'N/A'}</div>
            <div class="info-line">Building: ${invoice.tenant?.block?.name || 'N/A'}, Floor: ${invoice.tenant?.floor?.name || 'N/A'}</div>
            <div class="info-line">Room No: ${invoice.tenant?.room?.number || 'N/A'}, Bed No: ${invoice.tenant?.bed?.number || 'N/A'}</div>
            <div class="info-line">Occupancy Type: ${invoice.tenant?.room?.type || 'N/A'}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50px;">#</th>
              <th>Description</th>
              <th style="width: 80px;">Qty</th>
              <th style="width: 120px;">Rate (₹)</th>
              <th style="width: 120px;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.description}</td>
                <td>1</td>
                <td>${item.amount.toLocaleString('en-IN')}</td>
                <td>${item.amount.toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-grid">
            <div class="payment-details">
              <div class="section-title">Payment Details</div>
              <div>Bank Name: Axis Bank</div>
              <div>Account Name: GullyPG</div>
              <div>Account No: 123456789012</div>
              <div>IFSC: ABCD0123456</div>
              <div>UPI ID: yourpg@upi</div>
            </div>
            <div>
              <div class="total-row">
                <span>Subtotal (₹):</span>
                <span>${invoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div class="total-row">
                <span>CGST @ 9% (₹):</span>
                <span>0.00</span>
              </div>
              <div class="total-row">
                <span>SGST @ 9% (₹):</span>
                <span>0.00</span>
              </div>
              <div class="total-row final">
                <span>Total Payable (₹):</span>
                <span>${invoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div class="total-row" style="font-size: 12px; margin-top: 10px;">
                <span>Amount in Words:</span>
              </div>
              <div style="font-size: 12px; font-style: italic; text-align: right;">
                ${numberToWords(invoice.totalAmount)} Rupees Only
              </div>
              <div class="total-row" style="margin-top: 15px;">
                <span>Due Date:</span>
                <span>${new Date(new Date(invoice.createdAt).setDate(new Date(invoice.createdAt).getDate() + 5)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="terms">
          <div class="section-title">Terms & Conditions</div>
          <div>1. This is a system-generated invoice and does not require a physical signature.</div>
          <div>2. Payments once made are non-refundable as per PG policy.</div>
          <div>3. Please share payment confirmation via WhatsApp or Email after transfer.</div>
        </div>

        <div class="footer">
          <div style="font-weight: bold;">GullyPG</div>
          <div style="font-size: 12px; color: #666;">Authorised Signatory</div>
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
      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={16} /> Back
      </button>

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
