import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCustomers, deleteCustomer } from '../../redux/slices/customerSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Loader from '../../components/common/Loader';
import { IoAddOutline, IoSearchOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';

const CustomerList = () => {
  const dispatch = useDispatch();
  const { customers, pagination, loading } = useSelector((state) => state.customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleDelete = async () => {
    if (deleteTarget) {
      await dispatch(deleteCustomer(deleteTarget._id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Customer Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain customer billing addresses, delivery addresses, and GST credentials.
          </p>
        </div>
        <Link to="/customers/create">
          <Button variant="primary" icon={IoAddOutline} size="sm">
            Add New Customer
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card noPadding>
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <IoSearchOutline className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name, phone, GSTIN, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Customers: {pagination?.total || customers.length}
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          {loading && customers.length === 0 ? (
            <Loader text="Loading customers..." />
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">GSTIN</th>
                  <th className="p-3">City / State</th>
                  <th className="p-3 text-center">Type</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                      No customers found. Click &quot;Add New Customer&quot; to register your first client.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
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
                      <td className="p-3 font-mono text-slate-700 font-medium">{c.gstin || 'Unregistered'}</td>
                      <td className="p-3 text-slate-600">
                        {c.city ? `${c.city}, ` : ''}{c.state || 'N/A'}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                          {c.customerType || 'B2B'}
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
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

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
