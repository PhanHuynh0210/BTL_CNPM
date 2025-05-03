import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./assets/Mainpage.jpg";

export default function SupportSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  // Đếm ngược và tự động điều hướng
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/supportform");
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background blur */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          filter: "blur(3px)",
          zIndex: 0,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 bg-white/90 p-10 rounded-2xl shadow-xl text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Gửi yêu cầu thành công!
        </h1>
        <p className="text-gray-700 mb-4">
          Cảm ơn bạn đã gửi yêu cầu hỗ trợ. Bạn sẽ được chuyển hướng sau {countdown} giây...
        </p>
        <button
          onClick={() => navigate("/supportform")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200"
        >
          Quay lại ngay
        </button>
      </div>
    </div>
  );
}
