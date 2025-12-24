import mongoose from 'mongoose';
import Invoice from './src/models/Invoice.js';
import dotenv from 'dotenv';

dotenv.config();

const updateInvoicesToPaid = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Update all pending invoices to paid
        const result = await Invoice.updateMany(
            { status: 'pending' },
            {
                $set: {
                    status: 'paid',
                    paidDate: new Date()
                }
            }
        );

        console.log(`✅ Updated ${result.modifiedCount} invoices from pending to paid`);

        // Show summary
        const totalInvoices = await Invoice.countDocuments();
        const paidInvoices = await Invoice.countDocuments({ status: 'paid' });
        const pendingInvoices = await Invoice.countDocuments({ status: 'pending' });

        console.log('\n📊 Invoice Status Summary:');
        console.log(`Total Invoices: ${totalInvoices}`);
        console.log(`Paid: ${paidInvoices}`);
        console.log(`Pending: ${pendingInvoices}`);

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

updateInvoicesToPaid();
