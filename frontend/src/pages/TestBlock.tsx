import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { blockService } from '../services/blocks';
import { apiService } from '../services/api';
import { Block, InvokeRequest, InvokeResponse } from '../services/types';

interface InvocationHistory {
  id: string;
  request: InvokeRequest;
  response: InvokeResponse;
  timestamp: string;
}

const TestBlock: React.FC = () => {
  const { id: blockId } = useParams<{ id: string }>();
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  
  // Request form state
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState<string>('{}');
  const [useCache, setUseCache] = useState(true);
  
  // Response state
  const [response, setResponse] = useState<InvokeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // History state
  const [history, setHistory] = useState<InvocationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // New header/query param input
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const [newQueryKey, setNewQueryKey] = useState('');
  const [newQueryValue, setNewQueryValue] = useState('');

  useEffect(() => {
    loadBlock();
  }, [blockId]);

  const loadBlock = async () => {
    if (!blockId) return;
    
    try {
      setLoading(true);
      const blockData = await blockService.getBlock(blockId);
      setBlock(blockData);
    } catch (err: any) {
      toast.error(`Failed to load block: ${err.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addHeader = () => {
    if (newHeaderKey && newHeaderValue) {
      setHeaders(prev => ({ ...prev, [newHeaderKey]: newHeaderValue }));
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (key: string) => {
    setHeaders(prev => {
      const newHeaders = { ...prev };
      delete newHeaders[key];
      return newHeaders;
    });
  };

  const addQueryParam = () => {
    if (newQueryKey && newQueryValue) {
      setQueryParams(prev => ({ ...prev, [newQueryKey]: newQueryValue }));
      setNewQueryKey('');
      setNewQueryValue('');
    }
  };

  const removeQueryParam = (key: string) => {
    setQueryParams(prev => {
      const newParams = { ...prev };
      delete newParams[key];
      return newParams;
    });
  };

  const testBlock = async () => {
    if (!blockId) return;

    try {
      setTesting(true);
      setError(null);
      setResponse(null);

      let body: any;
      try {
        body = requestBody ? JSON.parse(requestBody) : null;
      } catch (err) {
        throw new Error('Invalid JSON in request body');
      }

      const invokeRequest: InvokeRequest = {
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        query_params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
        body
      };

      const result = await apiService.post<InvokeResponse>(
        `/invoke/${blockId}?use_cache=${useCache}`,
        invokeRequest
      );

      setResponse(result);
      
      // Add to history
      const historyEntry: InvocationHistory = {
        id: result.invocation_id,
        request: invokeRequest,
        response: result,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10

      toast.success(`Block invoked successfully (${result.execution_time_ms}ms)`);
      
    } catch (err: any) {
      const errorMessage = err.detail || err.message || 'Failed to invoke block';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setTesting(false);
    }
  };

  const formatJson = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };

  const getStatusColor = (statusCode: number): string => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-600';
    if (statusCode >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center">
              <div className="text-gray-600">Loading block...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!block) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Block Not Found</h1>
              <Link to="/blocks" className="text-blue-600 hover:text-blue-500">
                Back to My Blocks
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <nav className="text-sm text-gray-500 mb-4">
              <Link to="/blocks" className="hover:text-gray-700">My Blocks</Link>
              <span className="mx-2">/</span>
              <Link to={`/blocks/${block.id}`} className="hover:text-gray-700">{block.name}</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Test</span>
            </nav>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Test Block</h1>
                <p className="text-gray-600 mt-2">{block.name}</p>
                <p className="text-sm text-gray-500">Endpoint: {block.endpoint_url}</p>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? 'Hide' : 'Show'} History ({history.length})
                </Button>
                <Link to={`/blocks/${block.id}/edit`}>
                  <Button variant="outline">Edit Block</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Request Panel */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Request Configuration</h2>
              
              {/* Headers Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Headers</h3>
                
                {/* Add new header */}
                <div className="flex space-x-2 mb-3">
                  <Input
                    placeholder="Header name"
                    value={newHeaderKey}
                    onChange={(e) => setNewHeaderKey(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Header value"
                    value={newHeaderValue}
                    onChange={(e) => setNewHeaderValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addHeader} disabled={!newHeaderKey || !newHeaderValue}>
                    Add
                  </Button>
                </div>

                {/* Existing headers */}
                {Object.entries(headers).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-600 flex-1">{key}:</span>
                    <span className="text-sm text-gray-900 flex-1">{value}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeHeader(key)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              {/* Query Parameters Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Query Parameters</h3>
                
                {/* Add new query param */}
                <div className="flex space-x-2 mb-3">
                  <Input
                    placeholder="Parameter name"
                    value={newQueryKey}
                    onChange={(e) => setNewQueryKey(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Parameter value"
                    value={newQueryValue}
                    onChange={(e) => setNewQueryValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addQueryParam} disabled={!newQueryKey || !newQueryValue}>
                    Add
                  </Button>
                </div>

                {/* Existing query params */}
                {Object.entries(queryParams).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-600 flex-1">{key}:</span>
                    <span className="text-sm text-gray-900 flex-1">{value}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeQueryParam(key)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              {/* Request Body Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Request Body (JSON)</h3>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter JSON request body..."
                />
              </div>

              {/* Options */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useCache}
                    onChange={(e) => setUseCache(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Use cache (if available)</span>
                </label>
              </div>

              {/* Test Button */}
              <Button
                onClick={testBlock}
                disabled={testing}
                className="w-full"
              >
                {testing ? 'Testing...' : 'Test Block'}
              </Button>
            </div>

            {/* Response Panel */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Response</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <div className="text-red-800 font-medium">Error</div>
                  <div className="text-red-700 text-sm mt-1">{error}</div>
                </div>
              )}

              {response && (
                <div>
                  {/* Response Summary */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-4">
                      <span className={`font-semibold ${getStatusColor(response.status_code)}`}>
                        {response.status_code}
                      </span>
                      <span className="text-sm text-gray-600">
                        {response.execution_time_ms}ms
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ID: {response.invocation_id}
                    </span>
                  </div>

                  {/* Response Headers */}
                  {Object.keys(response.headers).length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Response Headers</h3>
                      <div className="bg-gray-50 rounded-md p-3 text-xs font-mono">
                        <pre>{formatJson(response.headers)}</pre>
                      </div>
                    </div>
                  )}

                  {/* Response Body */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Response Body</h3>
                    <div className="bg-gray-50 rounded-md p-3 text-sm font-mono max-h-96 overflow-auto">
                      <pre>{formatJson(response.body)}</pre>
                    </div>
                  </div>
                </div>
              )}

              {!response && !error && (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-lg mb-2">Ready to test</div>
                  <div className="text-sm">Configure your request and click "Test Block"</div>
                </div>
              )}
            </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Invocation History</h2>
              
              {history.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No invocations yet. Test the block to see history here.
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${getStatusColor(entry.response.status_code)}`}>
                          {entry.response.status_code}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{entry.response.execution_time_ms}ms</span>
                          <span>{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gray-700 hover:text-gray-900">
                          View Details
                        </summary>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Request</h4>
                            <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
                              {formatJson(entry.request)}
                            </pre>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Response Body</h4>
                            <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-32">
                              {formatJson(entry.response.body)}
                            </pre>
                          </div>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TestBlock;
