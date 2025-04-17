import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './LoginPage';
import LoginInfo from './LoginInfo';
import MainPage from './MainPage';
import CurrentRoom from './CurrentRoom';
import RoomHistory from './RoomHistory';
import BookingManager from './BookingManager';
import RoomDetails from './RoomDetails';
import FindingRoom from './FindingRoom';
import BookingSelfStudy from './BookingSelfStudy';
import UserDashboard from './UserDashboard';
import UserProfile from './UserProfile';
import FeedbackForm from './FeedbackForm';
import FeedbackSuccess from './FeedbackSuccess';
import FeedbackErrol from './FeedbackErrol';
import FeedBackHistory from './FeedBackHistory';
// Placeholder - sẽ tạo sau

const RoomSearch = () => <div className="p-5 text-center">🔍 Tìm phòng</div>;
const Profile = () => <div className="p-5 text-center">👤 Hồ sơ cá nhân</div>;
const Reports = () => <div className="p-5 text-center">📈 Báo cáo</div>;
const Support = () => <div className="p-5 text-center">🛠️ Hỗ trợ</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/logininfo" element={<LoginInfo />} />
      <Route path="/booking-manager" element={<BookingManager />} />
      
      <Route path="/main" element={<MainPage />} />
      <Route path="/current-room" element={<CurrentRoom />} />
      <Route path="/history" element={<RoomHistory />} />
      <Route path="/room-details" element={<RoomDetails />} />
      <Route path="/search" element={<RoomSearch />} />
      {/* <Route path="/profile" element={<Profile />} /> */}
      <Route path="/reports" element={<Reports />} />
      <Route path="/support" element={<Support />} />
      <Route path="/finding-room" element={<FindingRoom />} />
      <Route path="/booking-self-study" element={<BookingSelfStudy />} />
      <Route path="/UserDashboard" element={<UserDashboard />} />
      <Route path="/UserProfile" element={<UserProfile />} />
      <Route path="/FeedbackForm" element={<FeedbackForm />} />
      <Route path="/FeedbackSuccess" element={<FeedbackSuccess />} />
      <Route path="/FeedbackErrol" element={<FeedbackErrol />} />
      <Route path="/FeedbackHistory" element={<FeedBackHistory />} />
      
    </Routes>
  );
}

export default App;