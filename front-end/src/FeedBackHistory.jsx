import React from "react";
import { Link } from "react-router-dom";
import bg from "./assets/Mainpage.jpg";

export default function FeedBackHistory() {
  return (
    <div className="justify-center min-h-screen bg-gray-100">
      {/* Background image with blur */}
      <div
        className="inset-0 bg-cover bg-center fixed"
        style={{
          backgroundImage: `url(${bg})`,
          filter: "blur(3px)",
          zIndex: 1,
        }}
      ></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center p-4 bg-transparent">
          <div className="w-30% h-24 bg-white bg-opacity-15 p-4 shadow-lg rounded-lg border-2 border-gray-400 flex flex-col justify-center mr-8">
            <p className="font-bold text-2xl">Smart Study Space Management &</p>
            <p className="font-bold text-2xl">Reservation System at HCMUT</p>
          </div>
          <div className="flex-grow flex">
            <Link to="/main" className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              Trang chủ
            </Link>
            <Link to="/finding-room" className="ml-4 flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              Tìm phòng
            </Link>
            <Link to="/booking-manager" className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              Quản lý đặt chỗ
            </Link>
            <Link to="/reports" className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              Báo cáo
            </Link>
            <Link to="/support" className="flex-grow bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200">
              Hỗ trợ
            </Link>
            <Link to="/profile" className="bg-black hover:bg-gray-100 hover:text-black text-white py-2 px-8 rounded-2xl transition duration-200 mr-10">
              <i className="fas fa-user"></i>
            </Link>
          </div>
        </div>

        {/* Feedback History Container */}
        <div className="mx-auto p-6 bg-gray-800 bg-opacity-70 rounded-lg shadow-lg max-w-4xl mt-4">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-600">
            <Link to="/feedback-form" className="px-4 py-2 text-white hover:bg-gray-700 rounded-t-lg font-medium ml-2">
              Gửi đánh giá
            </Link>
            <Link to="/feedback-errol" className="px-4 py-2 text-white hover:bg-gray-700 rounded-t-lg font-medium ml-2">
              Báo lỗi thiết bị
            </Link>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-t-lg font-medium ml-2">
              Lịch sử phản hồi
            </button>
          </div>

          {/* Feedback items */} {/* add history api vào sau */}
          <div className="space-y-4">
            <div className="bg-black bg-opacity-30 rounded p-4 border border-gray-600 text-white">
              <h3 className="font-semibold">Đánh giá H1 - 201</h3>
              <div className="text-yellow-400 mt-1 text-xl">★★★★★</div>
              <p className="mt-2">Không gian yên tĩnh, rộng rãi.</p>
              <span className="inline-block mt-2 px-3 py-1 text-sm bg-green-600 rounded-full">
                Đã được xử lý
              </span>
            </div>

            <div className="bg-black bg-opacity-30 rounded p-4 border border-gray-600 text-white">
              <h3 className="font-semibold">Báo Lỗi H1 - 212</h3>
              <p className="text-sm mt-1">Loại lỗi: Máy tính</p>
              <p className="text-sm">Mô tả: Không mở nguồn lên</p>
              <span className="inline-block mt-2 px-3 py-1 text-sm bg-yellow-500 text-black rounded-full">
                Đang chờ xử lý
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bottom-0 left-0 right-0 text-center text-white z-10 bg-gray-600 mt-12">
          <br />
          <p className="text-xs text-left ml-6 text-gray-300">Tổ kỹ thuật P.DT / Technician</p>
          <p className="text-xs text-left ml-6 text-gray-300">Email : ddthu@hcmut.edu.vn</p>
          <p className="text-xs text-left ml-6 text-gray-300">ĐT (Tel.) : (84-8) 38647256 - 5258</p>
          <p className="text-xs text-left ml-6 text-gray-300">
            Quý Thầy/Cô chưa có tài khoản(hoặc quên mật khẩu) nhà trường vui lòng liên hệ Trung tâm Dữ liệu & Công nghệ
            Thông tin, phòng 109A5 để được hỗ trợ.
          </p>
          <p className="text-xs text-left ml-6 text-gray-300">
            (For HCMUT account, please contact to : Data and Information Technology Center)
          </p>
          <p className="text-xs text-left ml-6 text-gray-300">Email : dl-cntt@hcmut.edu.vn</p>
          <p className="text-xs text-left ml-6 text-gray-300">ĐT (Tel.) : (84-8) 38647256 - 5200</p>
        </div>
      </div>
    </div>
  );
}
