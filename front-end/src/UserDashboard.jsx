import React, { useState } from "react";
import { Link } from "react-router-dom";
import bg from "./assets/Mainpage.jpg";

export default function UserDashboard() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Mock room data
  const rooms = [
    { id: 1, number: "334", building: "H1", floor: 3, status: "Trống", type: "Đơn", available: 3, equipment: "Ổ cắm" },
    { id: 2, number: "334", building: "H1", floor: 3, status: "Trống", type: "Đơn", available: 7, equipment: "Ổ cắm" },
    { id: 3, number: "334", building: "H1", floor: 3, status: "Trống", type: "Nhóm", available: 3, equipment: "Ổ cắm" },
  ];
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  return (
    <div className="justify-center min-h-screen bg-gray-100">
      {/* Background image with blur */}
      <div
        className="inset-0 bg-cover bg-center absolute"
        style={{
          backgroundImage: `url(${bg})`,
          filter: "blur(3px)",
          zIndex: 1,
        }}
      ></div>
      
      {/* Main content */}
      <div className="relative p-4 z-10">
        {/* Header */}
        <div className="flex flex-grow items-center space-x-4 mb-4">
          <div className="w-30% h-24 bg-white bg-opacity-15 p-4 shadow-lg rounded-lg border-2 border-gray-400 flex flex-col justify-center mr-8">
            <p className="font-bold text-2xl">Smart Study Space Management &</p>
            <p className="font-bold text-2xl">Reservation System at HCMUT</p>
          </div>
          <div className="flex-grow flex">
            <Link
              to="/main"
              className="flex-grow bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
            >
              {" "}
              Trang chủ
            </Link>
            <Link
              to="/finding-room"
              className="ml-4 flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200"
            >
              {" "}
              Tìm chỗ
            </Link>
            <Link
              to="/booking-manager"
              className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200"
            >
              {" "}
              Quản lý đặt chỗ
            </Link>
            <Link
              to="/reports"
              className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200"
            >
              {" "}
              Báo cáo
            </Link>
            <Link
              to="/support"
              className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200"
            >
              {" "}
              Hỗ trợ
            </Link>
            <button
              onClick={toggleUserMenu}
              className="bg-black hover:bg-gray-100 hover:text-black text-white py-2 px-8 rounded-2xl transition duration-200 mr-10"
            >
              <i className="fas fa-user"></i>
            </button>
          </div>
        </div>
        
        {/* User menu popup */}
        {showUserMenu && (
          <div className="absolute right-10 top-24 bg-white rounded-lg shadow-lg p-6 z-20">
            <div className="flex justify-between gap-4">
              <Link
                to="/profile"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Thông tin
              </Link>
              <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Đăng xuất
              </Link>
            </div>
          </div>
        )}
        
        {/* Dashboard content */}
        <div className="flex space-x-4 h-48 mt-16 ml-8">
          <div className="w-5/12 font-medium bg-white p-4 shadow-lg rounded-lg mr-60 bg-opacity-15">
            {/* Summary and management box */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
              {/* Room count */}
              <div className="text-white text-center text-lg flex flex-col items-center justify-center col-span-1 row-span-1">
                <p>Số phòng trống</p>
                <p className="text-3xl font-bold">100</p>
              </div>
              
              {/* Management buttons */}
              <Link
                to="/room-management"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 col-span-1 row-span-1 flex items-center justify-center"
              >
                Quản lý phòng
              </Link>
              <Link
                to="/my-bookings"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 col-span-1 row-span-1 flex flex-col items-center justify-center"
              >
                <span>Đặt chỗ của tôi</span>
                <span>4</span>
              </Link>
              <Link
                to="/booking-history"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 col-span-1 row-span-1 flex items-center justify-center"
              >
                Lịch sử đặt chỗ
              </Link>
            </div>
          </div>
          
          {/* Featured room */}
          <div className="flex w-1/3 bg-white bg-opacity-15 p-4 shadow-lg rounded-lg grid grid-cols-2 font-medium">
            <div className="ml-4 text-white col-span-1 grid grid-row-6">
              <p className="text-white row-span-1 font-medium">
                {" "}
                Phòng: 334 - H1
              </p>
              <br />
              <p>Tầng: 3</p>
              <p className="bg-green-200 text-black text-center w-12 col-span-1">
                Trống
              </p>
              <p>Loại: Đơn</p>
              <p>Còn trống: 3 vị trí</p>
              <p>Thiết bị: Ổ cắm</p>
            </div>
            <div className="flex justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-6 font-medium transition duration-200 h-[66px]">
                Đặt chỗ ngay
              </button>
            </div>
          </div>
        </div>
        
        {/* Room cards */}
        <div className="flex space-x-20 mt-4 mt-40 h-48">
          {rooms.map((room) => (
            <div key={room.id} className="flex w-1/3 bg-white bg-opacity-15 p-4 shadow-lg rounded-lg grid grid-cols-2 font-medium">
              <div className="text-white col-span-1 grid grid-row-6">
                <p className="text-white row-span-1 font-medium">
                  {" "}
                  Phòng: {room.number} - {room.building}
                </p>
                <br />
                <p>Tầng: {room.floor}</p>
                <p className="bg-green-200 text-black text-center w-12 col-span-1">
                  {room.status}
                </p>
                <p>Loại: {room.type}</p>
                <p>Còn trống: {room.available} vị trí</p>
                <p>Thiết bị: {room.equipment}</p>
              </div>
              <div className="flex justify-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-6 font-medium transition duration-200 h-[66px]">
                  Đặt chỗ ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="bottom-0 left-0 right-0 text-center text-white z-10 bg-gray-600 mt-20">
        <br />
        <p className="text-xs text-left ml-6 text-gray-300">Tổ kỹ thuật P.DT / Technician</p>
        <p className="text-xs text-left ml-6 text-gray-300">ĐT (Tel.) : (84-8) 38647256 - 5258</p>
        <p className="text-xs text-left ml-6 text-gray-300">
          Quý Thầy/Cô chưa có tài khoản(hoặc quên mật khẩu) nhà trường vui lòng liên hệ Trung tâm Dữ liệu & Công nghệ
          Thông tin, phòng 109A5 để được hỗ trợ.
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">Email: ddthu@hcmut.edu.vn </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          (For HCMUT account, please contact to : Data and Information Technology Center)
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">Email : dl-cntt@hcmut.edu.vn</p>
        <p className="text-xs text-left ml-6 text-gray-300">
          (For HCMUT account, please contact to : Data and Information Technology Center)
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">ĐT (Tel.) : (84-8) 38647256 - 5200</p>
      </div>
    </div>
  );
}