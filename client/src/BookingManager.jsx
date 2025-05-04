import React, { useState, useEffect } from "react";
import bg from "./assets/Mainpage.jpg";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';

export default function BookingManager() {
  const [bookedData, setBookedData] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchBooked = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        if (!userInfo?.mssv) {
          toast.error("Không tìm thấy thông tin người dùng");
          return;
        }

        const res = await fetch(
          `http://localhost:8080/api/v1/bookings/student/${userInfo.mssv}`
        );

        if (!res.ok) {
          toast.error("Không thể tải dữ liệu đặt chỗ");
          return;
        }

        const respond = await res.json();
        setBookedData(respond.DT || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        toast.error("Lỗi khi tải dữ liệu đặt chỗ");
      }
    };

    fetchBooked();
  }, [navigate]);

  const handleCancel = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/booking/${bookingId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Đã hủy đặt chỗ thành công.");
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        const updatedRes = await fetch(
          `http://localhost:8080/api/v1/bookings/student/${userInfo.mssv}`
        );
        const updatedData = await updatedRes.json();
        setBookedData(updatedData.DT || []);
      } else {
        toast.error(data?.EM || "Hủy đặt chỗ thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đặt chỗ:", error);
      toast.error("Đã xảy ra lỗi khi hủy đặt chỗ.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    navigate("/");
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  return (
    <div
      className="min-h-screen flex flex-col" // Thêm 'flex flex-col'
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <div className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg p-4 relative z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-2xl font-bold">Smart Study Space Management</h1>
            <p className="text-sm">HCMUT Reservation System</p>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/main" className="text-white hover:text-blue-300 transition">Trang chủ</Link>
            <Link to="/finding-room" className="text-white hover:text-blue-300 transition">Tìm chỗ</Link>
            <Link to="/booking-manager" className="bg-blue-500/80 text-white px-4 py-2 rounded-lg hover:bg-blue-600/80 transition">Quản lý đặt chỗ</Link>
            <Link to="/FeedbackForm" className="text-white hover:text-blue-300 transition">Đánh giá</Link>
            <Link to="/support" className="text-white hover:text-blue-300 transition">Hỗ trợ</Link>

            {/* User Menu with fixed positioning */}
            <div className="user-menu-container relative">
              <button
                onClick={toggleUserMenu}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
              >
                <i className="fas fa-user"></i>
              </button>

              {showUserMenu && (
                <div
                  className="fixed right-4 mt-2 w-48 backdrop-blur-md bg-white/90 border border-white/30 rounded-lg shadow-2xl py-2"
                  style={{ zIndex: 9999 }}
                >
                  <Link
                    to="/UserProfile"
                    className="block px-4 py-2 text-gray-800 hover:bg-white/40 transition"
                  >
                    Hồ sơ
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-white/40 transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Manager */}
      <div className="container mx-auto my-8 px-4 relative z-10 flex-grow">
        <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Quản lý đặt chỗ</h2>

          {/* Table Container with scrollable area */}
          <div className="overflow-hidden rounded-lg">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-500/90 text-white">
                    <th className="px-6 py-3 text-left font-semibold">Thời điểm</th>
                    <th className="px-6 py-3 text-left font-semibold">Tên phòng</th>
                    <th className="px-6 py-3 text-left font-semibold">Giờ bắt đầu</th>
                    <th className="px-6 py-3 text-left font-semibold">Trạng thái</th>
                    <th className="px-6 py-3 text-left font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedData.filter((booking) => booking.status === "Confirmed"||booking.status === "CheckedIn").length > 0 ? (
                    bookedData
                      .filter((booking) => booking.status === "Confirmed"||booking.status === "CheckedIn")
                      .map((booking, index) => {
                        const date = new Date(booking.Day);
                        const formattedDate = date.toLocaleDateString("vi-VN");
                        return (
                          <tr
                            key={index}
                            className={`backdrop-blur-md ${index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'} border-b border-gray-200/30`}
                          >
                            <td className="px-6 py-4 text-white">{formattedDate}</td>
                            <td className="px-6 py-4 text-white">{booking.room_name}</td>
                            <td className="px-6 py-4 text-white">{booking.start_time}</td>
                            <td className="px-6 py-4 text-white">{booking.status}</td>
                            <td className="px-6 py-4">
                              <button
                                className="bg-blue-500/80 hover:bg-blue-600/80 text-white py-2 px-4 rounded-lg mr-2 transition"
                                onClick={() => navigate(`/room-details/${booking.booking_id}`)}
                              >
                                Chỉnh sửa
                              </button>
                              <button
                                className="bg-red-500/80 hover:bg-red-600/80 text-white py-2 px-4 mr-2 rounded-lg transition"
                                onClick={() => handleCancel(booking.booking_id)}
                              >
                                Hủy
                              </button>
                              <button
                                className="bg-green-500/80 hover:bg-green-600/80 text-white py-2 px-4 rounded-lg transition"
                                onClick={() => navigate(`/current-room/${booking.booking_id}`)}
                              >
                                Quản lý
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-white text-lg">
                        Không có đặt chỗ đã xác nhận nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* History section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-white">Lịch sử đặt chỗ</h3>
            <div className="overflow-hidden rounded-lg">
              <div className="overflow-x-auto max-h-64">
                <table className="w-full">
                  <thead>
                    <tr className="bg-purple-500/90 text-white">
                      <th className="px-6 py-3 text-left font-semibold">Thời điểm</th>
                      <th className="px-6 py-3 text-left font-semibold">Tên phòng</th>
                      <th className="px-6 py-3 text-left font-semibold">Giờ bắt đầu</th>
                      <th className="px-6 py-3 text-left font-semibold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookedData.filter((booking) => booking.status !== "Confirmed").length > 0 ? (
                      bookedData
                        .filter((booking) => booking.status !== "Confirmed")
                        .map((booking, index) => {
                          const date = new Date(booking.Day);
                          const formattedDate = date.toLocaleDateString("vi-VN");
                          return (
                            <tr
                              key={index}
                              className={`backdrop-blur-md ${index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'} border-b border-gray-200/30`}
                            >
                              <td className="px-6 py-4 text-white">{formattedDate}</td>
                              <td className="px-6 py-4 text-white">{booking.room_name}</td>
                              <td className="px-6 py-4 text-white">{booking.start_time}</td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm ${
                                    booking.status === "Canceled"
                                      ? "bg-red-400/70 text-red-900"
                                      : booking.status === "Completed"
                                      ? "bg-green-400/70 text-green-900"
                                      : "bg-yellow-400/70 text-yellow-900"
                                  }`}
                                >
                                  {booking.status === "Canceled"
                                    ? "Đã hủy"
                                    : booking.status === "Completed"
                                    ? "Hoàn thành"
                                    : booking.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-white text-lg">
                          Không có lịch sử đặt chỗ nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-gray-800/70 border-t border-white/10 text-white py-6 mt-auto relative z-10"> {/* Thêm 'mt-auto' */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
              <p className="text-sm text-gray-300">Email: ddthu@hcmut.edu.vn</p>
              <p className="text-sm text-gray-300">ĐT (Tel.): (84-8) 38647256 - 5258</p>
              <p className="text-sm text-gray-300">
                Quý Thầy/Cô chưa có tài khoản(hoặc quên mật khẩu) nhà trường vui lòng
                liên hệ Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5 để được
                hỗ trợ.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hỗ trợ kỹ thuật</h4>
              <p className="text-sm text-gray-300">Trung tâm Dữ liệu & Công nghệ Thông tin</p>
              <p className="text-sm text-gray-300">Email: dl-cntt@hcmut.edu.vn</p>
              <p className="text-sm text-gray-300">ĐT (Tel.): (84-8) 38647256 - 5200</p>
              <p className="text-sm text-gray-300">
                (For HCMUT account, please contact to : Data and Information
                Technology Center)
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}