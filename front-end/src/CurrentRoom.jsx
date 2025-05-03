import React, { useEffect, useState } from "react";
import bg from "./assets/Mainpage.jpg";
import room from "./assets/Room.jpg";
import { useNavigate, Link, useParams } from "react-router-dom";
import toast from 'react-hot-toast';


export default function CurrentRoom() {
  const [booking, setBooking] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false); // Thêm state để quản lý trạng thái check-in
  const navigate = useNavigate();
  const { bookingId } = useParams();

  // State để quản lý trạng thái Bật/Tắt của từng thiết bị
  const [deviceStates, setDeviceStates] = useState({});

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!bookingId) {
          toast.error("Không tìm thấy ID đặt phòng.");
          return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
          toast.error("Bạn chưa đăng nhập.");
          return;
        }

        const res = await fetch(`http://localhost:8080/api/v1/bookings/ID/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setBooking(data.DT);

          // Khởi tạo trạng thái của các thiết bị dựa trên dữ liệu API
          const initialDeviceStates = {};
          if (data.DT && data.DT.room_devices) {
            data.DT.room_devices.forEach(device => {
              const internalName = getInternalDeviceName(device.device_name);
              if (internalName) {
                initialDeviceStates[internalName] = device.status === 'Active';
              }
            });
          }
          setDeviceStates(initialDeviceStates);

          // Cập nhật trạng thái check-in dựa trên booking_status
          setIsCheckedIn(data.DT.booking_status === "CheckedIn");

        } else {
          if (res.status === 401 || res.status === 403) {
            toast.error("Bạn không có quyền truy cập hoặc phiên đăng nhập đã hết hạn.");
            navigate('/login');
          } else {
            toast.error("Không thể tải thông tin đặt phòng.");
          }
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Lỗi khi tải thông tin đặt phòng.");
      }
    };
    fetchBooking();
  }, [bookingId, navigate]);

  // Hàm để ánh xạ tên thiết bị từ API sang tên nội bộ
  const getInternalDeviceName = (deviceName) => {
    switch (deviceName) {
      case 'đèn':
        return 'light';
      case 'quạt':
        return 'fan';
      case 'wifi':
        return 'wifi';
      case 'power':
        return 'power';
      default:
        return null;
    }
  };

  // Hàm xử lý sự kiện click nút và gọi API cập nhật trạng thái thiết bị
  const handleDeviceToggle = async (internalName) => {
    const deviceName = getApiDeviceName(internalName);
    if (!deviceName) return;

    setDeviceStates(prevStates => {
      const newStatus = !prevStates[internalName];
      toast.success(`${deviceName} đã được ${newStatus ? 'bật' : 'tắt'}.`);
      return {
        ...prevStates,
        [internalName]: newStatus,
      };
    });
  };

  // Hàm để ánh xạ tên nội bộ sang tên thiết bị API
  const getApiDeviceName = (internalName) => {
    switch (internalName) {
      case 'light':
        return 'đèn';
      case 'fan':
        return 'quạt';
      case 'wifi':
        return 'wifi';
      case 'power':
        return 'power';
      default:
        return null;
    }
  };

  const isDeviceAvailable = (internalName) => {
    if (!booking || !booking.room_devices) return false;
    return booking.room_devices.some(device => getInternalDeviceName(device.device_name) === internalName);
  };

  // Hàm xử lý check-in/check-out
  const handleCheckInOut = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error("Bạn chưa đăng nhập.");
      return;
    }

    const url = isCheckedIn
      ? `http://localhost:8080/api/v1/bookings/${bookingId}/checkout`
      : `http://localhost:8080/api/v1/bookings/${bookingId}/checkin`;

    const method = 'POST';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    let body = null;

    if (!isCheckedIn) {
      // Khi check-in, gửi kèm roomId trong body
      if (booking && booking.room_id) {
        body = JSON.stringify({
          roomId: booking.room_id,
        });
      } else {
        toast.error("Không có thông tin Room ID để check-in.");
        return;
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers,
        body,
      });

      if (res.ok) {
        // Sau khi check-in/out thành công, chúng ta nên fetch lại dữ liệu booking
        // để cập nhật trạng thái check-in trên giao diện
        const updatedBookingRes = await fetch(`http://localhost:8080/api/v1/bookings/ID/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (updatedBookingRes.ok) {
          const updatedBookingData = await updatedBookingRes.json();
          setBooking(updatedBookingData.DT);
          // Cập nhật trạng thái check-in dựa trên booking_status từ dữ liệu mới nhất
          setIsCheckedIn(updatedBookingData.DT.booking_status === "CheckedIn");
          toast.success(`Đã ${isCheckedIn ? 'check-out' : 'check-in'} thành công!`);

          // Điều hướng về trang chính sau khi check-out thành công
          if (isCheckedIn) {
            navigate('/main');
          }

        } else {
          toast.error("Cập nhật trạng thái đặt phòng sau check-in/out thất bại.");
        }


      } else {
        const errorData = await res.json();
        toast.error(`Không thể ${isCheckedIn ? 'check-out' : 'check-in'}: ${errorData.message || 'Lỗi không xác định'}`);
      }
    } catch (error) {
      console.error("Error check-in/out:", error);
      toast.error(`Lỗi khi thực hiện ${isCheckedIn ? 'check-out' : 'check-in'}.`);
    }
  };

  const devices = [
    { name: 'light', icon: 'fas fa-lightbulb', label: 'Light' },
    { name: 'fan', icon: 'fas fa-fan', label: 'Fan' },
    { name: 'wifi', icon: 'fas fa-wifi', label: 'WiFi' },
    { name: 'power', icon: 'fas fa-plug', label: 'Power' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Header - Tương tự như MainPage */}
      <div className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg p-4 relative z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-2xl font-bold">Quản lý phòng hiện tại</h1>
          </div>
          <div className="flex items-center space-x-6">
            <button
              className="text-white hover:text-blue-300 transition text-lg"
              onClick={() => navigate("/main")}
            >
              <i className="fas fa-home mr-2"></i>Trang chủ
            </button>
            {/* Bạn có thể thêm các link điều hướng khác tại đây nếu cần */}
          </div>
        </div>
      </div>

      {/* Middle Section - Sử dụng flex-grow để chiếm không gian còn lại */}
      <main className="flex-grow flex justify-center items-center py-8">
        <div className="bg-white bg-opacity-40 shadow-lg rounded-lg flex w-3/4 gap-x-4 h-[80%] max-h-[600px]">
          {/* First Column */}
          <div className="w-1/3 relative overflow-hidden rounded-l-lg">
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover scale-120 "
              style={{
                backgroundImage: `url(${room})`,
                backgroundPosition: "right",
              }}
            ></div>
          </div>

          {/* Second Column: Buttons */}
          <div className="w-1/3 flex justify-center items-center">
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {devices.map((device) => {
                const isAvailable = isDeviceAvailable(device.name);
                const isOn = deviceStates[device.name];
                return (
                  <button
                    key={device.name}
                    className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition duration-200
                      ${isOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-400 hover:bg-red-500'}
                      ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                      text-white`}
                    onClick={() => handleDeviceToggle(device.name)}
                    disabled={!isAvailable}
                  >
                    {device.name === 'light' && <i className="fas fa-lightbulb"></i>}
                    {device.name === 'fan' && <i className="fas fa-fan"></i>}
                    {device.name === 'wifi' && <i className="fas fa-wifi"></i>}
                    {device.name === 'power' && <i className="fas fa-plug"></i>}
                    <span>{device.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Third Column: Check-in/Check-out */}
          <div className="w-1/3 flex justify-center items-center ">
            <div className="bg-gray-300 flex flex-col justify-between items-center  h-[90%] w-[90%] bg-opacity-50 py-8 rounded-lg">
              <text className="font-medium text-gray-800">
                {" "}
                Check In/ Check out
              </text>
              <i className="fas fa-camera text-9xl text-gray-700"></i>
              <text className="font-medium text-gray-800"> Scan QR code</text>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition duration-200
                  ${isCheckedIn ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'}
                  text-white`}
                onClick={handleCheckInOut}
              >
                {isCheckedIn ? 'Check Out' : 'Check In'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Tương tự như MainPage và BookingManager */}
      <footer className="backdrop-blur-md bg-gray-800/70 border-t border-white/10 text-white py-6 mt-auto relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
              <p className="text-sm text-gray-300">Email: ddthu@hcmut.edu.vn</p>
              <p className="text-sm text-gray-300">
                ĐT (Tel.): (84-8) 38647256 - 5258
              </p>
              <p className="text-sm text-gray-300">
                Quý Thầy/Cô chưa có tài khoản(hoặc quên mật khẩu) nhà trường vui lòng
                liên hệ Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5 để được
                hỗ trợ.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hỗ trợ kỹ thuật</h4>
              <p className="text-sm text-gray-300">
                Trung tâm Dữ liệu & Công nghệ Thông tin
              </p>
              <p className="text-sm text-gray-300">Email: dl-cntt@hcmut.edu.vn</p>
              <p className="text-sm text-gray-300">
                ĐT (Tel.): (84-8) 38647256 - 5200
              </p>
              <p className="text-sm text-gray-300">
                (For HCMUT account, please contact to : Data and Information
                Technology Center)
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}