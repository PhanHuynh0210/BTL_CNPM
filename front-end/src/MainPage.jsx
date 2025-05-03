import React, { useEffect, useState } from "react";
import bg from "./assets/Mainpage.jpg";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function RoomBox({ data, onBookingSuccess }) {
  const handleBookNow = async () => {
    const token = localStorage.getItem("access_token");
    const student_info = JSON.parse(localStorage.getItem("user_info"));
    if (!token || !student_info) {
      toast.error("Bạn cần đăng nhập để đặt chỗ.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/booking/book-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          roomId: data.room_id
        }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Đặt chỗ thành công!");
        onBookingSuccess(); // Refresh room data after successful booking
      } else {
        toast.error(`Lỗi: ${result.message || "Không thể đặt chỗ"}`);
      }
    } catch (err) {
      console.error("Đặt chỗ thất bại:", err.message);
      toast.error("Đặt chỗ thất bại.");
    }
  };

  if (!data) return null;
  return (
    <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Phòng {data.location}
          </h3>
          <p className="text-gray-200">Tầng {data.location?.[0]}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            data.room_status === "Available"
              ? "bg-green-400/70 text-green-900"
              : data.room_status === "Occupied"
              ? "bg-red-400/70 text-red-900"
              : "bg-yellow-400/70 text-yellow-900"
          }`}
        >
          {data.room_status === "Available"
            ? "Trống"
            : data.room_status === "Occupied"
            ? "Đã đầy"
            : "Bảo trì"}
        </span>
      </div>
      <div className="space-y-2 mb-4 text-white">
        <p><span className="font-medium">Loại:</span> {data.room_type === "group" ? "Nhóm" : "Đơn"}</p>
        <p><span className="font-medium">Còn trống:</span> {data.available_seats || 0} vị trí</p>
        <p><span className="font-medium">Thiết bị:</span> {data.devices || "Không có"}</p>
      </div>
      <div className="flex space-x-3">
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            data.room_status === "Available"
              ? "bg-blue-500/80 hover:bg-blue-600/80 text-white"
              : "bg-gray-400/50 text-gray-300 cursor-not-allowed"
          }`}
          onClick={handleBookNow}
          disabled={data.room_status !== "Available"}
        >
          Đặt chỗ ngay
        </button>
      </div>
    </div>
  );
}

export default function MainPage() {
  const [roomData, setRoomData] = useState([]);
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

  const fetchRoomData = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/available");
      const respond = await res.json();
      if (res.ok) {
        setRoomData(respond.data || []);
      } else {
        toast.error("Không thể tải dữ liệu phòng");
      }
    } catch (error) {
      console.error("Error fetching room data:", error.message);
      toast.error("Lỗi khi tải dữ liệu phòng");
    }
  };

  const fetchBookedData = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      if (!userInfo?.mssv) {
        console.log("No user info found");
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/v1/bookings/student/${userInfo.mssv}`
      );

      if (res.ok) {
        const respond = await res.json();
        setBookedData(respond.DT || []);
      } else {
        toast.error("Không thể tải dữ liệu đặt phòng");
      }
    } catch (error) {
      console.error("Error fetching booked data:", error.message);
      toast.error("Lỗi khi tải dữ liệu đặt phòng");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchRoomData();
    fetchBookedData();
  }, [navigate]);

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
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Main content */}
      <div className="relative z-10 flex-grow">
        {/* Header */}
        <div className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg p-4 relative z-20">
          <div className="container mx-auto flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-2xl font-bold">Smart Study Space Management</h1>
              <p className="text-sm">HCMUT Reservation System</p>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/main" className="bg-blue-500/80 text-white px-4 py-2 rounded-lg hover:bg-blue-600/80 transition">Trang chủ</Link>
              <Link to="/finding-room" className="text-white hover:text-blue-300 transition">Tìm chỗ</Link>
              <Link to="/booking-manager" className="text-white hover:text-blue-300 transition">Quản lý đặt chỗ</Link>
              <Link to="/FeedbackForm" className="text-white hover:text-blue-300 transition">Đánh giá</Link>
              <Link to="/SupportForm" className="text-white hover:text-blue-300 transition">Hỗ trợ</Link>
              
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

        {/* Dashboard Stats */}
        <div className="container mx-auto mt-8 px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Available Rooms Card */}
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">Phòng trống</h3>
              <p className="text-3xl font-bold text-blue-400">
                {roomData.filter((r) => r.room_status === "Available").length}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Thao tác nhanh</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/UserDashboard"
                  className="bg-blue-500/80 hover:bg-blue-600/80 text-white p-3 rounded-lg text-center transition"
                >
                  Quản lý phòng
                </Link>
                <Link
                  to="/booking-manager"
                  className="bg-green-500/80 hover:bg-green-600/80 text-white p-3 rounded-lg text-center transition"
                >
                  Đặt chỗ của tôi ({bookedData.filter(item => item.status === "Confirmed"||item.status === "CheckedIn").length})
                </Link>
              </div>
            </div>

            {/* Support Card */}
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Hỗ trợ</h3>
              {/* <Link
                to="/history"
                className="block bg-purple-500/80 hover:bg-purple-600/80 text-white p-3 rounded-lg text-center transition mb-3"
              >
                Lịch sử đặt chỗ
              </Link> */}
              <Link
                to="/SupportForm"
                className="block bg-purple-500/80 hover:bg-purple-600/80 text-white p-3 rounded-lg text-center transition"
              >
                Liên hệ hỗ trợ
              </Link>
            </div>
          </div>
        </div>

        {/* Room List */}
        <div className="container mx-auto mt-8 px-4 pb-8 relative z-10">
          <h2 className="text-2xl font-bold text-white mb-6">Danh sách phòng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomData.map((room, idx) => (
              <RoomBox key={room.room_id || idx} data={room} onBookingSuccess={fetchRoomData} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-gray-800/70 border-t border-white/10 text-white py-6 mt-8 relative z-10">
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