import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "./assets/Mainpage.jpg";
import toast from 'react-hot-toast';

export default function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/");
        return;
      }
    
      try {
        const response = await fetch("http://localhost:8080/api/v1/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const result = await response.json();
        
        if (response.ok && result.success) {
          setUserData(result.data); // Chỉ lưu trữ phần data
        } else {
          toast.error(result.message || "Không thể tải thông tin người dùng");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Lỗi khi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-white text-2xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background image with blur */}
      <div
        className="inset-0 bg-cover bg-center fixed"
        style={{
          backgroundImage: `url(${bg})`,
          filter: "blur(3px)",
          zIndex: -1,
        }}
      ></div>
      
      {/* Header */}
      <div className="bg-gray-500 bg-opacity-70 py-4 px-6 flex justify-between items-center">
        <div className="w-1/3"></div>
        <h1 className="text-4xl font-bold text-white text-center w-1/3">Hồ sơ</h1>
        <div className="w-1/3 flex justify-end">
          <Link
            to="/main"
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-md"
          >
            <i className="fas fa-home text-xl"></i>
          </Link>
        </div>
      </div>
      
      {/* Profile card */}
      <div className="flex justify-center items-center h-[calc(100vh-180px)]">
        <div className="bg-gray-200 bg-opacity-80 rounded-lg p-8 w-full max-w-md shadow-lg">
          {/* Profile image */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            </div>
          </div>
          
          {/* User info */}
          <div className="text-center text-gray-800">
          <p className="mb-2"><strong>Họ và Tên:</strong> {userData?.fullName || 'N/A'}</p>
          <p className="mb-2"><strong>MSSV:</strong> {userData?.mssv || 'N/A'}</p>
          <p className="mb-2"><strong>Giới tính:</strong> {userData?.sex || 'N/A'}</p>
          <p className="mb-2"><strong>Gmail:</strong> {userData?.email || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-600 text-white py-2 absolute bottom-0 w-full">
        <div className="container mx-auto px-6">
          <p className="text-xs text-gray-300">Tổ kỹ thuật P.DT / Technician</p>
          <p className="text-xs text-gray-300">Email : ddthu@hcmut.edu.vn</p>
          <p className="text-xs text-gray-300">ĐT (Tel.) : (84-8) 38647256 - 5258</p>
          <p className="text-xs text-gray-300">Quý Thầy/Cô chưa có tài khoản(hoặc quên mật khẩu) nhà trường vui lòng liên hệ Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5 để được hỗ trợ.</p>
          <p className="text-xs text-gray-300">(For HCMUT account, please contact to : Data and Information Technology Center)</p>
          <p className="text-xs text-gray-300">Email : dl-cntt@hcmut.edu.vn</p>
          <p className="text-xs text-gray-300">ĐT (Tel.) : (84-8) 38647256 - 5200</p>
        </div>
      </div>
    </div>
  );
}