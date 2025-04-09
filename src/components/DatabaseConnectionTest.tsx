'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient, checkDatabaseConnection } from '@/lib/database';

export default function DatabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Check basic connection
        const isConnected = await checkDatabaseConnection();
        
        if (!isConnected) {
          setConnectionStatus('error');
          setErrorMessage('Failed to connect to the database');
          return;
        }
        
        // If connected, try to get table list
        const supabase = createBrowserSupabaseClient();
        
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .order('table_name');
        
        if (error) {
          console.error('Error fetching tables:', error);
          setConnectionStatus('error');
          setErrorMessage(error.message);
          return;
        }
        
        // Connection successful
        setConnectionStatus('connected');
        setTables(data.map(t => t.table_name));
        
      } catch (error) {
        console.error('Unexpected error:', error);
        setConnectionStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    };
    
    testConnection();
  }, []);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Database Connection Status</h2>
      
      {connectionStatus === 'loading' && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>
          <p>Testing connection...</p>
        </div>
      )}
      
      {connectionStatus === 'connected' && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <p className="text-green-700 font-medium">Connected to database successfully!</p>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Available Tables:</h3>
            {tables.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {tables.map(table => (
                  <li key={table} className="text-gray-700">{table}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No tables found in the public schema.</p>
            )}
          </div>
        </div>
      )}
      
      {connectionStatus === 'error' && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <div>
            <p className="text-red-700 font-medium">Failed to connect to database</p>
            {errorMessage && <p className="text-sm text-red-600 mt-1">{errorMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
