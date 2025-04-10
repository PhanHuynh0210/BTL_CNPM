import React from "react";
import bg from "./assets/Mainpage.jpg";
import room from "./assets/Room.jpg";

export default function CurrentRoom() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Top Bar */}
      <div className="bg-gray-500 text-white py-4 px-8 flex justify-between items-center relative">
        <h1 className="text-3xl font-bold text-center flex-1">Quản lý phòng</h1>
        <button className="absolute right-8 text-gray-900 px-4 hover:text-white rounded-lg font-medium text-2xl">
          <i className="fas fa-home"></i>
        </button>
      </div>

      {/* Middle Section */}
      <div className="flex justify-center items-center h-[80%] ">
        <div className="bg-white bg-opacity-40 shadow-lg rounded-lg flex w-3/4 gap-x-4 h-[80%] ">
          {/* First Column */}
          <div className="w-1/3 relative overflow-hidden rounded-l-lg">
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover scale-120 "
              style={{
                backgroundImage: `url(${room})`,
                backgroundPosition: "right",
              }}
            ></div>
          </div>

          {/* Second Column: Buttons */}
          <div className="w-1/3 flex justify-center items-center">
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {" "}
              <button className="flex items-center bg-green-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200">
                <i className="fas fa-lightbulb mr-2"></i> Light
              </button>
              <button className="flex items-center bg-green-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200">
                <i className="fas fa-fan mr-2"></i> Fan
              </button>
              <button className="flex items-center bg-green-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200">
                <i className="fas fa-wifi mr-2"></i> WiFi
              </button>
              <button className="flex items-center bg-green-500 active:bg-red-900 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200">
                <i className="fas fa-plug mr-2"></i> Power
              </button>
            </div>
          </div>

          {/* Third Column: */}
          <div className="w-1/3 flex justify-center items-center ">
            <div className="bg-gray-300 flex flex-col justify-between items-center  h-[90%] w-[90%] bg-opacity-50 py-8">
            <text className="font-medium"> Check In/ Check out</text>
            <i className="fas fa-camera text-9xl text-gray-700"></i>
            <text className="font-medium"> Scan QR code</text>
            <button className="bg-blue-500 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200">
              Check-in/Out
            </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* Bottom Section (similar to MainPage) */}
      {"BOTTOM ELEMENT"}
      <div className="bottom-0 left-0 right-0 text-center text-white py-6 z-10 bg-gray-600 z-10 ">
        <p className="text-xs text-left ml-6 text-gray-300">
          Tổ kỹ thuật P.DT / Technician
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          ĐT (Tel.) : (84-8) 38647256 - 5258
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          Quý Thầy/Cô chưa có tài khoản(hoặc quên mật khẩu) nhà trường vui lòng
          liên hệ Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5 để được
          hỗ trợ.
        </p>
        <p className="text-xs text-left ml-6 text-gray-300 ">
          Email: ddthu@hcmut.edu.vn{" "}
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          (For HCMUT account, please contact to : Data and Information
          Technology Center)
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          Email : dl-cntt@hcmut.edu.vn
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          (For HCMUT account, please contact to : Data and Information
          Technology Center)
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          ĐT (Tel.) : (84-8) 38647256 - 5200
        </p>
      </div>
    </div>
  );
}
