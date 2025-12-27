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
        </Route>

        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
