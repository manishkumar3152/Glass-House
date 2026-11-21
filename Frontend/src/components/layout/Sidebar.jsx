import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  IoGridOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoSettingsOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoLayersOutline,
  IoPricetagOutline,
  IoHammerOutline,
  IoCashOutline,
  IoBusinessOutline,
  IoReaderOutline,
  IoAddCircleOutline,
  IoTimeOutline,
  IoCheckmarkDoneCircleOutline
} from 'react-icons/io5';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [invoicesOpen, setInvoicesOpen] = useState(location.pathname.startsWith('/invoices'));
  const [mastersOpen, setMastersOpen] = useState(location.pathname.startsWith('/masters'));

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-900 text-white shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const subItemClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
      isActive
        ? 'text-primary-900 font-semibold bg-primary-50'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center gap-3 bg-white">
          <div className="w-8 h-8 rounded-lg bg-primary-900 flex items-center justify-center text-white font-bold text-base shadow-sm">
            G
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm tracking-wide">GlassHouse ERP</h1>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Proforma Suite v2.0</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {/* Dashboard */}
          <NavLink to="/" end className={navItemClass}>
            <IoGridOutline className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          {/* Customers */}
          <NavLink to="/customers" className={navItemClass}>
            <IoPeopleOutline className="w-4 h-4" />
            <span>Customers</span>
          </NavLink>

          {/* Invoices Group */}
          <div>
            <button
              type="button"
              onClick={() => setInvoicesOpen(!invoicesOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <IoDocumentTextOutline className="w-4 h-4" />
                <span>Proforma Invoices</span>
              </div>
              {invoicesOpen ? (
                <IoChevronDownOutline className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <IoChevronForwardOutline className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {invoicesOpen && (
              <div className="mt-1 pl-7 space-y-1">
                <NavLink to="/invoices" end className={subItemClass}>
                  <IoDocumentTextOutline className="w-3.5 h-3.5" />
                  <span>All Invoices</span>
                </NavLink>
                <NavLink to="/invoices/create" className={subItemClass}>
                  <IoAddCircleOutline className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Create Invoice</span>
                </NavLink>
                <NavLink to="/invoices?status=Pending Approval" className={subItemClass}>
                  <IoTimeOutline className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pending Approval</span>
                </NavLink>
                <NavLink to="/invoices?status=Approved" className={subItemClass}>
                  <IoCheckmarkDoneCircleOutline className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Approved Invoices</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Masters Group */}
          <div>
            <button
              type="button"
              onClick={() => setMastersOpen(!mastersOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <IoSettingsOutline className="w-4 h-4" />
                <span>Masters</span>
              </div>
              {mastersOpen ? (
                <IoChevronDownOutline className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <IoChevronForwardOutline className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {mastersOpen && (
              <div className="mt-1 pl-7 space-y-1">
                <NavLink to="/masters/company" className={subItemClass}>
                  <IoBusinessOutline className="w-3.5 h-3.5" />
                  <span>Company Settings</span>
                </NavLink>
                <NavLink to="/masters/glass-specifications" className={subItemClass}>
                  <IoLayersOutline className="w-3.5 h-3.5" />
                  <span>Glass Specs</span>
                </NavLink>
                <NavLink to="/masters/glass-rates" className={subItemClass}>
                  <IoPricetagOutline className="w-3.5 h-3.5" />
                  <span>Glass Rates</span>
                </NavLink>
                <NavLink to="/masters/processing-charges" className={subItemClass}>
                  <IoHammerOutline className="w-3.5 h-3.5" />
                  <span>Processing Charges</span>
                </NavLink>
                <NavLink to="/masters/tax" className={subItemClass}>
                  <IoCashOutline className="w-3.5 h-3.5" />
                  <span>Tax Configuration</span>
                </NavLink>
                <NavLink to="/masters/terms" className={subItemClass}>
                  <IoReaderOutline className="w-3.5 h-3.5" />
                  <span>Terms & Conditions</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="text-[11px] text-slate-700 font-bold">AJAY GLASS HOUSE</div>
          <div className="text-[10px] text-slate-400">Enterprise PI Suite</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
