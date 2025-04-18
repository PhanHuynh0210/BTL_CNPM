import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './LoginPage';
import LoginInfo from './LoginInfo';
import MainPage from './MainPage';
import CurrentRoom from './CurrentRoom';
import RoomHistory from './RoomHistory';
import BookingManager from './BookingManager';
import RoomDetails from './RoomDetails';
import { Toaster } from 'react-hot-toast';
// Placeholder - sẽ tạo sau
const RoomSearch = () => <div className="p-5 text-center"> Tìm phòng</div>;
const Profile = () => <div className="p-5 text-center"> Hồ sơ cá nhân</div>;
const Reports = () => <div className="p-5 text-center"> Báo cáo</div>;
const Support = () => <div className="p-5 text-center"> Hỗ trợ</div>;

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/logininfo" element={<LoginInfo />} />
      <Route path="/booking-manager" element={<BookingManager />} />
      
      <Route path="/main" element={<MainPage />} />
      <Route path="/current-room" element={<CurrentRoom />} />
      <Route path="/history" element={<RoomHistory />} />
      <Route path="/room-details" element={<RoomDetails />} />
      <Route path="/search" element={<RoomSearch />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/support" element={<Support />} />
    </Routes>
    </>
  );
}

export default App;
