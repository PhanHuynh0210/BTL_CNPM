import { useNavigate } from "react-router-dom";
import bg from "./assets/bg.png";
import { useState } from "react";

const LoginPage = () => {
 const navigate = useNavigate();
 const [username, setUsername] = useState(""); 
 const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    const res = await fetch("http://localhost:8080/api/v1/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password
      }),
    });
    if(!res.ok) {console.log("Login Failed");
    setErrorMessage("Sai tài khoản hoặc mật khẩu!"); // Hiển thị thông báo lỗi
    return; // Dừng lại ở đây nếu lỗi

    }    
    const data = await res.json();
    if(res.ok){
    console.log(data);
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_info", JSON.stringify(data.user));
    navigate("/main");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          filter: "blur(0px)",
          zIndex: 1,
        }}
      ></div>
      <div
        className="relative flex flex-col bg-white bg-opacity-80 
p-12 shadow-2xl w-full max-w-lg z-10 mb-4 rounded-3xl border-2 border-gray-600"
      >
        <h2 className="text-5xl font-semibold text-center mb-6">Đăng nhập </h2>
        {errorMessage && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
            {errorMessage} {/* Hiển thị thông báo lỗi */}
          </div>
        )}

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
                value={username}
                onChange={(e) => setUsername(e.target.value)}

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
              onClick={handleLogin}
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
