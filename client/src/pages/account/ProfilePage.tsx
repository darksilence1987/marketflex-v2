import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';

// Validation Schema
const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phone || '',
      street: user?.street || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      country: user?.country || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await api.put('/auth/profile', data);
      
      // Update local store with new user data
      updateUser({
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: response.data.role,
        phone: response.data.phone,
        street: response.data.street,
        city: response.data.city,
        state: response.data.state,
        zipCode: response.data.zipCode,
        country: response.data.country,
      });

      setSuccessMessage('Profile updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input component for cleaner code
  const InputField = ({
    name,
    label,
    placeholder,
    type = 'text',
  }: {
    name: keyof ProfileFormData;
    label: string;
    placeholder: string;
    type?: string;
  }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
          errors[name]
            ? 'border-red-500 focus:ring-red-500/50'
            : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
        }`}
        disabled={isSubmitting}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-400">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
        <p className="text-slate-400 mt-1">Update your personal information and address</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <section className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 text-sm">👤</span>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField name="firstName" label="First Name" placeholder="John" />
            <InputField name="lastName" label="Last Name" placeholder="Doe" />
            <div className="md:col-span-2">
              <InputField name="phoneNumber" label="Phone Number" placeholder="+1 (555) 123-4567" type="tel" />
            </div>
          </div>
        </section>

        {/* Address Information */}
        <section className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 text-sm">📍</span>
            Shipping Address
          </h3>

          <div className="space-y-6">
            <InputField name="street" label="Street Address" placeholder="123 Main Street, Apt 4B" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField name="city" label="City" placeholder="New York" />
              <InputField name="state" label="State / Province" placeholder="NY" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField name="zipCode" label="ZIP / Postal Code" placeholder="10001" />
              <InputField name="country" label="Country" placeholder="United States" />
            </div>
          </div>
        </section>

        {/* Messages */}
        {successMessage && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl">
            <p className="text-emerald-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-400">{errorMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
