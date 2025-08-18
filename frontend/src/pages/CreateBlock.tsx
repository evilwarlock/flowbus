import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { blockService } from '../services/blocks';
import { BlockCreate } from '../services/types';
import toast from 'react-hot-toast';

// Validation schema for block creation
const blockSchema = z.object({
  name: z
    .string()
    .min(1, 'Block name is required')
    .max(100, 'Block name cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  endpoint_url: z
    .string()
    .min(1, 'Endpoint URL is required')
    .url('Please enter a valid URL'),
  pricing_model: z.string().min(1, 'Please select a pricing model'),
  price_per_call: z
    .number()
    .min(0, 'Price must be 0 or greater')
    .optional(),
  subscription_price: z
    .number()
    .min(0, 'Price must be 0 or greater')
    .optional(),
  is_public: z.boolean().optional().default(true),
});

type BlockFormData = z.infer<typeof blockSchema>;

const CreateBlock: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      pricing_model: 'per_call',
      price_per_call: 0,
      subscription_price: 0,
      is_public: true,
    },
  });

  const pricingModel = watch('pricing_model');

  const onSubmit = async (data: BlockFormData) => {
    try {
      const blockData: BlockCreate = {
        name: data.name,
        description: data.description || undefined,
        endpoint_url: data.endpoint_url,
        pricing_model: data.pricing_model as 'per_call' | 'subscription' | 'tiered',
        price_per_call: data.pricing_model === 'per_call' ? (data.price_per_call || 0) : undefined,
        subscription_price: data.pricing_model === 'subscription' ? (data.subscription_price || 0) : undefined,
        is_public: data.is_public,
      };

      const newBlock = await blockService.createBlock(blockData);
      toast.success('Block created successfully!');
      navigate(`/blocks/${newBlock.id}`);
    } catch (error: any) {
      toast.error(error.detail || 'Failed to create block');
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Block</h1>
          <p className="text-gray-600 mt-2">
            Add your API to the FlowBus marketplace and start monetizing it today.
          </p>
        </div>

        {/* Creation Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Block Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Provide details about your API block.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <Input
                {...register('name')}
                label="Block Name *"
                placeholder="My Awesome API"
                error={errors.name?.message}
                helperText="Choose a descriptive name for your API block"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe what your API does and how others can use it..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Help others understand what your API does (optional)
                </p>
              </div>

              <Input
                {...register('endpoint_url')}
                label="Endpoint URL *"
                placeholder="https://api.example.com/v1/my-endpoint"
                error={errors.endpoint_url?.message}
                helperText="The URL where your API can be accessed"
              />
            </div>

            {/* Pricing Configuration */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Pricing Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing Model *
                  </label>
                  <select
                    {...register('pricing_model')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="per_call">Per Call</option>
                    <option value="subscription">Subscription</option>
                    <option value="tiered">Tiered</option>
                  </select>
                  {errors.pricing_model && (
                    <p className="mt-1 text-sm text-red-600">{errors.pricing_model.message}</p>
                  )}
                </div>

                {pricingModel === 'per_call' && (
                  <Input
                    {...register('price_per_call', { valueAsNumber: true })}
                    type="number"
                    step="0.001"
                    min="0"
                    label="Price Per Call (USD)"
                    placeholder="0.001"
                    error={errors.price_per_call?.message}
                    helperText="How much to charge for each API call (set to 0 for free)"
                  />
                )}

                {pricingModel === 'subscription' && (
                  <Input
                    {...register('subscription_price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    label="Monthly Subscription Price (USD)"
                    placeholder="9.99"
                    error={errors.subscription_price?.message}
                    helperText="Monthly subscription fee for unlimited access"
                  />
                )}

                {pricingModel === 'tiered' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <p className="text-sm text-yellow-800">
                      Tiered pricing configuration will be available in a future update. 
                      For now, you can use per-call or subscription pricing.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Visibility Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    {...register('is_public')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <label className="text-sm font-medium text-gray-700">
                      Make this block public
                    </label>
                    <p className="text-sm text-gray-500">
                      Public blocks are discoverable by all users. Private blocks are only accessible to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* API Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                📋 API Guidelines
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your API should accept POST requests with JSON payloads</li>
                <li>• Ensure your endpoint is publicly accessible and has proper CORS headers</li>
                <li>• Use HTTPS for secure communication</li>
                <li>• Provide clear error messages and status codes</li>
                <li>• Test your API thoroughly before publishing</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/blocks')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Creating Block...' : 'Create Block'}
              </Button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                API Documentation
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Learn how to structure your API for optimal compatibility with FlowBus.
              </p>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                View API Guidelines →
              </a>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Pricing Strategy
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Tips for setting competitive prices and maximizing your revenue.
              </p>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                Pricing Best Practices →
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateBlock;
