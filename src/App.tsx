import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Tickets from './pages/Tickets';
import Announcements from './pages/Announcements';
import Receipts from './pages/Receipts';
import AnnouncementCreate from './pages/AnnouncementCreate';
import TicketCreate from './pages/TicketCreate';
import LargeItemCreate from './pages/LargeItemCreate';
import RoomInfo from './pages/RoomInfo';
import AssessRooms from './pages/AssessRooms';
import Logout from './pages/Logout';
import GuestPassCreate from './pages/GuestPassCreate';
import GuestPassList from './pages/GuestPassList';
import GuestPassAdmin from './pages/GuestPassAdmin';
import GuestPassCheck from './pages/GuestPassCheck';
import RoomsAdmin from './pages/RoomsAdmin';
import OccupancyAdmin from './pages/OccupancyAdmin';
import ImportAdmin from './pages/ImportAdmin';
import StudentCreateAdmin from './pages/StudentCreateAdmin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="announcements/new" element={<AnnouncementCreate />} /> {/* NEW */}
          <Route path="receipts" element={<Receipts />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tickets/new" element={<TicketCreate />} />
          <Route path="large-items" element={<LargeItemCreate />} />
          <Route path="room" element={<RoomInfo />} />
          <Route path="assess" element={<AssessRooms />} />
          <Route path="guests" element={<GuestPassList />} />
          <Route path="guests/new" element={<GuestPassCreate />} />
          <Route path="guests-admin" element={<GuestPassAdmin />} />
          <Route path="guest-check" element={<GuestPassCheck />} />
          <Route path="rooms-admin" element={<RoomsAdmin />} />
          <Route path="occupancy-admin" element={<OccupancyAdmin />} />
          <Route path="import" element={<ImportAdmin />} />
          <Route path="students/new" element={<StudentCreateAdmin />} />
        </Route>
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
