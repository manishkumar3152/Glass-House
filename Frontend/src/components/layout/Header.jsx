import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { IoMenuOutline, IoLogOutOutline, IoPersonCircleOutline } from 'react-icons/io5';

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
          aria-label="Open navigation menu"
        >
          <IoMenuOutline className="w-6 h-6" />
        </button>
        <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
          FY 2026-2027
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* User Info */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <IoPersonCircleOutline className="w-7 h-7 sm:w-8 sm:h-8 text-primary-900" />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-800 max-w-[120px] md:max-w-none truncate">{user?.name || 'Administrator'}</div>
            <div className="text-[10px] text-slate-400 capitalize">{user?.role?.replace('_', ' ') || 'Admin'}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
        >
          <IoLogOutOutline className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
