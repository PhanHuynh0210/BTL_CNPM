import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import bg from "./assets/Mainpage.jpg";

export default function BookingSelfStudy() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [numberOfAttendees, setNumberOfAttendees] = useState(1);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return navigate("/");

        const res = await fetch("http://localhost:8080/api/v1/allroom", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setAvailableRooms(data.data.filter(r => r.room_status === "Available"));
        } else toast.error("Không thể tải danh sách phòng");
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải danh sách phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [navigate]);

  const generateCalendarDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);
    return days;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const formatDateLocal = (date) => {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleBooking = async () => {
    if (!selectedRoom || !selectedDate || !selectedTime) return toast.error("Vui lòng chọn đầy đủ thông tin");

    const bookingDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) return toast.error("Không thể đặt cho ngày trong quá khứ");

    const [hour, minute] = selectedTime.split(":").map(Number);
    const now = new Date();

    if (bookingDate.toDateString() === now.toDateString()) {
      if (hour < now.getHours() || (hour === now.getHours() && minute <= now.getMinutes())) {
        return toast.error("Không thể đặt cho giờ đã qua");
      }
    }

    const endHour = hour + 2;
    if (endHour > 22) return toast.error("Không thể đặt quá 22:00");

    const payload = {
      room_id: parseInt(selectedRoom.room_id),
      date: formatDateLocal(bookingDate), // fixed
      start_time: selectedTime,
      end_time: `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      number_of_attendees: numberOfAttendees,
    };

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:8080/api/v1/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Đặt phòng thành công!");
        navigate("/booking-manager");
      } else {
        toast.error(data.message || "Đặt phòng thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi đặt phòng");
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg})`, filter: "blur(3px)", zIndex: -1 }}></div>

      <div className="bg-white/70 py-4 px-6 shadow text-center">
        <h1 className="text-3xl font-bold">Đặt chỗ tự học</h1>
      </div>

      <div className="container mx-auto p-6 grid md:grid-cols-2 gap-6">
        {/* ROOM */}
        <div className="bg-blue-100/80 p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Chọn phòng</h2>
          {loading ? <p>Đang tải...</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableRooms.length === 0 ? <p>Không có phòng trống</p> : availableRooms.map(room => (
                <div
                  key={room.room_id}
                  className={`p-4 rounded-lg cursor-pointer transition-all border ${selectedRoom?.room_id === room.room_id ? "bg-blue-500 text-white" : "bg-white hover:bg-blue-100"}`}
                  onClick={() => {
                    setSelectedRoom(room);
                    setNumberOfAttendees(room.room_type === "group" ? 2 : 1);
                  }}
                >
                  <h3 className="font-bold">Phòng {room.location}</h3>
                  <p>Tầng: {room.floor}</p>
                  <p>Loại: {room.room_type === "group" ? "Nhóm" : "Đơn"}</p>
                  <p>Còn trống: {room.available_seats}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CALENDAR + TIME */}
        <div className="bg-white/80 p-6 rounded-xl shadow">
          <div className="flex justify-between mb-4">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>&lt;</button>
            <h2 className="text-lg font-bold">Tháng {currentMonth.getMonth() + 1}/{currentMonth.getFullYear()}</h2>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>&gt;</button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 text-center font-medium">
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-6">
            {generateCalendarDays().map((day, idx) => (
              <div key={idx}>
                {day ? (
                  <button
                    onClick={() => setSelectedDate(day)}
                    className={`w-full py-2 rounded-md text-sm transition-all ${selectedDate === day ? "bg-blue-600 text-white" : isToday(day) ? "border border-blue-600" : "hover:bg-gray-100"}`}
                  >
                    {day}
                  </button>
                ) : <div className="h-8"></div>}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-2">Chọn giờ</h3>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`p-2 rounded-md text-sm transition-all ${selectedTime === t ? "bg-blue-500 text-white" : "bg-white hover:bg-blue-100"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {selectedRoom?.room_type === "group" && (
            <div className="mt-4">
              <label className="block mb-1 text-sm">Số người tham gia</label>
              <input
                type="number"
                value={numberOfAttendees}
                min={1}
                max={selectedRoom.available_seats}
                onChange={(e) => setNumberOfAttendees(Math.min(Math.max(1, +e.target.value), selectedRoom.available_seats))}
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      <div className="text-center my-6">
        <button
          onClick={handleBooking}
          disabled={!selectedRoom || !selectedDate || !selectedTime}
          className={`py-3 px-8 rounded-lg font-bold text-lg shadow-md transition-all ${!selectedRoom || !selectedDate || !selectedTime ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          Đặt phòng
        </button>
      </div>
    </div>
  );
}