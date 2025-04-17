import React, { useState } from "react";
import bg from "./assets/bg.png";


const SupportForm = () => {
  const [Support, setFormData] = useState({
    support_type: "",
    title: "",
    description: "",
    mssv: "",
    contact_info: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...Support, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi đánh giá
    setShowSuccess(true);

    // Gửi dữ liệu đến backend ở đây
    console.log("Form submitted:", Support);
    
    // Sau 3 giây, ẩn thông báo thành công
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${bg})`,
          filter: "brightness(60%)",
        }}
      ></div>

      {/* Form container */}
      <div className="relative z-10 px-6 py-10">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Liên hệ hỗ trợ</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Support Type */}
            <div>
              <label className="block mb-1">Loại hỗ trợ</label>
              <select
                name="supportType"
                value={Support.support_type}
                onChange={handleChange}
                className="w-full bg-transparent border border-white rounded p-2 text-white"
              >
                <option value="">-- Chọn loại hỗ trợ --</option>
                <option value="booking">Đặt chỗ</option>
                <option value="equipment">Thiết bị</option>
                <option value="account">Tài khoản</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block mb-1">Tiêu đề</label>
              <input
                type="text"
                name="title"
                value={Support.title}
                onChange={handleChange}
                className="w-full bg-transparent border border-white rounded p-2 text-white"
                placeholder="Nhập tiêu đề"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1">Mô tả chi tiết</label>
              <textarea
                name="description"
                value={Support.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-transparent border border-white rounded p-2 text-white"
                placeholder="Nhập nội dung mô tả"
              />
            </div>

            {/* Contact Method */}
            <div>
              <label className="block mb-1">Phương thức liên hệ</label>
              <input
                type="text"
                name="contactMethod"
                value={Support.contact_info}
                onChange={handleChange}
                className="w-full bg-transparent border border-white rounded p-2 text-white"
                placeholder="Email hoặc số điện thoại"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow"
              >
                Gửi yêu cầu hỗ trợ
              </button>
            </div>

            {/* Success Popup */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-blue-500 text-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold">Thành công</h2>
            </div>
          </div>
        )}
          </form>
        </div>
      </div>

      {/* Footer giống các trang khác */}
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
  );
};

export default SupportForm;
