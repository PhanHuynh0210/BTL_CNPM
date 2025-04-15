import React from "react";
import bg from "./assets/Mainpage.jpg";


function RoomBox() {//tạm thời
  return (
    <div className="min-w-[280px] max-w-[600px] bg-gray-800 bg-opacity-80 p-4 shadow-lg rounded-lg grid grid-cols-2 font-medium h-48">
  <div className="text-white col-span-1 grid grid-rows-6">
    <p className="row-span-1 font-medium">Phòng 334 - H1</p>
    <p>Tầng 3</p>
    <p className="bg-green-300 text-black text-center w-12 rounded">Trống</p>
    <p>Loại: Đơn</p>
    <p>Còn trống: 3 vị trí</p>
    <p>Thiết bị: Ổ cắm</p>
  </div>
  <div className="flex justify-center items-center">
    <button className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-6 font-medium transition duration-200 h-[66px]">
      Đặt chỗ ngay
    </button>
  </div>
</div>

  );
}



export default function MainPage() {
  return (
    <div className="min-w-[720px] justify-center min-h-screen bg-gray-100">
      <div
        className="inset-0 bg-cover bg-center absolute"
        style={{
          backgroundImage: `url(${bg})`,
          filter: "blur(0px)",
          zIndex: 1,
        }}
      ></div>
      <div className=" relative p-4 z-10">
        <div className="flex flex-grow items-center space-x-4 mb-4">
          <div className="w-full max-w-[480px] h-auto bg-white bg-opacity-15 p-4 shadow-lg rounded-lg border-2 border-gray-400 flex flex-col flex-grow justify-center mr-8 overflow-hidden break-words">
            {/*  top left box */}
            <p className="font-bold text-2xl">Smart Study Space Management &</p>
            <p className="font-bold text-2xl">Reservation System at HCMUT</p>
          </div>
          <div className="flex-grow flex">
            <button className="flex-grow bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200">
              {" "}
              Trang chủ
            </button>
            <button className="ml-4 flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              {" "}
              Tìm chỗ
            </button>
            <button className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              {" "}
              Quản lý đặt chỗ
            </button>
            <button className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              {" "}
              Báo cáo
            </button>
            <button className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              {" "}
              Hỗ trợ
            </button>
            <button className=" bg-black hover:bg-gray-100 hover:text-black text-white py-2 px-8 rounded-2xl transition duration-200 mr-10">
              <i className="fas fa-user"></i>
            </button>
          </div>
        </div>

        {/* Wrapper cho các box */}
{/* Hàng 1: 2 box */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 mt-16 ">
  {/* Hộp kiểm soát */}
  <div className="min-w-[280px] max-w-[600px] bg-gray-800 bg-opacity-80 p-4 shadow-lg rounded-lg h-48">
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full ">
      <p className="text-white text-center text-lg flex items-center justify-center col-span-1 row-span-1 font-medium">
        Số phòng trống
        <br />
        100
      </p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 col-span-1 row-span-1">
        Quản lý phòng
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 col-span-1 row-span-1">
        Đặt chỗ của tôi
        <br />4
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 col-span-1 row-span-1">
        Lịch sử đặt chỗ
      </button>
    </div>
  </div>

  {/* Hộp phòng 1 */}
  <RoomBox />
</div>

{/* Hàng 2: 3 hộp */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 mt-8">
  {[1, 2, 3].map((_, idx) => (
    <RoomBox key={idx} />
  ))}
</div>

       
      </div>
{/* Bot */}
      <div className="bottom-0 left-0 right-0 text-center text-white z-10 bg-gray-600 z-10 ">
        <br />
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
}
