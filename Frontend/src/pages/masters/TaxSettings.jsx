import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaxConfig, updateTaxConfig } from '../../redux/slices/masterSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { IoSaveOutline, IoCashOutline } from 'react-icons/io5';

const TaxSettings = () => {
  const dispatch = useDispatch();
  const { taxConfig, loading } = useSelector((state) => state.masters);

  const [formData, setFormData] = useState({
    taxName: 'GST',
    gstPercentage: 18,
    cgstPercentage: 9,
    sgstPercentage: 9,
    igstPercentage: 18,
    taxApplicability: 'Standard GST on Toughened Glass'
  });

  useEffect(() => {
    dispatch(fetchTaxConfig());
  }, [dispatch]);

  useEffect(() => {
    if (taxConfig) {
      setFormData({
        taxName: taxConfig.taxName || 'GST',
        gstPercentage: taxConfig.gstPercentage || 18,
        cgstPercentage: taxConfig.cgstPercentage || 9,
        sgstPercentage: taxConfig.sgstPercentage || 9,
        igstPercentage: taxConfig.igstPercentage || 18,
        taxApplicability: taxConfig.taxApplicability || ''
      });
    }
  }, [taxConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'gstPercentage') {
      const gst = Number(value) || 0;
      setFormData({
        ...formData,
        gstPercentage: gst,
        igstPercentage: gst,
        cgstPercentage: gst / 2,
        sgstPercentage: gst / 2
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateTaxConfig(formData));
  };

  if (loading && !taxConfig) {
    return <Loader text="Loading tax configuration..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-800">
            <IoCashOutline className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tax & GST Configuration</h2>
            <p className="text-xs text-slate-500">
              Configure statutory Goods and Services Tax slabs for inter-state and intra-state invoicing.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card title="GST Slabs & Rules">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Standard Tax Name"
              name="taxName"
              value={formData.taxName}
              onChange={handleChange}
              required
            />

            <Input
              label="Overall GST Slab (%)"
              name="gstPercentage"
              type="number"
              step="1"
              value={formData.gstPercentage}
              onChange={handleChange}
              required
              helperText="Updates IGST (100%) and CGST+SGST (50% each)"
            />

            <Input
              label="IGST Rate (%) - Inter-State"
              name="igstPercentage"
              type="number"
              step="0.5"
              value={formData.igstPercentage}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="CGST Rate (%)"
                name="cgstPercentage"
                type="number"
                step="0.5"
                value={formData.cgstPercentage}
                onChange={handleChange}
                required
              />
              <Input
                label="SGST Rate (%)"
                name="sgstPercentage"
                type="number"
                step="0.5"
                value={formData.sgstPercentage}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Statutory Applicability Note"
                name="taxApplicability"
                value={formData.taxApplicability}
                onChange={handleChange}
                placeholder="e.g. Standard GST on Finished Toughened Glass"
              />
            </div>
          </div>

          <div className="flex justify-end pt-5 mt-5 border-t border-slate-200">
            <Button type="submit" variant="primary" loading={loading} icon={IoSaveOutline}>
              Update Tax Configuration
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default TaxSettings;
