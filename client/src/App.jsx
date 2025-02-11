import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/Home';
import Landing from './components/landing/Landing';
import Items from './components/items/Items';
import MyItems from './components/items/MyItems';
import ItemDetail from './components/items/ItemDetail';
import Profile from './components/profile/Profile';
import Bookings from './components/bookings/Bookings';
import Messages from './components/messages/Messages';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Map from './components/map/Map';
import BrowseItems from './components/browse/BrowseItems';
import BrowseItemDetail from './components/browse/BrowseItemDetail';
import BookingRequests from './components/bookings/BookingRequests';
import BookingInfo from './components/bookings/BookingInfo';
import { Toaster } from 'react-hot-toast';

function AuthenticatedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" /> : <Landing />;
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<AuthenticatedRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/items"
              element={
                <ProtectedRoute>
                  <Items />
                </ProtectedRoute>
              }
            />
            <Route
              path="/items/:id"
              element={
                <ProtectedRoute>
                  <ItemDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-items"
              element={
                <ProtectedRoute>
                  <MyItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking_req"
              element={
                <ProtectedRoute>
                  <BookingRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              }
            />
            <Route
              path="/browse"
              element={
                <ProtectedRoute>
                  <BrowseItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/browse/:id"
              element={
                <ProtectedRoute>
                  <BrowseItemDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking_info"
              element={
                <ProtectedRoute>
                  <BookingInfo />
                </ProtectedRoute>
              }
            />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
