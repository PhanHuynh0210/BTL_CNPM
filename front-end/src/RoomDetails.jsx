import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import bg from "./assets/Mainpage.jpg";
import roomImage from "./assets/Room.jpg";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
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
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    user: "Nguyễn Quang Linh",
    date: null,
    start: null,
    end: null,
  });

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
      setSelectedDate(new Date());
      setStartTime(null);
      setEndTime(null);
    } else {
      setShowCancelModal(true);
    }
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    alert("Bạn đã hủy thao tác.");
    // Thực hiện hành động hủy ở đây nếu cần
  };

  const handleSave = () => {
    if (!startTime || !endTime) {
      alert("Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc.");
      return;
    }

    if (startTime >= endTime) {
      alert("Giờ bắt đầu phải trước giờ kết thúc.");
      return;
    }

    const newBooking = {
      user: "Nguyễn Văn Tân",
      date: selectedDate,
      start: startTime,
      end: endTime,
    };

    setBookingInfo(newBooking);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen w-screen relative flex flex-col overflow-hidden">
      {/* Background */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center blur-sm z-[-1]"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>

      {/* Top Bar */}
      <div className="bg-gray-600 text-white py-4 px-8 flex justify-between items-center relative z-10">
        <h1 className="text-3xl font-bold flex-1 text-center">Chi tiết phòng</h1>
        <button className="absolute right-8 text-gray-900 px-4 hover:text-white rounded-lg font-medium text-2xl">
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
            className={`${isEditing ? "w-1/2" : "w-1/3"} relative overflow-hidden rounded-l-lg`}
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
            <h2 className="text-xl font-bold mb-4">Thông tin phòng</h2>
            <ul className="text-lg space-y-2">
              <li><strong>Phòng:</strong> 334 - H1</li>
              <li><strong>Sức chứa:</strong> 50 người</li>
              <li><strong>Tiện nghi:</strong> Máy chiếu, Điều hòa, Wifi</li>
              <li><strong>Người đặt:</strong> {bookingInfo.user || "Chưa có thông tin"}</li>
              <li><strong>Ngày:</strong> {bookingInfo.date ? bookingInfo.date.toLocaleDateString() : "Chưa có thông tin"}</li>
              <li>
                <strong>Thời gian:</strong>{" "}
                {bookingInfo.start && bookingInfo.end
                  ? `${bookingInfo.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${bookingInfo.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : "Chưa có thông tin"}
              </li>
            </ul>
          </div>
        </div>

        {/* Calendar + Time */}
        {isEditing && (
          <div className="flex flex-col w-1/2 gap-6 transition-all duration-500">
            {/* Date Picker */}
            <div className="w-full bg-white p-4 rounded-2xl shadow-lg flex flex-col gap-3 border border-gray-300">
              <label className="text-gray-700 font-semibold text-base">Chọn ngày:</label>
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
              <label className="text-gray-700 font-semibold text-base">Giờ bắt đầu:</label>
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
              <label className="text-gray-700 font-semibold text-base">Giờ kết thúc:</label>
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
              Hủy
            </button>
            <button
              onClick={toggleEditMode}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-yellow-600"
            >
              Chỉnh sửa
            </button>
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600">
              Đặt phòng
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
        <p className="text-left text-gray-300">Tổ kỹ thuật P.DT / Technician</p>
        <p className="text-left text-gray-300">ĐT (Tel.): (84-8) 38647256 - 5258</p>
        <p className="text-left text-gray-300">
          Quý Thầy/Cô chưa có tài khoản (hoặc quên mật khẩu) vui lòng liên hệ Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5 để được hỗ trợ.
        </p>
        <p className="text-left text-gray-300">Email: ddthu@hcmut.edu.vn</p>
        <p className="text-left text-gray-300">(For HCMUT account, please contact: Data and Information Technology Center)</p>
        <p className="text-left text-gray-300">Email: dl-cntt@hcmut.edu.vn</p>
        <p className="text-left text-gray-300">ĐT (Tel.): (84-8) 38647256 - 5200</p>
      </div>
    </div>
  );
}
