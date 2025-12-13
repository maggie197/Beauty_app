import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Providers from './pages/Providers';
import ProviderDetail from './pages/ProviderDetail';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import ProviderDashboard from './pages/ProviderDashboard';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services" element={<Services />} />
              <Route path="/providers" element={<Providers />} />
              <Route path="/providers/:id" element={<ProviderDetail />} />
              <Route path="/book" element={<BookAppointment />} />
              <Route path="/book/:serviceId" element={<BookAppointment />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
