const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ border: "1px solid #ccc", padding: 20 }}>
          <h3>Total Properties</h3>
          <p>2</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: 20 }}>
          <h3>Total Tenants</h3>
          <p>125</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: 20 }}>
          <h3>Vacant Beds</h3>
          <p>15</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
