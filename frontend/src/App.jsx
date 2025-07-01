// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppNavbar from './components/AppNavbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import CarDetailsPage from './pages/CarDetailsPage';
import ServiceFormPage from './pages/ServiceFormPage';

// A wrapper for protected routes
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

// A wrapper for manager-only routes
const ManagerRoute = ({ children }) => {
    const { user } = useAuth();
    return user?.is_manager ? children : <Navigate to="/dashboard" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppNavbar />
                <Container>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                        <Route path="/car/:carId" element={<ProtectedRoute><CarDetailsPage /></ProtectedRoute>} />

                        <Route path="/manager" element={<ManagerRoute><ManagerDashboard /></ManagerRoute>} />
                        <Route path="/manager/car/:carId/add-service" element={<ManagerRoute><ServiceFormPage /></ManagerRoute>} />
                        <Route path="/manager/service/:serviceId/edit" element={<ManagerRoute><ServiceFormPage /></ManagerRoute>} />
                    </Routes>
                </Container>
            </Router>
        </AuthProvider>
    );
}

export default App;