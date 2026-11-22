import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatDate } from '../../utils/dateFormatter';
import {
  IoDocumentTextOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCreateOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoLayersOutline,
  IoScaleOutline,
  IoAddOutline,
  IoEyeOutline,
  IoPeopleOutline
} from 'react-icons/io5';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentInvoices, charts, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading && !stats) {
    return <Loader text="Loading dashboard metrics..." />;
  }

  const statCards = [
    {
      title: 'Total Invoices',
      value: stats?.totalInvoices || 0,
      icon: IoDocumentTextOutline,
      color: 'text-primary-900 bg-primary-50',
      link: '/invoices'
    },
    {
      title: 'Approved Invoices',
      value: stats?.approvedInvoices || 0,
      icon: IoCheckmarkCircleOutline,
      color: 'text-emerald-700 bg-emerald-50',
      link: '/invoices?status=Approved'
    },
    {
      title: 'Pending Approval',
      value: stats?.pendingInvoices || 0,
      icon: IoTimeOutline,
      color: 'text-blue-700 bg-blue-50',
      link: '/invoices?status=Pending Approval'
    },
    {
      title: 'Draft Invoices',
      value: stats?.draftInvoices || 0,
      icon: IoCreateOutline,
      color: 'text-amber-700 bg-amber-50',
      link: '/invoices?status=Draft'
    },
    {
      title: "Today's Invoices",
      value: stats?.todayInvoices || 0,
      icon: IoCalendarOutline,
      color: 'text-indigo-700 bg-indigo-50'
    },
    {
      title: 'Monthly Value',
      value: `₹${formatCurrency(stats?.monthlyInvoiceValue || 0)}`,
      icon: IoCashOutline,
      color: 'text-emerald-800 bg-emerald-100/50'
    },
    {
      title: 'Total Quantity',
      value: `${stats?.totalGlassQuantity || 0} NOS`,
      icon: IoLayersOutline,
      color: 'text-cyan-700 bg-cyan-50'
    },
    {
      title: 'Total Glass Weight',
      value: `${stats?.totalGlassWeight || 0} KG`,
      icon: IoScaleOutline,
      color: 'text-purple-700 bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">Proforma Invoice Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Real-time management for glass specifications, processing charges & quotations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <IoPeopleOutline className="w-4 h-4 text-slate-500" />
            Customers
          </Link>
          <Link
            to="/invoices/create"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold rounded-md bg-primary-900 text-white hover:bg-primary-800 transition-colors shadow-xs"
          >
            <IoAddOutline className="w-4 h-4" />
            Create Proforma Invoice
          </Link>
        </div>
      </div>

      {/* 8 Metric Cards - Responsive across Mobile, Tablet, Laptop, Desktop, 2XL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-8 gap-3 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const CardContent = (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );

          return (
            <Card key={idx} className="hover:border-slate-300 transition-all p-4">
              {card.link ? <Link to={card.link}>{CardContent}</Link> : CardContent}
            </Card>
          );
        })}
      </div>

      {/* Charts & Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Invoicing Trend */}
        <div className="lg:col-span-2">
          <Card title="Monthly Invoicing Trend" subtitle="Revenue trajectory over recent active cycles">
            <div className="space-y-3">
              {charts?.monthlyTrend && charts.monthlyTrend.length > 0 ? (
                charts.monthlyTrend.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-800 w-28">{m.label}</span>
                    <div className="flex-1 mx-4 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary-900 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (m.totalAmount / (stats?.monthlyInvoiceValue || 10000)) * 100)}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-slate-500 w-16 text-center">{m.count} PI</span>
                    <span className="font-bold text-slate-900 w-28 text-right">
                      ₹{formatCurrency(m.totalAmount)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  No monthly trend records available yet.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Top Customers Distribution */}
        <div>
          <Card title="Top Customers" subtitle="By total proforma volume">
            <div className="space-y-3">
              {charts?.customerDistribution && charts.customerDistribution.length > 0 ? (
                charts.customerDistribution.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md border border-slate-100 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{c._id || 'Unknown'}</div>
                      <div className="text-[10px] text-slate-400">{c.invoicesCount} Invoices</div>
                    </div>
                    <div className="font-bold text-primary-900">
                      ₹{formatCurrency(c.totalAmount)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  No customer records yet.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <Card
        title="Recent Proforma Invoices"
        subtitle="Latest 10 invoices generated in the system"
        headerActions={
          <Link
            to="/invoices"
            className="text-xs font-semibold text-primary-900 hover:text-primary-700"
          >
            View All Invoices →
          </Link>
        }
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[680px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">PI Number</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3 text-right">Items / Qty</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentInvoices && recentInvoices.length > 0 ? (
                recentInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary-900">
                      <Link to={`/invoices/view/${inv._id}`} className="hover:underline">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="p-3 text-slate-600">{formatDate(inv.invoiceDate)}</td>
                    <td className="p-3 font-medium text-slate-800">
                      {inv.customerSnapshot?.customerName || inv.customer?.customerName || 'N/A'}
                    </td>
                    <td className="p-3 text-right text-slate-600">
                      {inv.glassItems?.length || 0} items ({inv.totalQuantity || 0} pcs)
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      ₹{formatCurrency(inv.roundedAmount)}
                    </td>
                    <td className="p-3 text-center">
                      <Badge status={inv.invoiceStatus} />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/invoices/view/${inv._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary-900 hover:text-primary-700 bg-primary-50 px-2.5 py-1 rounded"
                      >
                        <IoEyeOutline className="w-3.5 h-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                    No proforma invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
