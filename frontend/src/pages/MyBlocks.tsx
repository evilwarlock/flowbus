import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BlockList from '../components/blocks/BlockList';
import { useMyBlocks } from '../hooks/useBlocks';
import { Block } from '../services/types';
import { blockService } from '../services/blocks';
import toast from 'react-hot-toast';

const MyBlocks: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { blocks, loading, error, refetch } = useMyBlocks({
    limit: 20,
  });

  // Filter blocks locally by search query
  const filteredBlocks = blocks.filter(block =>
    !searchQuery || 
    block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    block.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreate = () => {
    navigate('/blocks/create');
  };

  const handleEdit = (block: Block) => {
    navigate(`/blocks/${block.id}/edit`);
  };

  const handleDelete = async (block: Block) => {
    if (!window.confirm(`Are you sure you want to delete "${block.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await blockService.deleteBlock(block.id);
      toast.success('Block deleted successfully');
      refetch(); // Refresh the list
    } catch (error: any) {
      toast.error(error.detail || 'Failed to delete block');
    }
  };

  const handleTest = (block: Block) => {
    navigate(`/blocks/${block.id}/test`);
  };

  const getStats = () => {
    const activeBlocks = blocks.filter(b => b.is_active).length;
    const publicBlocks = blocks.filter(b => b.is_public).length;
    const privateBlocks = blocks.filter(b => !b.is_public).length;

    return { activeBlocks, publicBlocks, privateBlocks };
  };

  const stats = getStats();

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Blocks
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your API blocks and monitor their performance.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Blocks</p>
                <p className="text-2xl font-bold text-gray-900">{blocks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBlocks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Public</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publicBlocks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Private</p>
                <p className="text-2xl font-bold text-gray-900">{stats.privateBlocks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={handleCreate}
              className="border border-gray-300 rounded-lg p-4 text-left hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="p-2 bg-primary-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Create New Block</h3>
              </div>
              <p className="text-sm text-gray-600">
                Add a new API block to your collection
              </p>
            </button>

            <button 
              onClick={() => navigate('/analytics')}
              className="border border-gray-300 rounded-lg p-4 text-left hover:border-secondary-300 hover:bg-secondary-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="p-2 bg-secondary-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">View Analytics</h3>
              </div>
              <p className="text-sm text-gray-600">
                See detailed usage and performance metrics
              </p>
            </button>

            <button 
              onClick={() => navigate('/explore')}
              className="border border-gray-300 rounded-lg p-4 text-left hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Explore Blocks</h3>
              </div>
              <p className="text-sm text-gray-600">
                Discover APIs created by other developers
              </p>
            </button>
          </div>
        </div>

        {/* Blocks List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <BlockList
            blocks={filteredBlocks}
            loading={loading}
            error={error}
            showOwner={false}
            showActions={true}
            showSearch={true}
            showCreateButton={true}
            onSearch={handleSearch}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTest={handleTest}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MyBlocks;
