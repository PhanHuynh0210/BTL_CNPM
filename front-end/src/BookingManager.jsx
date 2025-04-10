import React from "react";
import bg from "./assets/Mainpage.jpg";

export default function BookingManager() {
  return (
    <div className="h-screen w-screen relative">
      {/* Background */}
      <div
        className="h-screen w-screen absolute bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, filter: "blur(3px)", zIndex: -1 }}
      ></div>

      {/* Top Bar */}
      <div className="relative p-4 z-10">
        <div className="flex flex-grow items-center space-x-4 mb-4">
          <div className="w-30% h-24 bg-white bg-opacity-15 p-4 shadow-lg rounded-lg border-2 border-gray-400 flex flex-col justify-center mr-8">
            <p className="font-bold text-2xl">Smart Study Space Management &</p>
            <p className="font-bold text-2xl">Reservation System at HCMUT</p>
          </div>
          <div className="flex-grow flex">
            <button className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              Trang chủ
            </button>
            <button className="ml-4 flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              Tìm chỗ
            </button>
            <button className="flex-grow bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200">
              Quản lý đặt chỗ
            </button>
            <button className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              Báo cáo
            </button>
            <button className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              Hỗ trợ
            </button>
            <button className="bg-black hover:bg-gray-100 hover:text-black text-white py-2 px-8 rounded-2xl transition duration-200 mr-10">
              <i className="fas fa-user"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Middle  */}
      <div className="flex justify-center items-center h-[80%]">
        <div className="bg-gray-200 bg-opacity-60 shadow-lg rounded-lg w-3/4 h-[80%] p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Quản lý đặt chỗ</h2>
          <div className="overflow-hidden rounded-2xl font-medium">
            <table className="table-auto w-full rounded-lg">
              <thead>
                <tr className="bg-blue-500">
                  <th className="px-4 py-2 text-left">Thời điểm</th>
            
                  <th className="px-4 py-2 text-left">Check In</th>
                  <th className="px-4 py-2 text-left">Thông tin</th>
                </tr>
              </thead>
              <tbody>
                {/* temp */}
                <tr className="rounded-lg my-2">
                  <td className="px-4 py-2">01/01/2023 10:00</td>

                  <td className="px-4 py-2 text-green-500">Đã xác nhận</td>
                  <td className="px-4 py-2">
                    <button className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded">
                      Chi tiết
                    </button>
                  </td>
                </tr>
                <tr className="rounded-lg my-2">
                  <td className="px-4 py-2">02/01/2023 14:00</td>

                  <td className="px-4 py-2 text-black-500">Chưa</td>
                  <td className="px-4 py-2">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded">
                      Chi tiết
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom  */}
      <div className="bottom-0 left-0 right-0 text-center text-white py-6 z-10 bg-gray-600">
        <p className="text-xs text-left ml-6 text-gray-300">
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
        <p className="text-xs text-left ml-6 text-gray-300">
          Email: ddthu@hcmut.edu.vn
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          (For HCMUT account, please contact to : Data and Information
          Technology Center)
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          Email : dl-cntt@hcmut.edu.vn
        </p>
        <p className="text-xs text-left ml-6 text-gray-300">
          ĐT (Tel.) : (84-8) 38647256 - 5200
        </p>
      </div>
    </div>
  );
}