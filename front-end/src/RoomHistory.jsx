import React from "react";
import bg from "./assets/Mainpage.jpg";

export default function RoomHistory() {
  return (
    <div
      className="h-screen w-screen relative"><div className="h-screen w-screen absolute bg-cover bg-center "
      style={{ backgroundImage: `url(${bg})`, filter: "blur(3px)", zIndex: -1 }}
      >
      </div>
      {/* Top Bar */}
      <div className="bg-gray-500 text-white py-4 px-8 flex justify-between items-center relative">
        <h1 className="text-3xl font-bold text-center flex-1">Lịch sử đặt phòng</h1>
        <button className="absolute right-8 text-gray-900 px-4 hover:text-white rounded-lg font-medium text-2xl">
          <i className="fas fa-home"></i>
        </button>
      </div>

      {/* Middle Section */}
      <div className="flex justify-center items-center h-[80%]">
        <div className="bg-gray-200 bg-opacity-60 shadow-lg rounded-lg w-3/4 h-[80%] p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Lịch sử đặt phòng</h2>
          <div className="overflow-hidden rounded-2xl font-medium">
          <table className="table-auto w-full rounded-lg ">
            <thead >
              <tr className=" bg-blue-500">
                <th className="px-4 py-2 text-left">Thời điểm</th>
                <th className="px-4 py-2 text-left">Tòa</th>
                <th className="px-4 py-2 text-left">Tầng-Phòng</th>
                <th className="px-4 py-2 text-left">Thời gian</th>
              </tr>
            </thead>
            <tbody className="">
              {/* Example rows */}
              <tr className=" rounded-lg my-2">
                <td className="px-4 py-2 ">01/01/2023 10:00</td>
                <td className="px-4 py-2">A</td>
                <td className="px-4 py-2">3-305</td>
                <td className="px-4 py-2">2 giờ</td>
              </tr>
              <tr className=" rounded-lg my-2">
                <td className="px-4 py-2">02/01/2023 14:00</td>
                <td className="px-4 py-2">B</td>
                <td className="px-4 py-2">2-202</td>
                <td className="px-4 py-2">3 giờ</td>
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