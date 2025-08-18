import React, { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Block } from '../../services/types';
import BlockCard from './BlockCard';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface BlockListProps {
  blocks: Block[];
  loading?: boolean;
  error?: string | null;
  showOwner?: boolean;
  showActions?: boolean;
  showSearch?: boolean;
  showCreateButton?: boolean;
  onSearch?: (query: string) => void;
  onCreate?: () => void;
  onEdit?: (block: Block) => void;
  onDelete?: (block: Block) => void;
  onTest?: (block: Block) => void;
}

const BlockList: React.FC<BlockListProps> = ({
  blocks,
  loading = false,
  error = null,
  showOwner = true,
  showActions = false,
  showSearch = true,
  showCreateButton = false,
  onSearch,
  onCreate,
  onEdit,
  onDelete,
  onTest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      // Debounce search
      const timeoutId = setTimeout(() => onSearch(query), 300);
      return () => clearTimeout(timeoutId);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">{error}</p>
        <Button 
          variant="outline" 
          className="mt-3" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Create */}
      {(showSearch || showCreateButton) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {showSearch && (
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search blocks..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          )}

          {showCreateButton && onCreate && (
            <Button onClick={onCreate} className="shrink-0">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Block
            </Button>
          )}
        </div>
      )}

      {/* Blocks Grid */}
      {blocks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No blocks found' : 'No blocks yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? 'Try adjusting your search terms or filters.' 
              : 'Create your first block to get started with FlowBus.'
            }
          </p>
          {showCreateButton && onCreate && !searchQuery && (
            <Button onClick={onCreate}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Your First Block
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.map((block) => (
            <BlockCard
              key={block.id}
              block={block}
              showOwner={showOwner}
              showActions={showActions}
              onEdit={onEdit}
              onDelete={onDelete}
              onTest={onTest}
            />
          ))}
        </div>
      )}

      {/* Load More (if needed) */}
      {blocks.length > 0 && blocks.length % 9 === 0 && (
        <div className="text-center pt-6">
          <Button variant="outline">
            Load More Blocks
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlockList;
