import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';

const Login = () => {
  const [email, setEmail] = useState('admin@glasshouse.com');
  const [password, setPassword] = useState('password123');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-3 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-primary-900 px-5 sm:px-8 py-6 sm:py-8 text-center text-white">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <IoShieldCheckmarkOutline className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">GlassHouse ERP</h2>
          <p className="text-xs text-primary-200 mt-1">
            Enterprise Proforma Invoice Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-5">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@glasshouse.com"
              required
            />
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-500">
            <div className="font-semibold text-slate-700 mb-1">Pre-configured Demo Credentials:</div>
            <div>• Super Admin: <span className="font-mono text-slate-800">admin@glasshouse.com</span> / <span className="font-mono text-slate-800">password123</span></div>
            <div>• Sales Exec: <span className="font-mono text-slate-800">sales@glasshouse.com</span> / <span className="font-mono text-slate-800">password123</span></div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5"
            loading={loading}
          >
            Sign In to Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
