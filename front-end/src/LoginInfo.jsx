import React from "react";
import { useNavigate } from "react-router-dom";
import bg from "./assets/bg.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Giả lập đăng nhập thành công, sau này thay bằng gọi API HCMUT_SSO
    navigate("/main");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          filter: "blur(3px)",
          zIndex: 1,
        }}
      ></div>
      <div
        className="relative flex flex-col bg-white bg-opacity-80 
p-12 shadow-2xl w-full max-w-lg z-10 mb-4 rounded-3xl border-2 border-gray-600"
      >
        <h2 className="text-5xl font-semibold text-center mb-6">Đăng nhập </h2>

        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full relative z-10">
          <div className="bg-gray-500"></div>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
              onClick={(e) => {
                e.preventDefault(); // Ngăn chặn hành vi mặc định của form
                handleLogin();
              }}
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 text-center text-white z-10 bg-gray-600 ">
        <p className="text-xs text-left ml-6 text-gray-300 mt-2">
          Tổ kỹ thuật P.DT / Technician
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          ĐT (Tel.) : (84-8) 38647256 - 5258
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          Quý Thầy/Cô chưa có tài khoản(hoặc quên mật khẩu) nhà trường vui lòng
          liên hệ Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5 để được
          hỗ trợ.
        </p>
        <p className="text-xs text-left ml-6 text-gray-300 ">
          Email: ddthu@hcmut.edu.vn{" "}
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          (For HCMUT account, please contact to : Data and Information
          Technology Center)
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          Email : dl-cntt@hcmut.edu.vn
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          (For HCMUT account, please contact to : Data and Information
          Technology Center)
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          ĐT (Tel.) : (84-8) 38647256 - 5200
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
