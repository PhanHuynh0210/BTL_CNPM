import React, { useState } from "react";
import { Link } from "react-router-dom";
import bg from "./assets/Mainpage.jpg";

export default function BookingSelfStudy() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Tạo dữ liệu lịch tháng 3/2025
  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = 31;
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  // Tạo các khung giờ
  const timeSlots = [
    "8:00", "8:00", "8:00", "8:00",
    "8:00", "8:00", "8:00", "8:00",
    "8:00", "8:00", "8:00", "8:00"
  ];
  
  return (
    <div className="min-h-screen relative">
      {/* Background image with blur */}
      <div
        className="inset-0 bg-cover bg-center fixed"
        style={{
          backgroundImage: `url(${bg})`,
          filter: "blur(3px)",
          zIndex: -1,
        }}
      ></div>
      
      {/* Header */}
      <div className="bg-white bg-opacity-70 py-4 px-6">
        <h1 className="text-4xl font-bold text-center">Đặt chỗ tự học</h1>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Room info section */}
          <div className="bg-blue-100 bg-opacity-80 rounded-lg p-6 md:w-1/2">
            <div className="flex">
              {/* Room image */}
              <div className="w-1/2 h-48 bg-yellow-100 rounded-lg overflow-hidden">
                <img 
                  src="./assets/building.jpg" 
                  alt="Tòa nhà H1" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Tòa+nhà+H1";
                  }}
                />
              </div>
              
              {/* Room details */}
              <div className="w-1/2 pl-4">
                <h2 className="text-xl font-bold">Phòng: 334 - H1</h2>
                <p className="mt-1">Tầng: 3</p>
                <div className="mt-2 bg-green-200 text-black text-center w-16 rounded">
                  Trống
                </div>
                
                <div className="mt-4 text-blue-800">
                  <p>Loại: Đơn</p>
                  <p>Còn trống: 3 vị trí</p>
                  <p>Thiết bị: Ổ cắm</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Calendar section */}
          <div className="bg-white bg-opacity-80 rounded-lg p-6 md:w-1/2">
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <button className="px-2 py-1 text-xl">&lt;</button>
                <h3 className="text-xl font-bold">Tháng 3/2025</h3>
                <button className="px-2 py-1 text-xl">&gt;</button>
              </div>
              
              {/* Calendar grid */}
              <div className="mt-4">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  <div className="text-center font-bold">CN</div>
                  <div className="text-center font-bold">T2</div>
                  <div className="text-center font-bold">T3</div>
                  <div className="text-center font-bold">T4</div>
                  <div className="text-center font-bold">T5</div>
                  <div className="text-center font-bold">T6</div>
                  <div className="text-center font-bold">T7</div>
                </div>
                
                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      className={`h-10 flex items-center justify-center rounded-md 
                        ${selectedDate === day ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Time selection */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Chọn giờ</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {timeSlots.map((time, index) => (
              <button
                key={index}
                className={`py-2 px-4 border rounded-md 
                  ${selectedTime === index ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
                onClick={() => setSelectedTime(index)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        
        {/* Continue button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/booking-confirmation"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg text-lg"
          >
            Tiếp tục
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-600 text-white py-2 mt-12">
        <div className="container mx-auto px-6">
          <p className="text-xs text-gray-300">Tổ kỹ thuật P.DT / Technician</p>
          <p className="text-xs text-gray-300">Email : ddthu@hcmut.edu.vn</p>
          <p className="text-xs text-gray-300">ĐT (Tel.) : (84-8) 38647256 - 5258</p>
          <p className="text-xs text-gray-300">Quý Thầy/Cô chưa có tài khoản(hoặc quên mật khẩu) nhà trường vui lòng liên hệ Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5 để được hỗ trợ.</p>
          <p className="text-xs text-gray-300">(For HCMUT account, please contact to : Data and Information Technology Center)</p>
          <p className="text-xs text-gray-300">Email : dl-cntt@hcmut.edu.vn</p>
          <p className="text-xs text-gray-300">ĐT (Tel.) : (84-8) 38647256 - 5200</p>
        </div>
      </div>
    </div>
  );
}