// src/controller/adminController.js (Hoặc controller xử lý trang dashboard)
import statisticsService from '../service/statisticsService'; 

const showAdminDashboard = async (req, res) => {
    try {
        const stats = await statisticsService.getDashboardStats();

        res.render('admin/dashboard', {
            title: 'Admin Dashboard', 
            stats: stats             
        });

    } catch (error) {
        console.error("Error loading admin dashboard:", error);
        res.status(500).send("Lỗi tải trang quản trị.");
    }
};

module.exports = {
    showAdminDashboard
};