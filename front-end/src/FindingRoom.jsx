import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "./assets/Mainpage.jpg";
import toast from 'react-hot-toast';

export default function FindingRoom() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    building: "Tất cả",
    floor: "Tất cả",
    type: "Tất cả",
    date: "",
    startTime: "",
    endTime: "",
    equipment: "Tất cả",
  });

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
      return;
    }
    
    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0];
    const defaultTime = now.toTimeString().slice(0,5);
    setFilters(prev => ({ ...prev, date: defaultDate, time: defaultTime }));

    fetchRooms();
  }, [navigate]);

  useEffect(() => {
    if (showPopup && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showPopup && countdown === 0) {
      navigate("/booking-self-study");
    }
  }, [showPopup, countdown, navigate]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/allroom");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.data || []);
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

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setValidationError(""); // Clear validation error when filters change
  };

  const validateDateTime = () => {
    if (!filters.date) {
      setValidationError("Vui lòng chọn ngày đặt phòng");
      return false;
    }
    if (!filters.time) {
      setValidationError("Vui lòng chọn thời gian đặt phòng");
      return false;
    }

    // Validate date is not in the past
    const selectedDate = new Date(filters.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setValidationError("Không thể đặt phòng cho ngày trong quá khứ");
      return false;
    }

    // If date is today, validate time is not in the past
    if (selectedDate.getTime() === today.getTime()) {
      const currentTime = new Date();
      const [hours, minutes] = filters.time.split(':');
      const selectedTime = new Date();
      selectedTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      if (selectedTime < currentTime) {
        setValidationError("Không thể đặt phòng cho thời gian đã qua");
        return false;
      }
    }

    return true;
  };
  const calculateEndTime = (startTime) => {
    if (!startTime) return "";
    
    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours + 1;  // Assuming 1-hour bookings
    
    // Handle hour overflow
    if (endHours >= 24) {
      endHours = endHours - 24;
    }
    
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleCheckAvailability = async (roomId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để kiểm tra phòng");
      return;
    }
    if (!validateDateTime()) {
      toast.error(validationError);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/check-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_id: roomId,
          date: filters.date,
          start_time: filters.time,
          end_time: calculateEndTime(filters.time)
        }),
      });

      const data = await res.json();
      if (res.ok && data.available) {
        toast.success("Phòng có sẵn để đặt!");
        setShowPopup(true);
        setCountdown(5);
      } else {
        toast.error("Phòng không có sẵn trong thời gian này");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Lỗi khi kiểm tra tình trạng phòng");
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesBuilding = filters.building === "Tất cả" || room.building === filters.building;
    const matchesFloor = filters.floor === "Tất cả" || room.floor === parseInt(filters.floor);
    const matchesType = filters.type === "Tất cả" || 
                       (filters.type === "Nhóm" ? room.room_type === "group" : 
                        filters.type === "Đơn" ? room.room_type === "single" : false);
    
    // Handle devices array or string
    const roomDevices = typeof room.devices === 'string' 
      ? room.devices.split(',').map(d => d.trim())
      : Array.isArray(room.devices) 
        ? room.devices 
        : [];
    
    const matchesEquipment = filters.equipment === "Tất cả" || 
                            roomDevices.some(device => 
                              device.toLowerCase().includes(filters.equipment.toLowerCase()));

    return matchesBuilding && matchesFloor && matchesType && matchesEquipment;
  });

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header giống BookingManager */}
      <div className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-2xl font-bold">Smart Study Space Management</h1>
            <p className="text-sm">HCMUT Reservation System</p>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/main" className="text-white hover:text-blue-300 transition">Trang chủ</Link>
            <Link to="/finding-room" className="bg-blue-500/80 text-white px-4 py-2 rounded-lg hover:bg-blue-600/80 transition">Tìm chỗ</Link>
            <Link to="/booking-manager" className="text-white hover:text-blue-300 transition">Quản lý đặt chỗ</Link>
            <Link to="/FeedbackForm" className="text-white hover:text-blue-300 transition">Báo cáo</Link>
            <Link to="/support" className="text-white hover:text-blue-300 transition">Hỗ trợ</Link>
            <Link to="/profile" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition">
              <i className="fas fa-user"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="container mx-auto my-8 px-4">
        <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Tìm kiếm phòng học</h2>

          {/* Bộ lọc */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {/* Các ô lọc giữ nguyên, chỉ style lại */}
            {["building", "floor", "type", "date", "time", "equipment"].map((filter) => (
              <div key={filter}>
                <label className="block text-white text-sm font-medium mb-1 capitalize">{filter === "time" ? "Thời gian" : filter === "date" ? "Ngày" : filter}</label>
                {filter === "date" || filter === "time" ? (
                  <input
                    type={filter}
                    className="w-full p-2 rounded-md bg-white/60 text-black"
                    value={filters[filter]}
                    onChange={(e) => handleFilterChange(filter, e.target.value)}
                  />
                ) : (
                  <select
                    className="w-full p-2 rounded-md bg-white/60 text-black"
                    value={filters[filter]}
                    onChange={(e) => handleFilterChange(filter, e.target.value)}
                  >
                    {/* Options sẽ được custom tương ứng */}
                    {filter === "building" && ["Tất cả", "H1", "H2", "H3", "H6"].map(opt => <option key={opt}>{opt}</option>)}
                    {filter === "floor" && ["Tất cả", "1", "2", "3", "4"].map(opt => <option key={opt}>{opt}</option>)}
                    {filter === "type" && ["Tất cả", "Đơn", "Nhóm"].map(opt => <option key={opt}>{opt}</option>)}
                    {filter === "equipment" && ["Tất cả", "Ổ cắm", "Máy chiếu", "Điều hòa"].map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>

          {/* Danh sách phòng */}
          {loading ? (
            <p className="text-center text-white">Đang tải danh sách phòng...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div key={room.room_id} className="backdrop-blur-md bg-white/20 rounded-lg p-4 border border-white/20 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Phòng {room.location} - {room.building}</h3>
                  <ul className="text-white text-sm space-y-1">
                    <li>Tầng: {room.floor}</li>
                    <li>Loại: {room.room_type === "group" ? "Nhóm" : "Đơn"}</li>
                    <li>Chỗ trống: {room.available_seats}</li>
                    <li>Thiết bị: {room.devices || "Không có"}</li>
                    <li>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        room.room_status === "Available"
                          ? "bg-green-400 text-green-900"
                          : room.room_status === "Occupied"
                          ? "bg-red-400 text-red-900"
                          : "bg-yellow-400 text-yellow-900"
                      }`}>
                        {room.room_status === "Available"
                          ? "Trống"
                          : room.room_status === "Occupied"
                          ? "Đã đầy"
                          : "Bảo trì"}
                      </span>
                    </li>
                  </ul>
                  <button
                    className={`mt-4 w-full py-2 px-4 rounded-lg font-medium text-white transition ${
                      room.room_status !== "Available"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-700"
                    }`}
                    disabled={room.room_status !== "Available"}
                    onClick={() => handleCheckAvailability(room.room_id)}
                  >
                    Kiểm tra & Đặt chỗ
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer giống BookingManager */}
      <footer className="backdrop-blur-md bg-gray-800/70 border-t border-white/10 text-white py-6 mt-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <p className="text-sm text-gray-300">Email: ddthu@hcmut.edu.vn</p>
            <p className="text-sm text-gray-300">ĐT (Tel.): (84-8) 38647256 - 5258</p>
            <p className="text-sm text-gray-300">Quý Thầy/Cô chưa có tài khoản hoặc quên mật khẩu vui lòng liên hệ Trung tâm Dữ liệu & CNTT - phòng 109A5</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ kỹ thuật</h4>
            <p className="text-sm text-gray-300">Trung tâm Dữ liệu & CNTT</p>
            <p className="text-sm text-gray-300">Email: dl-cntt@hcmut.edu.vn</p>
            <p className="text-sm text-gray-300">ĐT (Tel.): (84-8) 38647256 - 5200</p>
          </div>
        </div>
      </footer>
      {/* Hiển thị popup nếu có phòng */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center w-[90%] max-w-md">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Phòng sẵn sàng 🎉</h2>
            <p className="text-lg text-gray-800 mb-2">
              Bạn sẽ được chuyển đến trang đặt chỗ sau <span className="font-semibold">{countdown}</span> giây.
            </p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition"
              onClick={() => navigate("/booking-self-study")}
            >
              Đặt chỗ ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}