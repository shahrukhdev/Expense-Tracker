import {Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import Budget from '../pages/Budget';
import Category from '../pages/Category';
import Expense from '../pages/Expense';
import Income from '../pages/Income';
import RecurringExpense from '../pages/RecurringExpense';
import UserProfile from '../pages/UserProfile';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Guest Routes */}
    <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
    </Route>
      
    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/category" element={<Category />} />
        <Route path="/expenses" element={<Expense />} />
        <Route path="/incomes" element={<Income />} />
        <Route path="/recurring-expenses" element={<RecurringExpense />} />
        <Route path="/profile" element={<UserProfile />} />
    </Route>
    
      {/* <Route path="/dashboard" element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        }
      /> */}

    </Routes>
  )
}

export default AppRoutes