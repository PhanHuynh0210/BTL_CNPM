import React, { useState } from "react";
import bg from "./assets/bg.png";

const Question = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [openIndex, setOpenIndex] = useState(null);

  const questions = [
    {
      question: "Làm thế nào để đặt chỗ học tập?",
      answer: "Bạn có thể đăng nhập vào hệ thống, chọn phòng trống và nhấn 'Đặt chỗ ngay'."
    },
    {
      question: "Tôi có thể huỷ đặt chỗ không?",
      answer: "Có, bạn có thể huỷ trong phần 'Quản lý đặt chỗ' trước thời gian sử dụng."
    },
    {
      question: "Tôi có thể đặt chỗ trong bao lâu?",
      answer: "Thời lượng tối đa cho mỗi lần đặt chỗ là 2 giờ."
    },
    {
      question: "Làm thế nào để báo cáo vấn đề về thiết bị trong phòng học?",
      answer: "Bạn có thể vào mục 'Báo lỗi thiết bị' và điền thông tin sự cố."
    },
    {
      question: "Tôi có thể đặt chỗ cho nhóm học tập không?",
      answer: "Có, hệ thống hỗ trợ phòng nhóm. Chọn loại phòng 'Nhóm' khi đặt chỗ."
    }
  ];

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
      {/* Content */}
      <div className="relative z-10 px-6 py-10">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg p-6">

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-400">
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "faq"
                  ? "border-b-4 border-blue-500 text-white"
                  : "text-gray-300"
              }`}
              onClick={() => setActiveTab("faq")}
            >
              Câu hỏi thường gặp
            </button>
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "support"
                  ? "border-b-4 border-blue-500 text-white"
                  : "text-gray-300"
              }`}
              onClick={() => setActiveTab("support")}
            >
              Liên hệ hỗ trợ
            </button>
          </div>

          {/* FAQ Content */}
          {activeTab === "faq" && (
            <ul className="space-y-4 text-white">
              {questions.map((item, idx) => (
                <li
                  key={idx}
                  className="border border-white border-opacity-60 rounded-lg p-4 transition duration-200 cursor-pointer hover:bg-white hover:bg-opacity-10"
                  onClick={() => toggleOpen(idx)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{item.question}</span>
                    <span>{openIndex === idx ? "−" : "+"}</span>
                  </div>
                  {openIndex === idx && (
                    <p className="mt-3 text-sm text-gray-200">{item.answer}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Support Info */}
          {activeTab === "support" && (
            <div className="text-white">
              <p>Vui lòng liên hệ: <strong>ddthu@hcmut.edu.vn</strong></p>
              <p>Điện thoại: (84-8) 38647256 - 5258</p>
              <p>Phòng 109A5, Trung tâm Dữ liệu & Công nghệ Thông tin</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full bg-gray-800 bg-opacity-80 text-gray-300 text-xs p-4">
        <div className="max-w-4xl mx-auto">
          <p>Tổ kỹ thuật P.ĐT / Technician</p>
          <p>Email: ddthu@hcmut.edu.vn</p>
          <p>ĐT (Tel.): (84-8) 38647256 - 5258</p>
          <p>
            Quý Thầy/Cô chưa có tài khoản (hoặc quên mật khẩu) vui lòng liên hệ
            Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5 để được hỗ trợ.
          </p>
          <p>Email: dl-cntt@hcmut.edu.vn</p>
          <p>ĐT (Tel.): (84-8) 38647256 - 5200</p>
        </div>
      </div>
        </div>
    </div>
  );
};

export default Question;
