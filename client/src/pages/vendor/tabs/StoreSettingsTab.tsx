import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Store, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import api from '../../../lib/axios';
import type { Vendor } from '../../../context/VendorContext';

interface StoreSettingsTabProps {
  vendor: Vendor;
}

export default function StoreSettingsTab({ vendor }: StoreSettingsTabProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    storeName: vendor.storeName || '',
    storeDescription: vendor.storeDescription || '',
    address: vendor.address || '',
    contactEmail: vendor.contactEmail || '',
    contactPhone: vendor.contactPhone || '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.put(`/vendors/store/${vendor.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myVendors'] });
      setSuccessMessage('Store settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" />
            Store Settings
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Update your store information and contact details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Store Name *
            </label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Your Store Name"
              required
            />
          </div>

          {/* Store Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Store Description
            </label>
            <textarea
              value={formData.storeDescription}
              onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your store..."
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2 text-slate-400" />
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Store address"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2 text-slate-400" />
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="contact@yourstore.com"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Phone className="w-4 h-4 inline mr-2 text-slate-400" />
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {updateMutation.isError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              Failed to update store settings. Please try again.
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
