import React, { useState } from "react";
import { Link } from "react-router-dom";
import bg from "./assets/Mainpage.jpg";

export default function FeedbackErrol() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [Errol, setErrol] = useState(0);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi đánh giá
    setShowSuccess(true);
    
    // Sau 3 giây, ẩn thông báo thành công
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
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
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center p-4 bg-transparent">
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
              className="ml-4 flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200"
            >
              {" "}
              Tìm phòng
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
              className="flex-grow bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
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
        
        {/* Feedback Form Container */}
        <div className="mx-auto p-6 bg-gray-800 bg-opacity-70 rounded-lg shadow-lg max-w-4xl mt-4">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-600">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-t-lg font-medium">
              Gửi đánh giá
            </button>
            <button className="px-4 py-2 text-white hover:bg-gray-700 rounded-t-lg font-medium ml-2">
              Báo lỗi thiết bị
            </button>
            <button className="px-4 py-2 text-white hover:bg-gray-700 rounded-t-lg font-medium ml-2">
              Lịch sử phản hồi
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <div>
              <label className="block text-white mb-2">Vị trí:</label>
              <select
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">-- Chọn vị trí --</option>
                <option value="h1-334-1">H1 - Phòng 334 - Vị trí 1</option>
                <option value="h1-334-2">H1 - Phòng 334 - Vị trí 2</option>
                <option value="h1-334-3">H1 - Phòng 334 - Vị trí 3</option>
              </select>
            </div>
            
            {/* Errol */}
            <div>
              <label className="block text-white mb-2">Errol</label>
            <select
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
                value={Errol}
                onChange={(e) => setErrol(e.target.value)}
                >
                    <option value="">-- Chọn Lỗi --</option>
                    <option value=""></option>
                    <option value=""></option>
                </select>
            </div>
            
            {/* Comment */}
            <div>
              <label className="block text-white mb-2">Nhận xét</label>
              <textarea
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md h-32"
                placeholder="Thêm nhận xét của bạn...."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md"
              >
                Gửi đánh giá
              </button>
            </div>
          </form>
        </div>
        
        {/* Success Popup */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-blue-500 text-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold">Thành công</h2>
            </div>
          </div>
        )}
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
  );
}