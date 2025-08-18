import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BlockList from '../components/blocks/BlockList';
import { useBlocks } from '../hooks/useBlocks';
import { Block } from '../services/types';

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { blocks, loading, error, refetch } = useBlocks({
    search: searchQuery || undefined,
    limit: 12,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewBlock = (block: Block) => {
    navigate(`/blocks/${block.id}`);
  };

  const handleTestBlock = (block: Block) => {
    navigate(`/blocks/${block.id}/test`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Explore API Blocks
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Discover amazing APIs created by our community. Find the perfect block to power your next project.
          </p>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{blocks.length}</div>
              <div className="text-sm text-gray-600">Available Blocks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">24/7</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Free</div>
              <div className="text-sm text-gray-600">To Get Started</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Filter Blocks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Categories</option>
                <option value="ai">AI & Machine Learning</option>
                <option value="data">Data Processing</option>
                <option value="communication">Communication</option>
                <option value="utility">Utilities</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing
              </label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Pricing</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={refetch}
                className="w-full bg-primary-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Blocks List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <BlockList
            blocks={blocks}
            loading={loading}
            error={error}
            showOwner={true}
            showActions={false}
            showSearch={true}
            showCreateButton={false}
            onSearch={handleSearch}
            onTest={handleTestBlock}
          />
        </div>

        {/* Call to Action */}
        <div className="bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">
            Ready to Share Your API?
          </h2>
          <p className="text-primary-700 mb-6 max-w-xl mx-auto">
            Join thousands of developers who are monetizing their APIs through FlowBus. 
            It's free to get started and takes just minutes to create your first block.
          </p>
          <button 
            onClick={() => navigate('/blocks/create')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Create Your First Block
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
