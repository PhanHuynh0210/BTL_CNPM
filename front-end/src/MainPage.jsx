import React, { useEffect, useState } from "react";
import bg from "./assets/Mainpage.jpg";
import { useNavigate } from "react-router-dom";

function RoomBox({ data }) {
  const handleBookNow = async () => {
    const token = localStorage.getItem("access_token");
    const student_info = JSON.parse(localStorage.getItem("user_info"));
    if (!token || !student_info) {
      alert("Bạn cần đăng nhập để đặt chỗ.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/booking/book-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          roomId: data.room_id
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Đặt chỗ thành công!");
      } else {
        alert(`Lỗi: ${result.message || "Không thể đặt chỗ"}`);
      }
    } catch (err) {
      console.error("Đặt chỗ thất bại:", err.message);
      alert("Đặt chỗ thất bại.");
    }
  };
  //tạm thời
  if (!data) return null;
  return (
    <div className="min-w-[150px] max-w-[600px] bg-gray-800 bg-opacity-80 p-4 shadow-lg rounded-lg grid grid-cols-2 font-medium h-48">
      <div className="text-white col-span-1 grid grid-rows-6">
        <p className="row-span-1 font-medium">Phòng {data.location}</p>
        <p>Tầng {data.location?.[0]}</p>
        <p
          className={`text-center w-20  rounded font-semibold ${
            data.room_status === "Available"
              ? "bg-green-300 text-black"
              : data.room_status === "Occupied"
              ? "bg-red-400 text-white"
              : "bg-yellow-300 text-black"
          }`}
        >
          {data.room_status === "Available"
            ? "Trống"
            : data.room_status === "Occupied"
            ? "Đầy"
            : "Bảo trì"}
        </p>

        <p>Loại: {data.room_type === "group" ? "Nhóm" : "Đơn"}</p>
        <p>Còn trống: {data.available_seats ?? 0} vị trí</p>
        <p className="truncate max-w-full">Thiết bị: {data.devices}</p>
      </div>
      <div className="flex justify-center items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-6 font-medium transition duration-200 h-[66px]"
          onClick={handleBookNow}
        >
          Đặt chỗ ngay
        </button>
      </div>
    </div>
  );
}

export default function MainPage() {
  const [roomData, setRoomData] = useState([]);
  const [bookedData, setBookedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/available");
        const respond = await res.json();
        setRoomData(respond.data);
        console.log(respond);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
    const fetchBooked = async () => {
      try {
        const mssv = JSON.parse(localStorage.getItem("user_info"))?.mssv;

        const res = await fetch(
          `http://localhost:8080/api/v1/bookings/student/${mssv}`
        );

        const respond = await res.json();
        setBookedData(respond.DT);
        console.log(respond);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchBooked();
  }, []);
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col   min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="flex-grow items-center relative p-4 z-10 h-[80%]">
        <div className="flex flex-grow items-center space-x-4 mb-4 ">
          <div className="w-30% h-24 bg-white bg-opacity-15 p-4 shadow-lg rounded-lg border-2 border-gray-400 flex flex-col justify-center mr-8">
            {/*  top left box */}
            <p className="font-bold text-2xl">Smart Study Space Management &</p>
            <p className="font-bold text-2xl">Reservation System at HCMUT</p>
          </div>
          <div className="flex-grow flex">
            <button
              className="flex-grow bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
              onClick={() => navigate("/main")}
            >
              {" "}
              Trang chủ
            </button>
            <button className="ml-4 flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200">
              {" "}
              Tìm chỗ
            </button>
            <button
              className="flex-grow hover:text-gray-100 text-black py-2 px-4 rounded-lg font-medium transition duration-200"
              onClick={() => navigate("/booking-manager")}
            >
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 mt-16  ">
          {/* Hộp kiểm soát */}
          <div className="min-w-[150px] max-w-[600px] bg-gray-800 bg-opacity-80 p-4 shadow-lg rounded-lg h-48">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full ">
              <p className="text-white text-center text-lg flex items-center justify-center col-span-1 row-span-1 font-medium">
                Số phòng trống
                <br />
                {roomData.filter((r) => r.room_status === "Available").length}
              </p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 col-span-1 row-span-1">
                Quản lý phòng
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 col-span-1 row-span-1" onClick={()=>navigate("/booking-manager")}>
                Đặt chỗ của tôi
                <br /> {bookedData.length}
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 col-span-1 row-span-1" onClick={()=>navigate("/history")}>
                Lịch sử đặt chỗ
              </button>
            </div>
          </div>

          {/* Hộp phòng 1 */}
          {roomData[0] && <RoomBox data={roomData[0]} />}
        </div>

        {/* Hàng 2: 3 hộp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 mt-8">
          {roomData.slice(1).map((room, idx) => (
            <RoomBox key={room.room_id || idx} data={room} />
          ))}
        </div>
      </div>
      {/* Bot */}
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
