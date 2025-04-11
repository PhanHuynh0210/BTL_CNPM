import React, { useState } from "react";
import { Link } from "react-router-dom";
import bg from "./assets/Mainpage.jpg";

export default function FindingRoom() {
  const [filters, setFilters] = useState({
    building: "Tất cả",
    floor: "Tất cả",
    type: "Tất cả",
    date: "",
    time: "",
    equipment: "Tất cả",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Mock room data
  const rooms = [
    { id: 1, number: "234", building: "H1", floor: 3, status: "Trống", type: "Đơn", available: 3, equipment: "Ổ cắm" },
    { id: 2, number: "234", building: "H1", floor: 3, status: "Đã đầy", type: "Đơn", available: 0, equipment: "Ổ cắm" },
    { id: 3, number: "234", building: "H1", floor: 3, status: "Trống", type: "Đơn", available: 3, equipment: "Ổ cắm" },
    { id: 4, number: "234", building: "H1", floor: 3, status: "Trống", type: "Đơn", available: 3, equipment: "Ổ cắm" },
    { id: 5, number: "234", building: "H1", floor: 3, status: "Trống", type: "Nhóm", available: 3, equipment: "Ổ cắm" },
    { id: 6, number: "234", building: "H1", floor: 3, status: "Đã đầy", type: "Đơn", available: 0, equipment: "Ổ cắm" },
  ];

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
              className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200"
            >
              {" "}
              Trang chủ
            </Link>
            <Link
              to="/finding-room"
              className="ml-4 flex-grow bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
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
            <Link
              to="/profile"
              className="bg-black hover:bg-gray-100 hover:text-black text-white py-2 px-8 rounded-2xl transition duration-200 mr-10"
            >
              <i className="fas fa-user"></i>
            </Link>
          </div>
        </div>

        {/* Search filters */}
        <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Tìm kiếm nhanh</h2>
          <div className="grid grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tòa nhà</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.building}
                onChange={(e) => handleFilterChange("building", e.target.value)}
              >
                <option>Tất cả</option>
                <option>H1</option>
                <option>H2</option>
                <option>H3</option>
                <option>H6</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tầng</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.floor}
                onChange={(e) => handleFilterChange("floor", e.target.value)}
              >
                <option>Tất cả</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Loại</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option>Tất cả</option>
                <option>Đơn</option>
                <option>Nhóm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày</label>
              <input
                type="text"
                placeholder="NN/NN/NNN"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thời gian</label>
              <input
                type="text"
                placeholder="--:-- --"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.time}
                onChange={(e) => handleFilterChange("time", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thiết bị</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.equipment}
                onChange={(e) => handleFilterChange("equipment", e.target.value)}
              >
                <option>Tất cả</option>
                <option>Ổ cắm</option>
                <option>Máy chiếu</option>
                <option>Điều hòa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Room cards grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white bg-opacity-15 p-4 shadow-lg rounded-lg grid grid-cols-2 font-medium">
              <div className="text-white col-span-1 grid grid-row-6">
                <p className="text-white row-span-1 font-medium">
                  {" "}
                  Chỗ: {room.number} - {room.building}
                </p>
                <br />
                <p>Tầng: {room.floor}</p>
                <p className={`${room.status === "Trống" ? "bg-green-200" : "bg-red-200"} text-black text-center w-12 col-span-1`}>
                  <p className="text-center text-lg flex items-center justify-center"></p>
                  {room.status}
                </p>
                <p>Loại: {room.type}</p>
                <p>Còn trống: {room.available} vị trí</p>
                <p>Thiết bị: {room.equipment}</p>
              </div>
              <div className="flex justify-center">
                <Link
                  to="/room-details"
                  className={`bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-6 font-medium transition duration-200 h-[66px] flex items-center ${
                    room.status === "Đã đầy" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Đặt chỗ ngay
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bottom-0 left-0 right-0 text-center text-white z-10 bg-gray-600">
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