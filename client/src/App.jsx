import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Debts from './pages/Debts'
import Expenses from './pages/Expenses'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="debts" element={<Debts />} />
                    <Route path="expenses" element={<Expenses />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    )
}

export default App
