
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const TenantDetails = () => {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const { data } = await api.get(`/tenants/${id}`);
        setTenant(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTenant();
  }, [id]);

  if (!tenant) return <p>Loading...</p>;

  return (
    <div>
      <BackButton />
      <h1>Tenant Details</h1>

      <p><strong>Name:</strong> {tenant.name}</p>
      <p><strong>Phone:</strong> {tenant.phone}</p>
      <p><strong>Email:</strong> {tenant.email}</p>
      <p><strong>Property:</strong> {tenant.property?.name || "N/A"}</p>
      <p><strong>Room / Bed:</strong> {tenant.room?.number || "?"} / {tenant.bed?.number || "?"}</p>
      <p><strong>Status:</strong> {tenant.status}</p>
      <p><strong>Joining Date:</strong> {new Date(tenant.joiningDate).toLocaleDateString()}</p>

      <h3>Payments</h3>
      <p>Monthly Rent: ₹{tenant.rentAmount}</p>
      <p>Deposit: ₹{tenant.depositAmount}</p>
    </div>
  );
};

export default TenantDetails;
