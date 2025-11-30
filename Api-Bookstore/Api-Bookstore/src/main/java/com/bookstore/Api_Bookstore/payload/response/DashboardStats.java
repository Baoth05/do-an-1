package com.bookstore.Api_Bookstore.payload.response;

import lombok.Data;

@Data
public class DashboardStats {
    private Double totalRevenue;    // Tổng doanh thu
    private int totalOrders;        // Tổng số đơn
    private int totalBooksSold;     // Tổng số sách bán ra
    private int totalUsers;         // Tổng số thành viên

    public DashboardStats(Double totalRevenue, int totalOrders, int totalBooksSold, int totalUsers) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.totalBooksSold = totalBooksSold;
        this.totalUsers = totalUsers;
    }
}
