import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

// Profile update schema
const profileSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { user, updateUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || '',
      username: user?.username || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateUser(data);
      reset(data); // Reset form with new values
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and account preferences.
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Personal Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Update your personal details here.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Profile Picture</h3>
                <p className="text-sm text-gray-600">
                  Profile pictures coming soon! For now, we'll use your initials.
                </p>
              </div>
            </div>

            {/* Email Field */}
            <Input
              {...register('email')}
              type="email"
              label="Email Address"
              error={errors.email?.message}
              autoComplete="email"
            />

            {/* Username Field */}
            <Input
              {...register('username')}
              label="Username"
              error={errors.username?.message}
              helperText="This is how other users will see you on FlowBus"
              autoComplete="username"
            />

            {/* Account Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Account Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status:</span>
                  <span className={`font-medium ${user?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900">
                    {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!isDirty}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Security
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account security settings.
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-600">
                  Last changed: Never (using initial password)
                </p>
              </div>
              <Button variant="outline" disabled>
                Change Password
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Password management coming in the next update!
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200">
          <div className="px-6 py-4 border-b border-red-200">
            <h2 className="text-lg font-medium text-red-900">
              Danger Zone
            </h2>
            <p className="text-sm text-red-600 mt-1">
              These actions cannot be undone. Please be careful.
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <Button variant="outline" disabled className="border-red-300 text-red-700 hover:bg-red-50">
                Delete Account
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Account deletion coming in a future update.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
