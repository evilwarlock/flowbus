import React from 'react';
import { Link } from 'react-router-dom';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon 
} from '@heroicons/react/24/outline';
import { Block } from '../../services/types';
import Button from '../ui/Button';

interface BlockCardProps {
  block: Block;
  showOwner?: boolean;
  showActions?: boolean;
  onEdit?: (block: Block) => void;
  onDelete?: (block: Block) => void;
  onTest?: (block: Block) => void;
}

const BlockCard: React.FC<BlockCardProps> = ({
  block,
  showOwner = true,
  showActions = false,
  onEdit,
  onDelete,
  onTest,
}) => {
  const formatPrice = (price: number, model: string) => {
    if (price === 0) return 'Free';
    if (model === 'per_call') return `$${price.toFixed(3)}/call`;
    if (model === 'subscription') return `$${price.toFixed(2)}/month`;
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {block.name}
              </h3>
              <div className="flex items-center gap-1">
                {block.is_public ? (
                  <EyeIcon className="w-4 h-4 text-green-500" title="Public" />
                ) : (
                  <EyeSlashIcon className="w-4 h-4 text-gray-400" title="Private" />
                )}
                {!block.is_active && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    Inactive
                  </span>
                )}
              </div>
            </div>
            
            {block.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {block.description}
              </p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          {/* Pricing */}
          <div className="flex items-center text-sm text-gray-600">
            <CurrencyDollarIcon className="w-4 h-4 mr-2 text-green-500" />
            <span className="font-medium">
              {formatPrice(
                block.pricing_model === 'per_call' ? block.price_per_call : block.subscription_price,
                block.pricing_model
              )}
            </span>
            <span className="ml-1 text-xs text-gray-500">
              ({block.pricing_model.replace('_', ' ')})
            </span>
          </div>

          {/* Created Date */}
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>Created {formatDate(block.created_at)}</span>
          </div>

          {/* Owner (if showing) */}
          {showOwner && (
            <div className="flex items-center text-sm text-gray-600">
              <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span>Owner ID: {block.owner_id.slice(0, 8)}...</span>
            </div>
          )}
        </div>

        {/* Endpoint URL */}
        <div className="mb-4">
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-xs text-gray-500 mb-1">Endpoint URL</p>
            <p className="text-sm font-mono text-gray-800 break-all">
              {block.endpoint_url}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/blocks/${block.id}`}
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            View Details →
          </Link>

          {showActions && (
            <div className="flex items-center space-x-2">
              {onTest && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTest(block)}
                >
                  Test
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(block)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(block)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockCard;
