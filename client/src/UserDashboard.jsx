import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "./assets/Mainpage.jpg";
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState(0);
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchRooms();
  }, [navigate]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/allroom");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.data || []);
        // Calculate available rooms
        const available = data.data?.filter(room => room.room_status === "Available").length || 0;
        setAvailableRooms(available);
      } else {
        toast.error("Không thể tải danh sách phòng");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Lỗi khi tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async (roomId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để đặt chỗ");
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
          roomId
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Đặt chỗ thành công!");
        fetchRooms();
      } else {
        toast.error(data.message || "Không thể đặt chỗ");
      }
    } catch (error) {
      console.error("Error booking room:", error);
      toast.error("Lỗi khi đặt chỗ");
    }
  };
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  return (
    <div className="min-h-screen" style={{ 
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-2xl font-bold">Smart Study Space Management</h1>
              <p className="text-sm">HCMUT Reservation System</p>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/main" className="text-white hover:text-blue-300 transition">Trang chủ</Link>
              <Link to="/finding-room" className="text-white hover:text-blue-300 transition">Tìm chỗ</Link>
              <Link to="/booking-manager" className="text-white hover:text-blue-300 transition">Quản lý đặt chỗ</Link>
              <Link to="/reports" className="text-white hover:text-blue-300 transition">Đánh giá</Link>
              <Link to="/SupportForm" className="text-white hover:text-blue-300 transition">Hỗ trợ</Link>
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
                >
                  <i className="fas fa-user"></i>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 backdrop-blur-md bg-white/70 border border-white/30 rounded-lg shadow-xl py-2">
                    <Link
                      to="/UserProfile"
                      className="block px-4 py-2 text-gray-800 hover:bg-white/40 transition"
                    >
                      Hồ sơ
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("user_info");
                        navigate("/");
                      }}
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
        <div className="container mx-auto mt-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Available Rooms Card */}
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">Phòng trống</h3>
              <p className="text-3xl font-bold text-blue-400">{availableRooms}</p>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Thao tác nhanh</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/finding-room"
                  className="bg-blue-500/80 hover:bg-blue-600/80 text-white p-3 rounded-lg text-center transition"
                >
                  Tìm phòng
                </Link>
                <Link
                  to="/booking-manager"
                  className="bg-green-500/80 hover:bg-green-600/80 text-white p-3 rounded-lg text-center transition"
                >
                  Đặt chỗ của tôi
                </Link>
              </div>
            </div>

            {/* Support Card */}
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Hỗ trợ</h3>
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
        <div className="container mx-auto mt-8 px-4 pb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Danh sách phòng</h2>
          {loading ? (
            <div className="text-center text-white text-xl">Đang tải...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.room_id}
                  className="backdrop-blur-md bg-white/30 border border-white/30 rounded-lg shadow-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Phòng {room.location} - {room.building}
                      </h3>
                      <p className="text-gray-200">Tầng {room.floor}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        room.room_status === "Available"
                          ? "bg-green-400/70 text-green-900"
                          : room.room_status === "Occupied"
                          ? "bg-red-400/70 text-red-900"
                          : "bg-yellow-400/70 text-yellow-900"
                      }`}
                    >
                      {room.room_status === "Available"
                        ? "Trống"
                        : room.room_status === "Occupied"
                        ? "Đã đầy"
                        : "Bảo trì"}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4 text-white">
                    <p><span className="font-medium">Loại:</span> {room.room_type === "group" ? "Nhóm" : "Đơn"}</p>
                    <p><span className="font-medium">Còn trống:</span> {room.available_seats} vị trí</p>
                    <p><span className="font-medium">Thiết bị:</span> {room.devices || "Không có"}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                        room.room_status === "Available"
                          ? "bg-blue-500/80 hover:bg-blue-600/80 text-white"
                          : "bg-gray-400/50 text-gray-300 cursor-not-allowed"
                      }`}
                      onClick={() => room.room_status === "Available" && handleBookNow(room.room_id)}
                      disabled={room.room_status !== "Available"}
                    >
                      Đặt chỗ ngay
                    </button>
                    {/* <button
                      className="flex-1 bg-gray-500/80 hover:bg-gray-600/80 text-white py-2 px-4 rounded-lg font-medium transition"
                      onClick={() => navigate("/room-details", { state: { roomId: room.room_id } })}
                    >
                      Chi tiết
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-gray-800/70 border-t border-white/10 text-white py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
              <p className="text-sm text-gray-300">Email: ddthu@hcmut.edu.vn</p>
              <p className="text-sm text-gray-300">ĐT (Tel.): (84-8) 38647256 - 5258</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hỗ trợ kỹ thuật</h4>
              <p className="text-sm text-gray-300">Trung tâm Dữ liệu & Công nghệ Thông tin</p>
              <p className="text-sm text-gray-300">Email: dl-cntt@hcmut.edu.vn</p>
              <p className="text-sm text-gray-300">ĐT (Tel.): (84-8) 38647256 - 5200</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}