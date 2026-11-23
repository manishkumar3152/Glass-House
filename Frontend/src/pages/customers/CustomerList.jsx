
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchCustomers, deleteCustomer } from '../../redux/slices/customerSlice';
import { customerApi } from '../../api/customerApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import SelectionToolbar from '../../components/common/SelectionToolbar';
import Loader from '../../components/common/Loader';
import {
  IoAddOutline,
  IoSearchOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoFilterOutline,
  IoArrowBackOutline,
  IoCloseOutline
} from 'react-icons/io5';

const filterInputClass =
  'w-full min-w-0 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500';

const filterLabelClass =
  'block text-[11px] font-semibold text-slate-600 mb-1 whitespace-nowrap overflow-hidden text-ellipsis';

const EMPTY_FILTERS = { customerType: '', state: '', rates: '' };

const CustomerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers, pagination, loading } = useSelector((state) => state.customers);

  // Search box value (instant) and debounced value (used for the API call)
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Applied filters
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // Draft values edited inside the drawer; applied only when "Apply" is pressed
  const [draft, setDraft] = useState(EMPTY_FILTERS);

  const [deleteTarget, setDeleteTarget] = useState(null);

  // Selection & bulk action state
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Bottom drawer state
  const [drawerOpen, setDrawerOpen] = useState(false); // mounted
  const [drawerShown, setDrawerShown] = useState(false); // slide-in animation
  const closeTimer = useRef(null);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Debounce search (300 ms)
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Fetch customers whenever search or filters change
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (filters.customerType) params.customerType = filters.customerType;
    if (filters.state) params.state = filters.state;
    dispatch(fetchCustomers(params));
    setSelectedIds([]);
  }, [dispatch, search, filters.customerType, filters.state]);

  // "Rates" filter is applied on the client, since it depends on glassRates length
  const visibleCustomers = customers.filter((c) => {
    const hasCustom = Array.isArray(c.glassRates) && c.glassRates.length > 0;
    if (filters.rates === 'custom') return hasCustom;
    if (filters.rates === 'default') return !hasCustom;
    return true;
  });

  const openDrawer = () => {
    clearTimeout(closeTimer.current);
    setDraft(filters);
    setDrawerOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerShown(true)));
  };

  const closeDrawer = useCallback(() => {
    setDrawerShown(false);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDrawerOpen(false), 250);
  }, []);

  const applyFilters = () => {
    setFilters({ ...draft, state: draft.state.trim() });
    closeDrawer();
  };

  const clearFilters = () => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    closeDrawer();
  };

  // Lock page scroll and close on Escape while the drawer is open
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen, closeDrawer]);

  // Clear pending timer on unmount
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const handleDelete = async () => {
    if (deleteTarget) {
      await dispatch(deleteCustomer(deleteTarget._id));
      setDeleteTarget(null);
    }
  };

  // Selection handlers
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (visibleCustomers.length > 0 && selectedIds.length === visibleCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleCustomers.map((c) => c._id));
    }
  };

  // Bulk actions
  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      await customerApi.bulkUpdateStatus(selectedIds, newStatus);
      toast.success(`Updated status to "${newStatus}" for ${selectedIds.length} customer(s)`);
      setSelectedIds([]);
      dispatch(fetchCustomers({
        search: search || undefined,
        customerType: filters.customerType || undefined,
        state: filters.state || undefined
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update customer statuses');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      const res = await customerApi.bulkDelete(selectedIds);
      toast.success(res.data?.message || `Deleted ${selectedIds.length} customer(s) successfully`);
      setSelectedIds([]);
      dispatch(fetchCustomers({
        search: search || undefined,
        customerType: filters.customerType || undefined,
        state: filters.state || undefined
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete selected customers');
    } finally {
      setBulkLoading(false);
    }
  };

  const totalCount =
    activeFilterCount > 0 && filters.rates
      ? visibleCustomers.length
      : pagination?.total ?? customers.length;

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
            aria-label="Go back"
            title="Back"
            className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            <IoArrowBackOutline className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 leading-tight">
              Customer Management
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
              Maintain customer billing addresses, delivery addresses, and GST credentials.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto [&_button]:whitespace-nowrap [&_button]:w-full sm:[&_button]:w-auto [&_button]:justify-center">
          <Link to="/customers/create" className="block">
            <Button variant="primary" icon={IoAddOutline} size="sm">
              Add New Customer
            </Button>
          </Link>
        </div>
      </div>

      <Card noPadding>
        {/* Toolbar: search + filter button + total */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0 sm:max-w-md">
              <IoSearchOutline className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer name, phone, GSTIN, or city..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full min-w-0 pl-9 pr-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <button
              type="button"
              onClick={openDrawer}
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              aria-label="Toggle filters"
              title="Filters"
              className={`relative shrink-0 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded border transition-colors whitespace-nowrap ${drawerOpen || activeFilterCount > 0
                ? 'bg-primary-50 border-primary-300 text-primary-900'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
            >
              <IoFilterOutline className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary-900 text-white text-[10px] font-bold leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="hidden sm:block ml-auto text-xs text-slate-500 font-medium whitespace-nowrap">
              Total Customers: {totalCount}
            </div>
          </div>
          <div className="sm:hidden text-xs text-slate-500 font-medium">
            Total Customers: {totalCount}
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto overscroll-x-contain">
          {loading && customers.length === 0 ? (
            <Loader text="Loading customers..." />
          ) : (
            <table className="w-full text-left border-collapse text-xs min-w-[1100px] whitespace-nowrap">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={visibleCustomers.length > 0 && selectedIds.length === visibleCustomers.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      title="Select all customers"
                    />
                  </th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">GSTIN</th>
                  <th className="p-3">City / State</th>
                  <th className="p-3 text-center">Type</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400 italic">
                      {search || activeFilterCount > 0
                        ? 'No customers match the search or filters.'
                        : 'No customers found. Click "Add New Customer" to register your first client.'}
                    </td>
                  </tr>
                ) : (
                  visibleCustomers.map((c) => {
                    const isSelected = selectedIds.includes(c._id);
                    return (
                    <tr
                      key={c._id}
                      className={`transition-colors ${
                        isSelected ? 'bg-primary-50/70 hover:bg-primary-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(c._id)}
                          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        <div>{c.customerName}</div>
                        {c.glassRates && c.glassRates.length > 0 ? (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {c.glassRates.length} Custom Rate{c.glassRates.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="inline-block mt-0.5 text-[10px] text-slate-400 font-normal">
                            Default Rates
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-700">{c.contactPerson || 'N/A'}</td>
                      <td className="p-3 text-slate-700 font-mono">{c.phone || 'N/A'}</td>
                      <td className="p-3 text-slate-600">{c.email || 'N/A'}</td>
                      <td className="p-3 font-mono text-slate-700 font-medium">
                        {c.gstin || 'Unregistered'}
                      </td>
                      <td className="p-3 text-slate-600">
                        {c.city ? `${c.city}, ` : ''}
                        {c.state || 'N/A'}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                          {c.customerType || 'B2B'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === 'Inactive'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {c.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/customers/edit/${c._id}`}
                            className="p-1 text-slate-500 hover:text-primary-900 rounded transition-colors"
                            title="Edit Customer"
                          >
                            <IoCreateOutline className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(c)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Delete Customer"
                          >
                            <IoTrashOutline className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Floating Selection Toolbar for Bulk Operations */}
      <SelectionToolbar
        selectedCount={selectedIds.length}
        totalCount={visibleCustomers.length}
        itemLabel="customers"
        statusOptions={['Active', 'Inactive']}
        statusLabel="Change Status"
        onStatusChange={handleBulkStatusChange}
        onDelete={handleBulkDelete}
        deleteLabel={`Delete (${selectedIds.length})`}
        deleteLoading={bulkLoading}
        statusLoading={bulkLoading}
        onClearSelection={() => setSelectedIds([])}
        onSelectAll={() => setSelectedIds(visibleCustomers.map((c) => c._id))}
      />

      {/* Bottom filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filter customers">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-200 ${drawerShown ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={closeDrawer}
          />

          {/* Sheet */}
          <div
            className={`absolute bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[85vh] transition-transform duration-200 ease-out ${drawerShown ? 'translate-y-0' : 'translate-y-full'
              }`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="flex justify-center pt-2.5">
              <span className="h-1 w-10 rounded-full bg-slate-300" />
            </div>

            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pt-2 pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 whitespace-nowrap">Filter customers</h3>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close filters"
                className="p-1 text-slate-500 hover:text-slate-800 rounded"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="min-w-0">
                  <label className={filterLabelClass}>Customer Type</label>
                  <select
                    value={draft.customerType}
                    onChange={(e) => setDraft((d) => ({ ...d, customerType: e.target.value }))}
                    className={filterInputClass}
                  >
                    <option value="">All Types</option>
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                  </select>
                </div>

                <div className="min-w-0">
                  <label className={filterLabelClass}>State</label>
                  <input
                    type="text"
                    placeholder="e.g. Haryana"
                    value={draft.state}
                    onChange={(e) => setDraft((d) => ({ ...d, state: e.target.value }))}
                    className={filterInputClass}
                  />
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <label className={filterLabelClass}>Rates</label>
                  <select
                    value={draft.rates}
                    onChange={(e) => setDraft((d) => ({ ...d, rates: e.target.value }))}
                    className={filterInputClass}
                  >
                    <option value="">All Customers</option>
                    <option value="custom">With custom rates</option>
                    <option value="default">Default rates only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 sm:flex-none sm:min-w-[120px] text-xs font-semibold text-slate-700 hover:text-rose-600 px-3 py-2 border border-slate-300 rounded bg-white whitespace-nowrap"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={applyFilters}
                className="flex-1 sm:flex-none sm:min-w-[140px] text-xs font-semibold text-white bg-primary-900 hover:bg-primary-800 px-3 py-2 rounded whitespace-nowrap sm:ml-auto"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.customerName}"? Existing invoices with saved customer snapshots will remain unaffected.`}
        confirmText="Delete Customer"
      />
    </div>
  );
};

export default CustomerList;