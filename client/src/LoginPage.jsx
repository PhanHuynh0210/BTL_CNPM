import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/HCMUT.png";
import bg from "./assets/bg.png"; 

const LoginPage = () => {
  const navigate = useNavigate();

  const Logintype = () => {
    // Chuyển sang nhập tài khoản mật khẩu
    navigate("/logininfo");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          filter: 'blur(3px)',
          zIndex: 1,
        }}
      ></div>
<div className="relative flex flex-col bg-white bg-opacity-80 
p-12 shadow-2xl w-full max-w-lg z-10 mb-4 rounded-3xl border-2 border-gray-600">        
<h2 className="text-5xl font-semibold text-center mb-6">Đăng nhập </h2>
        <img
          src={logo}
          alt="Logo HCMUT"
          className="mx-auto mb-4 w-24 h-24 object-cover"
        />
        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full relative z-10">
        <p className="text-lg font-bold mb-8 text-center">Đăng nhập bằng tài khoản của bạn:</p>
        <button
          onClick={Logintype}
          className=" mb-4 w-full bg-gray-300 hover:bg-blue-700 text-black py-2 px-4 rounded-lg font-medium transition duration-200"
        >
        <img
          src={logo}
          alt="Logo HCMUT"
          className="w-6 h-6 object-cover inline-block absolute left-20"
        />
            Tài khoản HCMUT</button>
        <button
          onClick={Logintype}
          className="w-full bg-gray-300 hover:bg-blue-700 text-black py-2 px-4 rounded-lg font-medium transition duration-200"
        >Quản trị viên</button>
        </div>
        
        
      </div>
      <div className="absolute bottom-0 left-0 right-0 text-center text-white z-10 bg-gray-600 ">
            <p className="text-xs text-left ml-6 text-gray-300 mt-2">Tổ kỹ thuật P.DT / Technician</p>
            <p className="text-xs text-left ml-6 text-gray-300">ĐT (Tel.) : (84-8) 38647256 - 5258</p>
            <p className="text-xs text-left ml-6 text-gray-300">Quý Thầy/Cô chưa có tài khoản(hoặc quên mật khẩu) nhà trường vui lòng liên hệ Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5 để được hỗ trợ.</p>
            <p className="text-xs text-left ml-6 text-gray-300 ">Email: ddthu@hcmut.edu.vn </p>
            <p className="text-xs text-left ml-6 text-gray-300">(For HCMUT account, please contact to : Data and Information Technology Center)</p>
            <p className="text-xs text-left ml-6 text-gray-300">Email : dl-cntt@hcmut.edu.vn</p>
            <p className="text-xs text-left ml-6 text-gray-300">(For HCMUT account, please contact to : Data and Information Technology Center)</p>
            <p className="text-xs text-left ml-6 text-gray-300">ĐT (Tel.) : (84-8) 38647256 - 5200</p>

            </div>
    </div>
    
  );
};

export default LoginPage;