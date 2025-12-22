import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import Properties from "../pages/properties/Properties";
import AddProperty from "../pages/properties/AddProperty";
import EditProperty from "../pages/properties/EditProperty";
import BedStructure from "../pages/properties/BedStructure";
import ManageHierarchy from "../pages/properties/ManageHierarchy";
import Tenants from "../pages/tenants/Tenants";
import TenantDetails from "../pages/tenants/TenantDetails";
import Checkout from "../pages/tenants/Checkout";
import ProcessCheckout from "../pages/tenants/ProcessCheckout";
import RaiseNotice from "../pages/tenants/RaiseNotice";
import CheckIn from "../pages/bookings/CheckIn";
import Bookings from "../pages/bookings/Bookings";
import NewBooking from "../pages/bookings/NewBooking";
import Staff from "../pages/staff/Staff";
import AddStaff from "../pages/staff/AddStaff";
import EditStaff from "../pages/staff/EditStaff";
import Complaints from "../pages/complaints/Complaints";
import NewComplaint from "../pages/complaints/NewComplaint";
import ComplaintDetails from "../pages/complaints/ComplaintDetails";
import Invoices from "../pages/invoices/Invoices";
import NewInvoice from "../pages/invoices/NewInvoice";
import InvoiceView from "../pages/invoices/InvoiceView";


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />

                    <Route path="/properties" element={<Properties />} />
                    <Route path="/properties/new" element={<AddProperty />} />
                    <Route path="/properties/:id/edit" element={<EditProperty />} />
                    <Route path="/properties/:id/beds" element={<BedStructure />} />
                    <Route path="/properties/:id/hierarchy" element={<ManageHierarchy />} />

                    <Route path="/tenants" element={<Tenants />} />
                    <Route path="/tenants/:id" element={<TenantDetails />} />
                    <Route path="/checkin" element={<CheckIn />} />

                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/bookings/new" element={<NewBooking />} />

                    <Route path="/staff" element={<Staff />} />
                    <Route path="/staff/new" element={<AddStaff />} />
                    <Route path="/staff/:id/edit" element={<EditStaff />} />

                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/:id/process" element={<ProcessCheckout />} />
                    <Route path="/notice/:id" element={<RaiseNotice />} />

                    <Route path="/complaints" element={<Complaints />} />
                    <Route path="/complaints/new" element={<NewComplaint />} />
                    <Route path="/complaints/:id" element={<ComplaintDetails />} />

                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/invoices/new" element={<NewInvoice />} />
                    <Route path="/invoices/:id" element={<InvoiceView />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
