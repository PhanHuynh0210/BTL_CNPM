import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import bg from "./assets/Mainpage.jpg";
import roomImage from "./assets/Room.jpg";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
registerLocale("vi", vi);

function ConfirmModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm">
        <h2 className="text-xl font-bold mb-4">Xác nhận hủy</h2>
        <p className="mb-6">Bạn có chắc chắn muốn hủy đặt phòng không?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Tiếp tục chỉnh sửa
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Xác nhận hủy phòng
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RoomDetails() {
  const { bookingId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [numberOfAttendees, setNumberOfAttendees] = useState(1);


  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          toast.error("Vui lòng đăng nhập để xem chi tiết đặt phòng");
          navigate("/");
          return;
        }
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        if (!userInfo?.mssv) {
          toast.error("Không tìm thấy thông tin người dùng");
          return;
        }

        const response = await fetch(
          `http://localhost:8080/api/v1/bookings/student/${userInfo.mssv}`
        );

        const res = await response.json();

        const room = res.DT.find(
          (item) => item.booking_id === Number(bookingId)
        );
        if (response.ok) {
          setBookingDetails(room);
          setNumberOfAttendees(room.booked_seats || 1); 
          // Set initial values for editing
          if (room) {
            setSelectedDate(new Date(room.Day));
            setStartTime(new Date(`1970-01-01T${room.start_time}`));
            setEndTime(new Date(`1970-01-01T${room.end_time}`));
          }
        } else {
          toast.error(room.EM || "Không thể tải thông tin đặt phòng");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast.error("Lỗi khi tải thông tin đặt phòng");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!bookingDetails?.room_name) return;

      try {
        const res = await fetch("http://localhost:8080/api/v1/allroom");
        if (res.ok) {
          const ans = await res.json();
          const roomData = ans.data.find(
            (item) => item.location === bookingDetails.room_name
          );
          setRooms(roomData || []);
        } else {
          toast.error("Không thể tải danh sách phòng");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast.error("Lỗi khi tải danh sách phòng");
      }
    };

    fetchRooms();
  }, [bookingDetails?.room_name]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);
  

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
      if (bookingDetails) {
        setSelectedDate(new Date(bookingDetails.Day));
        setStartTime(new Date(`1970-01-01T${bookingDetails.start_time}`));
        setEndTime(new Date(`1970-01-01T${bookingDetails.end_time}`));
      }
    } else {
      setShowCancelModal(true);
    }
  };

  const confirmCancel = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:8080/api/v1/booking/${bookingId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Hủy đặt phòng thành công");
        navigate("/booking-manager");
      } else {
        toast.error(data.EM || "Không thể hủy đặt phòng");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast.error("Lỗi khi hủy đặt phòng");
    }
    setShowCancelModal(false);
  };

  const handleSave = async () => {
    if (!startTime || !endTime) {
      toast.error("Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc");
      return;
    }

    if (startTime >= endTime) {
      toast.error("Giờ bắt đầu phải trước giờ kết thúc");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      // 1. Hủy đặt chỗ cũ
      const createResponse = await fetch(`http://localhost:8080/api/v1/bookings/update/${bookingId}`,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_id: rooms.room_id,
          date: selectedDate.toISOString().split("T")[0],
          start_time: startTime.toTimeString().split(" ")[0].substring(0, 5),
          end_time: endTime.toTimeString().split(" ")[0].substring(0, 5),
          number_of_attendees: numberOfAttendees,
        }),
      })

      const createData = await createResponse.json();

      if (createResponse.ok) {
        toast.success(createData.message || "Đặt lại thành công");
        setIsEditing(false);
        setBookingDetails(createData.DT); // Cập nhật thông tin mới
        navigate("/booking-manager");
      } else {
        throw new Error("Đặt lại thất bại: " + createData.message);
      }
    } catch (error) {
      console.error("Error while rebooking:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật đặt chỗ");
    }
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-2xl font-semibold">Đang tải...</div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-2xl font-semibold">
          Không tìm thấy thông tin đặt phòng
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
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
            <Link to="/main" className="text-white hover:text-blue-300 transition">
              Trang chủ
            </Link>
            <Link to="/finding-room" className="text-white hover:text-blue-300 transition">
              Tìm chỗ
            </Link>
            <Link
              to="/booking-manager"
              className="text-white hover:text-blue-300 transition"
            >
              Quản lý đặt chỗ
            </Link>
            <Link
              to="/FeedbackForm"
              className="text-white hover:text-blue-300 transition"
            >
              Báo cáo
            </Link>
            <Link to="/support" className="text-white hover:text-blue-300 transition">
              Hỗ trợ
            </Link>

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

      {/* Middle */}
      <div className="flex flex-1 px-[10%] py-8 gap-6 items-start transition-all duration-500 relative z-10">
        {/* Room Info Box */}
        <div
          className={`backdrop-blur-md bg-white/30 border border-white/30 rounded-lg shadow-lg p-6 flex transition-all duration-500 ${
            isEditing ? "w-1/2" : "w-3/4 mx-auto"
          }`}
        >
          {/* Image */}
          <div
            className={`${
              isEditing ? "w-1/2" : "w-1/3"
            } relative overflow-hidden rounded-l-lg`}
          >
            <div
              className="absolute inset-0 bg-center bg-cover scale-110"
              style={{
                backgroundImage: `url(${roomImage})`,
                backgroundPosition: "right",
              }}
            ></div>
          </div>

          {/* Room Details */}
          <div className="w-1/2 h-full p-6 flex flex-col justify-center text-white">
            <h2 className="text-xl font-semibold mb-4">Thông tin đặt phòng</h2>
            <ul className="text-lg space-y-2">
              <li>
                <span className="font-medium">Phòng:</span>{" "}
                {bookingDetails.room_name}
              </li>
              <li>
                <span className="font-medium">Sức chứa:</span> {rooms.capacity}{" "}
                người
              </li>
              <li>
                <span className="font-medium">Số chỗ đặt:</span> {bookingDetails.booked_seats}{" "}
                chỗ
              </li>
              <li>
                <span className="font-medium">Thiết bị:</span>{" "}
                {rooms.devices || "Không có"}
              </li>

              <li>
                <span className="font-medium">MSSV:</span>{" "}
                {bookingDetails.mssv}
              </li>
              <li>
                <span className="font-medium">Ngày:</span>{" "}
                {new Date(bookingDetails.Day).toLocaleDateString("vi-VN")}
              </li>
              <li>
                <span className="font-medium">Thời gian:</span>{" "}
                {`${bookingDetails.start_time} - ${bookingDetails.end_time}`}
              </li>
              <li>
                <span className="font-medium">Trạng thái:</span>{" "}
                <span
                  className={`${
                    bookingDetails.status === "Confirmed"
                      ? "text-green-400"
                      : bookingDetails.status === "Cancelled"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {bookingDetails.status}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Calendar + Time */}
        {isEditing && (
          <div className="flex flex-col w-1/2 gap-6 transition-all duration-500 relative z-10">
            {/* Date Picker */}
            <div className="w-full backdrop-blur-md bg-white/30 border border-white/30 rounded-lg shadow-lg p-4 flex flex-col gap-3 relative z-40">
              <label className="text-white font-semibold text-base">
                Chọn ngày:
              </label>
              <DatePicker
                locale="vi"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="EEEE, dd/MM/yyyy"
                minDate={new Date()}
                className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring focus:ring-blue-400 font-medium"
                calendarClassName="rounded-xl shadow-xl border border-blue-200"
                placeholderText="Chọn ngày sử dụng"
              />
            </div>

            {/* Time Picker - Start */}
            <div className="w-full backdrop-blur-md bg-white/30 border border-white/30 rounded-lg shadow-lg p-4 flex flex-col gap-3 relative z-30">
              <label className="text-white font-semibold text-base">
                Giờ bắt đầu:
              </label>
              <DatePicker
                selected={startTime}
                onChange={(time) => setStartTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={10}
                timeCaption="Giờ"
                dateFormat="HH:mm"
                placeholderText="Chọn giờ bắt đầu"
                className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring focus:ring-blue-400 font-medium"
              />
            </div>

            {/* Time Picker - End */}
            <div className="w-full backdrop-blur-md bg-white/30 border border-white/30 rounded-lg shadow-lg p-4 flex flex-col gap-3 relative z-20">
              <label className="text-white font-semibold text-base">
                Giờ kết thúc:
              </label>
              <DatePicker
                selected={endTime}
                onChange={(time) => setEndTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={10}
                timeCaption="Giờ"
                dateFormat="HH:mm"
                placeholderText="Chọn giờ kết thúc"
                className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring focus:ring-blue-400 font-medium"
              />
            </div>
            <div className="w-full backdrop-blur-md bg-white/30 border border-white/30 rounded-lg shadow-lg p-4 flex flex-col gap-3 relative z-40">
              <label className="text-white font-semibold text-base">
                Số chỗ đặt: 
              <input type="number" value={numberOfAttendees}
              className="text-black p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring focus:ring-blue-400 font-medium w-full"
              min={1}
              max={rooms.available_seats+numberOfAttendees}
              onChange={(e) => setNumberOfAttendees(Math.min(Math.max(1, +e.target.value), rooms.available_seats + numberOfAttendees))}
              />
              </label>
              
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-6 transition-all duration-300 relative z-10">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="bg-red-500/80 hover:bg-red-600/80 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500/80 hover:bg-blue-600/80 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              Lưu
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleCancel}
              className="bg-red-500/80 hover:bg-red-600/80 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              Hủy đặt phòng
            </button>
            <button
              onClick={toggleEditMode}
              className="bg-yellow-500/80 hover:bg-yellow-600/80 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              Chỉnh sửa
            </button>
          </>
        )}
      </div>

      {/* Modal */}
      <ConfirmModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
      />

      {/* Footer */}
      <footer className="backdrop-blur-md bg-gray-800/70 border-t border-white/10 text-white py-6 mt-auto relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
              <p className="text-sm text-gray-300">Email: ddthu@hcmut.edu.vn</p>
              <p className="text-sm text-gray-300">
                ĐT (Tel.): (84-8) 38647256 - 5258
              </p>
              <p className="text-sm text-gray-300">
                Quý Thầy/Cô chưa có tài khoản(hoặc quên mật khẩu) nhà trường vui
                lòng liên hệ Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5
                để được hỗ trợ.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hỗ trợ kỹ thuật</h4>
              <p className="text-sm text-gray-300">
                Trung tâm Dữ liệu & Công nghệ Thông tin
              </p>
              <p className="text-sm text-gray-300">Email: dl-cntt@hcmut.edu.vn</p>
              <p className="text-sm text-gray-300">
                ĐT (Tel.): (84-8) 38647256 - 5200
              </p>
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