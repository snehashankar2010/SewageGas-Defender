import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UserContext from './contexts/UserContext';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import DevicePage from './pages/DevicePage/DevicePage';
import SignupPage from './pages/SignupPage/SignupPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import axios from './config/axios';
import RequireAuth from './util/RequireAuth';

function App() {
    let [user, setUser] = useState(null);
    let [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUserLoading(true);
            axios
                .post('/auth/token', {
                    token,
                })
                .then((res) => {
                    if (res.success && res.user) {
                        setUser({
                            ...res.user,
                            token,
                        });
                        setUserLoading(false);
                    } else setUserLoading(false);
                })
                .catch((err) => {
                    setUserLoading(false);
                });
        } else {
            setUserLoading(false);
        }
    }, []);

    if (userLoading) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center">
                <h1 className="mb-2 text-4xl font-semibold">Loading...</h1>
                <h2 className="text-xl">This will only take a moment</h2>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col break-all">
            <UserContext.Provider value={{ user, setUser }}>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        <Route
                            path="/dashboard"
                            element={
                                <RequireAuth>
                                    <DashboardPage />
                                </RequireAuth>
                            }
                        />

                        {/* Route for viewing a specific device */}
                        <Route
                            path="/device/:deviceId"
                            element={
                                <RequireAuth>
                                    <DevicePage />
                                </RequireAuth>
                            }
                        />

                        {/* 404 route */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </UserContext.Provider>
        </div>
    );
}

export default App;
