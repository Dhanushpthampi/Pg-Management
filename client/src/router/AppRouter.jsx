import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Properties from "../pages/Properties";
import AddProperty from "../pages/AddProperty";
import Tenants from "../pages/Tenants";
import TenantDetails from "../pages/TenantDetails";
import CheckIn from "../pages/CheckIn";
import Bookings from "../pages/Bookings";
import Staff from "../pages/Staff";
import Complaints from "../pages/Complaints";
import Invoices from "../pages/Invoices";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/new" element={<AddProperty />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/tenants/:id" element={<TenantDetails />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/invoices" element={<Invoices />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
