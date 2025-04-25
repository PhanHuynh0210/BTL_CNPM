import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "./assets/Mainpage.jpg";

export default function FeedbackSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  
  // Tự động chuyển hướng sau 3 giây
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/FeedbackForm");
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);
  
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
              className="flex-grow bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
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
        
      {/* Success Message - Cập nhật để hiển thị đếm ngược */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-blue-500 text-white p-12 rounded-lg shadow-lg text-center w-96">
          <h2 className="text-3xl font-bold mb-4">Thành công!</h2>
          <p className="text-lg">Cảm ơn bạn đã gửi đánh giá</p>
          <p className="mt-4">Quay lại trang đánh giá sau {countdown} giây...</p>
          <button 
            onClick={() => navigate("/FeedbackForm")} 
            className="mt-4 bg-white text-blue-500 px-4 py-2 rounded-md font-medium hover:bg-gray-100"
          >
            Quay lại ngay
          </button>
        </div>
      </div>
        
        {/* Feedback Form Container (blurred in background) */}
        <div className="mx-auto p-6 bg-gray-800 bg-opacity-70 rounded-lg shadow-lg max-w-4xl mt-4 filter blur-sm">
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
          
          {/* Form (blurred) */}
          <form className="space-y-6">
            {/* Location */}
            <div>
              <label className="block text-white mb-2">Vị trí:</label>
              <select
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
                disabled
              >
                <option value="">-- Chọn vị trí --</option>
              </select>
            </div>
            
            {/* Rating */}
            <div>
              <label className="block text-white mb-2">Mức độ hài lòng</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-3xl">☆</span>
                ))}
              </div>
            </div>
            
            {/* Comment */}
            <div>
              <label className="block text-white mb-2">Nhận xét</label>
              <textarea
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md h-32"
                placeholder="Thêm nhận xét của bạn...."
                disabled
              ></textarea>
            </div>
            
            {/* Submit Button */}
            <div>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md"
                disabled
              >
                Gửi đánh giá
              </button>
            </div>
          </form>
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
  );
}