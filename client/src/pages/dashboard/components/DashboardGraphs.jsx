import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import PropTypes from 'prop-types';

const DashboardGraphs = ({ data }) => {
    const { revenue = [], bookings = [], complaints = [], occupancy = [] } = data || {};

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>

            {/* Revenue Trend */}
            <div className="graph-card">
                <h3>Revenue Trend (Last 6 Months)</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={revenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value}`} />
                            <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                            <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Booking Trend */}
            <div className="graph-card">
                <h3>Booking Trend (Last 6 Months)</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={bookings}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="bookings" fill="#82ca9d" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Complaint Status */}
            <div className="graph-card">
                <h3>Complaint Status</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={complaints}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {complaints.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Occupancy Status */}
            <div className="graph-card">
                <h3>Occupancy Status</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={occupancy}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {occupancy.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <style>{`
        .graph-card {
           background: white;
           padding: 24px;
           border-radius: var(--radius);
           border: 1px solid var(--border-color);
           box-shadow: var(--shadow-sm);
        }
        .graph-card h3 {
            margin-bottom: 20px;
            font-size: 18px;
            color: var(--primary);
        }
      `}</style>
        </div>
    );
};

DashboardGraphs.propTypes = {
    data: PropTypes.shape({
        revenue: PropTypes.array,
        bookings: PropTypes.array,
        complaints: PropTypes.array,
        occupancy: PropTypes.array
    })
};

export default DashboardGraphs;
