import { apiService } from './api';
import { Block, BlockCreate } from './types';

class BlockService {
  // Get all public blocks with pagination and filters
  async getBlocks(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    owner?: string;
  }): Promise<Block[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.owner) queryParams.append('owner', params.owner);

    const url = `/blocks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get<Block[]>(url);
  }

  // Get user's own blocks (including private ones)
  async getMyBlocks(params?: {
    skip?: number;
    limit?: number;
  }): Promise<Block[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/blocks/my${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get<Block[]>(url);
  }

  // Get a specific block by ID
  async getBlock(blockId: string): Promise<Block> {
    return apiService.get<Block>(`/blocks/${blockId}`);
  }

  // Create a new block
  async createBlock(blockData: BlockCreate): Promise<Block> {
    return apiService.post<Block>('/blocks/', blockData);
  }

  // Update an existing block
  async updateBlock(blockId: string, blockData: Partial<BlockCreate>): Promise<Block> {
    return apiService.put<Block>(`/blocks/${blockId}`, blockData);
  }

  // Delete a block
  async deleteBlock(blockId: string): Promise<void> {
    return apiService.delete<void>(`/blocks/${blockId}`);
  }

  // Test a block's endpoint (optional - for future use)
  async testBlock(blockId: string, testData?: any): Promise<any> {
    return apiService.post(`/invoke/${blockId}`, {
      headers: testData?.headers,
      query_params: testData?.query_params,
      body: testData?.body,
    });
  }
}

export const blockService = new BlockService();
export default blockService;
