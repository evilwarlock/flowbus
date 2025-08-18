import { useState, useEffect } from 'react';
import { Block } from '../services/types';
import { blockService } from '../services/blocks';
import toast from 'react-hot-toast';

interface UseBlocksOptions {
  skip?: number;
  limit?: number;
  search?: string;
  owner?: string;
  autoFetch?: boolean;
}

export function useBlocks(options: UseBlocksOptions = {}) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await blockService.getBlocks({
        skip: options.skip,
        limit: options.limit,
        search: options.search,
        owner: options.owner,
      });
      setBlocks(data);
    } catch (err: any) {
      const errorMessage = err.detail || 'Failed to fetch blocks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchBlocks();
    }
  }, [options.skip, options.limit, options.search, options.owner]);

  return {
    blocks,
    loading,
    error,
    refetch: fetchBlocks,
  };
}

export function useMyBlocks(options: { skip?: number; limit?: number; autoFetch?: boolean } = {}) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyBlocks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await blockService.getMyBlocks({
        skip: options.skip,
        limit: options.limit,
      });
      setBlocks(data);
    } catch (err: any) {
      const errorMessage = err.detail || 'Failed to fetch your blocks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchMyBlocks();
    }
  }, [options.skip, options.limit]);

  return {
    blocks,
    loading,
    error,
    refetch: fetchMyBlocks,
  };
}

export function useBlock(blockId: string) {
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlock = async () => {
    if (!blockId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await blockService.getBlock(blockId);
      setBlock(data);
    } catch (err: any) {
      const errorMessage = err.detail || 'Failed to fetch block';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlock();
  }, [blockId]);

  return {
    block,
    loading,
    error,
    refetch: fetchBlock,
  };
}
