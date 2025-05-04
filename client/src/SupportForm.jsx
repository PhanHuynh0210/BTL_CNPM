import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import bg from "./assets/Mainpage.jpg";

export default function SupportForm() {
  const navigate = useNavigate();
  const [supportType, setSupportType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("faq");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(data.data);
        } else {
          toast.error("Không thể lấy thông tin người dùng");
        }
      } catch (error) {
        toast.error("Lỗi kết nối. Vui lòng kiểm tra kết nối mạng.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supportType || !title || !description) {
      return toast.error("Vui lòng điền đầy đủ thông tin.");
    }

    if (!contactMethod) {
      return toast.error("Vui lòng chọn phương thức liên hệ.");
    }

    if (!userData) {
      return toast.error("Không thể lấy thông tin người dùng.");
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để gửi yêu cầu hỗ trợ");
      navigate("/");
      return;
    }

    try {
      const mssv = userData?.mssv;
      if (!mssv) return toast.error("Không tìm thấy mã số sinh viên");

      const contactInfo =
        contactMethod === "email" ? userData?.email : userData?.phone;

      const payload = {
        mssv,
        support_type: supportType,
        title: title.trim(),
        description: description.trim(),
        contact_info: contactInfo,
      };

      const res = await fetch("http://localhost:8080/api/v1/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Yêu cầu hỗ trợ đã được gửi thành công!");
        navigate("/SupportSuccess");
      } else {
        toast.error(data.message || "Không thể gửi yêu cầu hỗ trợ. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error submitting support request:", error);
      toast.error("Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại.");
    }
  };

  const faqList = [
    {
      question: "Làm sao để đặt chỗ học tập?",
      answer: "Bạn có thể đặt phòng ngay lập tức tại trang chủ hoặc vào tìm phòng để có thể đặt phòng từ trước.",
    },
    {
      question: "Tôi có thể hủy đặt chỗ không?",
      answer: "Có thể hủy đặt chỗ, vào trang quản lý đặt chỗ bấm hủy.",
    },
    {
      question: "Tôi có thể đặt chỗ trong bao lâu?",
      answer: "Từ 1 đến 3 tiếng.",
    },
    {
      question: "Làm thế nào có thể báo cáo vấn đề về thiết bị trong phòng học",
      answer: "Bấm vào phần liên hệ hỗ trợ sau đó chọn thiết bị rồi mô tả vấn đề.",
    },
    {
      question: "Tôi có thể đặt chỗ cho nhóm học tập hay không?",
      answer: "Có thể, số lượng người trong nhóm có thể đăng ký đã được set cho từng phòng.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, filter: "blur(3px)", zIndex: 0 }}
      ></div>

      <div className="relative z-10 flex w-full max-w-6xl p-8 bg-white/90 rounded-2xl shadow-xl space-x-6">
        {/* Cột form chính */}
        <div className="flex-1">
          <div className="flex justify-center mb-6">
            <h2 className="text-2xl font-bold text-blue-700">Gửi yêu cầu hỗ trợ</h2>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              className={`w-1/2 py-3 text-center rounded-lg ${activeTab === "faq" ? "bg-blue-500 text-white" : "bg-gray-200 text-blue-500"}`}
              onClick={() => setActiveTab("faq")}
            >
              Câu hỏi thường gặp
            </button>
            <button
              className={`w-1/2 py-3 text-center rounded-lg ${activeTab === "support" ? "bg-blue-500 text-white" : "bg-gray-200 text-blue-500"}`}
              onClick={() => setActiveTab("support")}
            >
              Liên hệ hỗ trợ
            </button>
          </div>

          {activeTab === "faq" && (
            <div className="p-6">
              <h3 className="font-semibold text-lg">Câu hỏi thường gặp</h3>
              <div className="mt-4 space-y-4">
                {faqList.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <button
                      onClick={() =>
                        setOpenFaqIndex(openFaqIndex === index ? null : index)
                      }
                      className="text-left w-full font-medium text-blue-600 hover:underline"
                    >
                      {faq.question}
                    </button>
                    {openFaqIndex === index && (
                      <p className="mt-2 text-gray-700">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div>
                <label className="block font-semibold mb-2">Loại hỗ trợ:</label>
                <select
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={supportType}
                  onChange={(e) => setSupportType(e.target.value)}
                >
                  <option value="">-- Chọn loại hỗ trợ --</option>
                  <option value="Thiết bị">Thiết bị</option>
                  <option value="Hệ thống">Hệ thống</option>
                  <option value="Phòng học">Phòng học</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Tiêu đề yêu cầu (cần nêu rõ phòng):</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề yêu cầu"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Mô tả yêu cầu:</label>
                <textarea
                  className="w-full p-3 border rounded-lg bg-gray-50 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả chi tiết về yêu cầu hỗ trợ"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-2">Phương thức liên hệ:</label>
                <select
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                >
                  <option value="">-- Chọn phương thức liên hệ --</option>
                  <option value="email">Email</option>
                  <option value="phone">Số điện thoại</option>
                </select>
              </div>

              {contactMethod && (
                <div>
                  <label className="block font-semibold mb-2">
                    {contactMethod === "email" ? "Email" : "Số điện thoại"} của bạn:
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={contactMethod === "email" ? userData?.email : userData?.phone}
                    readOnly
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-200"
              >
                Gửi yêu cầu hỗ trợ
              </button>
            </form>
          )}

        {/* Nút về trang chủ */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/main")}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition font-medium shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Quay lại trang chủ
          </button>
        </div>
        </div>
          
        {/* Cột thông tin hỗ trợ */}
        <div className="w-64 bg-blue-50 rounded-xl p-4 border border-blue-200 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Thông tin hỗ trợ</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li><strong>Email:</strong> support@hust.edu.vn</li>
            <li><strong>Hotline:</strong> 1900 123 456</li>
            <li><strong>Thời gian:</strong> 08:00 - 17:00 (T2 - T6)</li>
            <li><strong>Địa chỉ:</strong> Phòng 101, Tòa A1, Đại học Bách Khoa TPHCM</li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}
