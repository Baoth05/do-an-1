import React, { useEffect, useState } from 'react';
import OrderService from '../services/OrderService';
import { 
    ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import './AdminDashboard.css'; // Import file CSS đã tách

const AdminDashboard = () => {
    const [stats, setStats] = useState({ 
        totalRevenue: 0, 
        totalOrders: 0, 
        totalBooksSold: 0, 
        totalUsers: 0,
        topSellingBooks: [],
        orderStatusCounts: {}
    });
    
    const [chartData, setChartData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [loading, setLoading] = useState(true);

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4757'];

    useEffect(() => {
        Promise.all([
            OrderService.getDashboardStats(),
            OrderService.getAllOrders()
        ]).then(([statsRes, ordersRes]) => {
            
            const statData = statsRes.data;
            setStats(statData);

            if (statData.orderStatusCounts) {
                const pData = Object.keys(statData.orderStatusCounts).map(key => ({
                    name: key,
                    value: statData.orderStatusCounts[key]
                }));
                setPieData(pData);
            }

            const orders = ordersRes.data || [];
            const monthlyStats = Array.from({ length: 12 }, (_, index) => {
                const date = new Date(0, index);
                return {
                    name: date.toLocaleString('en-US', { month: 'short' }),
                    revenue: 0, cost: 0, profit: 0
                };
            });

            const currentYear = new Date().getFullYear();

            orders.forEach(order => {
                if (order.orderDate) {
                    const dateObj = new Date(order.orderDate);
                    if (dateObj.getFullYear() === currentYear) {
                        const monthIndex = dateObj.getMonth();
                        monthlyStats[monthIndex].revenue += (order.totalAmount || 0);
                    }
                }
            });

            const finalChartData = monthlyStats.map(item => {
                const cost = item.revenue * 0.7;
                const profit = item.revenue - cost;
                return {
                    ...item,
                    cost: Math.round(cost),
                    profit: Math.round(profit)
                };
            });

            setChartData(finalChartData);
            setLoading(false);

        }).catch(err => {
            console.error("Lỗi tải Dashboard:", err);
            setLoading(false);
        });
    }, []);

    // Custom Tooltip (Sử dụng class CSS thay vì style inline)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-header">{`Tháng: ${label}`}</p>
                    <div className="tooltip-row" style={{color: '#ffafcc'}}>
                        <span>■ Lợi nhuận:</span>
                        <b>{payload[0].value.toLocaleString()} đ</b>
                    </div>
                    <div className="tooltip-row" style={{color: '#feca57'}}>
                        <span>● Chi phí:</span>
                        <b>{payload[1].value.toLocaleString()} đ</b>
                    </div>
                    <div className="tooltip-row" style={{color: '#54a0ff'}}>
                        <span>● Doanh thu:</span>
                        <b>{payload[2].value.toLocaleString()} đ</b>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (loading) return <div className="text-center mt-5"><h4>Đang tải dữ liệu thống kê...</h4></div>;

    return (
        <div className="dashboard-container">
            <h3 className="dashboard-title">
                <i className="fas fa-chart-pie me-2"></i> Báo Cáo Kinh Doanh {new Date().getFullYear()}
            </h3>

            {/* --- HÀNG 1: 4 THẺ THÔNG SỐ --- */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="dashboard-card stat-card blue">
                        <h6 className="stat-label">Doanh Thu</h6>
                        <h4 className="stat-value text-primary-custom">
                            {(stats.totalRevenue || 0).toLocaleString()} đ
                        </h4>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card stat-card green">
                        <h6 className="stat-label">Đơn Hàng</h6>
                        <h4 className="stat-value text-success-custom">
                            {stats.totalOrders}
                        </h4>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card stat-card yellow">
                        <h6 className="stat-label">Sách Đã Bán</h6>
                        <h4 className="stat-value text-warning-custom">
                            {stats.totalBooksSold}
                        </h4>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card stat-card red">
                        <h6 className="stat-label">Khách Hàng</h6>
                        <h4 className="stat-value text-danger-custom">
                            {stats.totalUsers}
                        </h4>
                    </div>
                </div>
            </div>

            {/* --- HÀNG 2: BIỂU ĐỒ --- */}
            <div className="row g-4 mb-4">
                {/* Biểu đồ Doanh thu (Trái) */}
                <div className="col-lg-8">
                    <div className="dashboard-card">
                        <div className="chart-header">
                            <h5 className="chart-title">Biểu đồ Tài chính</h5>
                            <span className="chart-note">* Chi phí ước tính: 70% doanh thu</span>
                        </div>
                        <div className="chart-body">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid stroke="#f5f5f5" vertical={true} />
                                    <XAxis dataKey="name" scale="point" padding={{ left: 30, right: 30 }} tick={{fill: '#666'}} />
                                    <YAxis 
                                        tick={{fill: '#666'}} 
                                        tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} 
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="top" height={36}/>
                                    
                                    <Bar dataKey="profit" name="Lợi nhuận" barSize={30} fill="#ffafcc" radius={[4, 4, 0, 0]} />
                                    <Line type="monotone" dataKey="cost" name="Chi phí" stroke="#feca57" strokeWidth={2} dot={{r: 4, fill: '#feca57', strokeWidth: 2, stroke: '#fff'}} />
                                    <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#54a0ff" strokeWidth={3} dot={{r: 5, fill: '#54a0ff', strokeWidth: 2, stroke: '#fff'}} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Biểu đồ Tròn (Phải) */}
                <div className="col-lg-4">
                    <div className="dashboard-card">
                        <div className="chart-header">
                            <h5 className="chart-title">Tỷ lệ Đơn hàng</h5>
                        </div>
                        <div className="chart-body d-flex justify-content-center align-items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData.length > 0 ? pieData : [{name: 'Chưa có đơn', value: 1}]}
                                        cx="50%" cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- HÀNG 3: BẢNG TOP SÁCH --- */}
            <div className="row">
                <div className="col-12">
                    <div className="dashboard-card table-container">
                        <div className="chart-header">
                            <h5 className="chart-title">🔥 Top 5 Sách Bán Chạy Nhất</h5>
                        </div>
                        <div className="p-3">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{width: '60px', textAlign: 'center'}}>#</th>
                                        <th>Tên Sách</th>
                                        <th className="text-center">Đã bán</th>
                                        <th className="text-end">Doanh thu</th>
                                        <th className="text-center">Đánh giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.topSellingBooks && stats.topSellingBooks.length > 0 ? (
                                        stats.topSellingBooks.map((book, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className={`rank-badge ${index === 0 ? 'rank-1' : 'rank-other'}`}>
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td className="fw-bold text-dark">{book.title}</td>
                                                <td className="text-center fw-bold fs-5">{book.soldQuantity}</td>
                                                <td className="text-end text-success fw-bold">
                                                    {book.totalRevenue.toLocaleString()} đ
                                                </td>
                                                <td className="text-center">
                                                    {book.soldQuantity > 5 ? 
                                                        <span className="status-hot">HOT TREND</span> : 
                                                        <span className="status-stable">Ổn định</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="text-center py-4 text-muted">Chưa có dữ liệu bán hàng</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;