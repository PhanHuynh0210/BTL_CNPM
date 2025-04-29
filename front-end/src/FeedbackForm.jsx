import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import bg from "./assets/Mainpage.jpg";

export default function FeedbackForm() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchRooms();
  }, [navigate]);

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/allroom");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.data || []);
      } else {
        toast.error("Không thể tải danh sách phòng");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Lỗi khi tải danh sách phòng");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocation) return toast.error("Vui lòng chọn vị trí");
    if (rating === 0) return toast.error("Vui lòng đánh giá mức độ hài lòng");

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để gửi đánh giá");
      navigate("/");
      return;
    }

    try {
      const userResponse = await fetch("http://localhost:8080/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userResponse.ok) {
        toast.error("Không thể lấy thông tin người dùng");
        return;
      }

      const userData = await userResponse.json();
      const mssv = userData.data?.mssv;

      if (!mssv) return toast.error("Không tìm thấy mã số sinh viên");

      const payload = {
        mssv,
        roomId: selectedLocation,
        rating: Number(rating),
        comment: comment.trim(),
      };

      const res = await fetch("http://localhost:8080/api/v1/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Cảm ơn bạn đã gửi đánh giá!");
        navigate("/FeedbackSuccess");
      } else {
        toast.error(data.message || "Không thể gửi đánh giá. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg})`, filter: "blur(3px)", zIndex: 0 }}></div>

      <div className="relative z-10 w-full max-w-2xl p-8 bg-white/90 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Gửi đánh giá trải nghiệm</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Vị trí:</label>
            <select
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">-- Chọn vị trí --</option>
              {rooms.map((room) => (
                <option key={room.room_id} value={room.room_id}>
                  {room.building} - Phòng {room.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Mức độ hài lòng:</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition-colors ${
                    star <= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Nhận xét:</label>
            <textarea
              className="w-full p-3 border rounded-lg bg-gray-50 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Thêm nhận xét của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-200"
          >
            Gửi đánh giá
          </button>
        </form>

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
    </div>
  );
}