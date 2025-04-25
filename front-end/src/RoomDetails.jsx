import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import bg from "./assets/Mainpage.jpg";
import roomImage from "./assets/Room.jpg";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
registerLocale("vi", vi);

function ConfirmModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm">
        <h2 className="text-xl font-bold mb-4">Xác nhận hủy</h2>
        <p className="mb-6">Bạn có chắc chắn muốn hủy chỉnh sửa không?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-300 rounded hover:bg-gray-400"
          >
            Tiếp tục chỉnh sửa
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Xác nhận hủy
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

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast.error("Vui lòng đăng nhập để xem chi tiết đặt phòng");
          navigate("/");
          return;
        }

        const response = await fetch(
          `http://localhost:8080/api/v1/bookings/ID/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setBookingDetails(data.DT);
          // Set initial values for editing
          if (data.DT) {
            setSelectedDate(new Date(data.DT.booking_day));
            setStartTime(new Date(`1970-01-01T${data.DT.start_time}`));
            setEndTime(new Date(`1970-01-01T${data.DT.end_time}`));
          }
        } else {
          toast.error(data.EM || "Không thể tải thông tin đặt phòng");
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

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
      if (bookingDetails) {
        setSelectedDate(new Date(bookingDetails.booking_day));
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
      const response = await fetch(
        `http://localhost:8080/api/v1/bookings/update/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: selectedDate.toISOString().split("T")[0],
            start_time: startTime.toTimeString().split(" ")[0].substring(0, 5),
            end_time: endTime.toTimeString().split(" ")[0].substring(0, 5),
            number_of_attendees: bookingDetails.booked_seats // Giữ nguyên số người tham gia
          }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || "Cập nhật đặt phòng thành công");
        setIsEditing(false);
        
        // Refresh booking details
        const updatedResponse = await fetch(
          `http://localhost:8080/api/v1/bookings/ID/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedData = await updatedResponse.json();
        if (updatedResponse.ok) {
          setBookingDetails(updatedData.DT);
        }
      } else {
        // Handle specific error cases
        let errorMessage = data.message;
        switch (response.status) {
          case 400:
            errorMessage = "Thông tin cập nhật không hợp lệ: " + errorMessage;
            break;
          case 401:
            errorMessage = "Vui lòng đăng nhập lại để tiếp tục";
            navigate("/");
            break;
          case 403:
            errorMessage = "Bạn không có quyền sửa đổi đặt phòng này";
            break;
          case 404:
            errorMessage = "Không tìm thấy thông tin đặt phòng";
            break;
          case 409:
            errorMessage = "Không thể cập nhật: " + errorMessage;
            break;
          default:
            errorMessage = "Lỗi khi cập nhật đặt phòng: " + errorMessage;
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Lỗi khi cập nhật đặt phòng");
    }
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
        <div className="text-2xl font-semibold">Không tìm thấy thông tin đặt phòng</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen relative flex flex-col overflow-hidden">
      {/* Background */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center blur-sm z-[-1]"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>

      {/* Top Bar */}
      <div className="bg-gray-600 text-white py-4 px-8 flex justify-between items-center relative z-10">
        <h1 className="text-3xl font-bold flex-1 text-center">Chi tiết đặt phòng</h1>
        <button
          className="absolute right-8 text-gray-900 px-4 hover:text-white rounded-lg font-medium text-2xl"
          onClick={() => navigate("/main")}
        >
          <i className="fas fa-home"></i>
        </button>
      </div>

      {/* Middle */}
      <div className="flex flex-1 px-[10%] py-8 gap-6 items-start transition-all duration-500">
        {/* Room Info Box */}
        <div
          className={`bg-blue-200 bg-opacity-60 shadow-lg rounded-lg border-2 border-gray-300 flex transition-all duration-500 ${
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
          <div className="w-1/2 h-full p-6 flex flex-col justify-center">
            <h2 className="text-xl font-bold mb-4">Thông tin đặt phòng</h2>
            <ul className="text-lg space-y-2">
              <li>
                <strong>Phòng:</strong> {bookingDetails.room_location}
              </li>
              <li>
                <strong>Sức chứa:</strong> {bookingDetails.room_capacity} người
              </li>
              <li>
                <strong>Thiết bị:</strong>{" "}
                {bookingDetails.room_devices?.map(device => device.name).join(", ") || "Không có"}
              </li>
              <li>
                <strong>Người đặt:</strong> {bookingDetails.user_fullName}
              </li>
              <li>
                <strong>MSSV:</strong> {bookingDetails.mssv}
              </li>
              <li>
                <strong>Ngày:</strong>{" "}
                {new Date(bookingDetails.booking_day).toLocaleDateString("vi-VN")}
              </li>
              <li>
                <strong>Thời gian:</strong>{" "}
                {`${bookingDetails.start_time} - ${bookingDetails.end_time}`}
              </li>
              <li>
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`${
                    bookingDetails.booking_status === "Confirmed"
                      ? "text-green-600"
                      : bookingDetails.booking_status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {bookingDetails.booking_status}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Calendar + Time */}
        {isEditing && (
          <div className="flex flex-col w-1/2 gap-6 transition-all duration-500">
            {/* Date Picker */}
            <div className="w-full bg-white p-4 rounded-2xl shadow-lg flex flex-col gap-3 border border-gray-300">
              <label className="text-gray-700 font-semibold text-base">
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
            <div className="w-full bg-white p-4 rounded-2xl shadow-lg flex flex-col gap-3 border border-gray-300">
              <label className="text-gray-700 font-semibold text-base">
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
            <div className="w-full bg-white p-4 rounded-2xl shadow-lg flex flex-col gap-3 border border-gray-300">
              <label className="text-gray-700 font-semibold text-base">
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
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-6 transition-all duration-300">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-600"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
            >
              Lưu
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-600"
            >
              Hủy đặt phòng
            </button>
            <button
              onClick={toggleEditMode}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-yellow-600"
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
      <div className="bg-gray-600 text-white text-xs py-4 px-6 mt-auto space-y-1">
        <p className="text-left text-gray-300">
          Tổ kỹ thuật P.DT / Technician
        </p>
        <p className="text-left text-gray-300">
          ĐT (Tel.): (84-8) 38647256 - 5258
        </p>
        <p className="text-left text-gray-300">
          Quý Thầy/Cô chưa có tài khoản (hoặc quên mật khẩu) vui lòng liên hệ
          Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5 để được hỗ trợ.
        </p>
        <p className="text-left text-gray-300">Email: ddthu@hcmut.edu.vn</p>
        <p className="text-left text-gray-300">
          (For HCMUT account, please contact: Data and Information Technology
          Center)
        </p>
        <p className="text-left text-gray-300">Email: dl-cntt@hcmut.edu.vn</p>
        <p className="text-left text-gray-300">
          ĐT (Tel.): (84-8) 38647256 - 5200
        </p>
      </div>
    </div>
  );
}