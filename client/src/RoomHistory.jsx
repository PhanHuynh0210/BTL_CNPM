import React, {useState,useEffect} from "react";
import bg from "./assets/Mainpage.jpg";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';



const calculateDuration = (start, end) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  const durationMinutes = endMinutes - startMinutes;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return `${hours} giờ${minutes > 0 ? ` ${minutes} phút` : ""}`;
};



export default function RoomHistory() {
  const [bookedData, setBookedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const fetchBooked = async () => {
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

      if (!response.ok) {
        toast.error("Không thể tải thông tin người dùng");
        return;
      }

      const userData = await response.json();
      const mssv = userData.studentId;

      const bookingsResponse = await fetch(
        `http://localhost:8080/api/v1/bookings/student/${mssv}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (bookingsResponse.ok) {
        const respond = await bookingsResponse.json();
        setBookedData(respond.DT);
      } else {
        toast.error("Không thể tải lịch sử đặt phòng");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };
  fetchBooked();
}, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-white text-2xl">Đang tải...</div>
      </div>
    );
  }

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
          <i className="fas fa-home" onClick={()=>navigate("/main")}></i>
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
            <tbody>
  {bookedData.map((booking, index) => {
    const date = new Date(booking.Day);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth()+1).toString().padStart(2, "0")}/${date.getFullYear()} ${booking.start_time}`;

    const [building, room] = booking.room_name.split("-");
    const duration = calculateDuration(booking.start_time, booking.end_time);

    return (
      <tr key={index} className="rounded-lg my-2 hover:bg-blue-100">
        <td className="px-4 py-2">{formattedDate}</td>
        <td className="px-4 py-2">{room}</td>
        <td className="px-4 py-2">{building}</td>
        <td className="px-4 py-2">{duration}</td>
      </tr>
    );
  })}
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