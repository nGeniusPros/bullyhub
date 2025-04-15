import { healthRecordQueries, useHealthRecordQueries } from '../data/queries';
import { createClient } from '@/lib/supabase-server';
import { createClient as createBrowserClient } from '@/lib/supabase-browser';

// Mock the Supabase clients
jest.mock('@/lib/supabase-server', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/lib/supabase-browser', () => ({
  createClient: jest.fn(),
}));

describe('Health Record Queries', () => {
  let mockServerSupabase: any;
  let mockBrowserSupabase: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock Supabase clients
    mockServerSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn(),
          getPublicUrl: jest.fn(),
          remove: jest.fn(),
        }),
      },
    };
    
    mockBrowserSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn(),
          getPublicUrl: jest.fn(),
          remove: jest.fn(),
        }),
      },
      auth: {
        getUser: jest.fn(),
      },
    };
    
    (createClient as jest.Mock).mockReturnValue(mockServerSupabase);
    (createBrowserClient as jest.Mock).mockReturnValue(mockBrowserSupabase);
  });
  
  describe('Server-side queries', () => {
    describe('getDogHealthRecords', () => {
      it('fetches health records for a dog', async () => {
        // Mock the Supabase response
        const mockRecords = [
          { id: 'record-1', dog_id: 'dog-1', record_type: 'examination' },
          { id: 'record-2', dog_id: 'dog-1', record_type: 'vaccination' },
        ];
        
        mockServerSupabase.order.mockResolvedValue({ data: mockRecords, error: null });
        
        // Call the query
        const result = await healthRecordQueries.getDogHealthRecords('dog-1');
        
        // Verify the result
        expect(result).toEqual(mockRecords);
        
        // Verify the Supabase calls
        expect(mockServerSupabase.from).toHaveBeenCalledWith('health_records');
        expect(mockServerSupabase.select).toHaveBeenCalledWith('*');
        expect(mockServerSupabase.eq).toHaveBeenCalledWith('dog_id', 'dog-1');
        expect(mockServerSupabase.order).toHaveBeenCalledWith('record_date', { ascending: false });
      });
      
      it('handles errors when fetching health records', async () => {
        // Mock the Supabase error response
        mockServerSupabase.order.mockResolvedValue({ 
          data: null, 
          error: new Error('Failed to fetch health records') 
        });
        
        // Verify that the query throws an error
        await expect(healthRecordQueries.getDogHealthRecords('dog-1')).rejects.toThrow(
          'Failed to fetch health records'
        );
      });
    });
    
    describe('getHealthRecordById', () => {
      it('fetches a health record by ID with dog information', async () => {
        // Mock the Supabase response
        const mockRecord = { 
          id: 'record-1', 
          dog_id: 'dog-1', 
          record_type: 'examination',
          dog: { id: 'dog-1', name: 'Buddy', breed: 'Bulldog' }
        };
        
        mockServerSupabase.single.mockResolvedValue({ data: mockRecord, error: null });
        
        // Call the query
        const result = await healthRecordQueries.getHealthRecordById('record-1');
        
        // Verify the result
        expect(result).toEqual(mockRecord);
        
        // Verify the Supabase calls
        expect(mockServerSupabase.from).toHaveBeenCalledWith('health_records');
        expect(mockServerSupabase.select).toHaveBeenCalledWith(`
        *,
        dog:dogs(id, name, breed)
      `);
        expect(mockServerSupabase.eq).toHaveBeenCalledWith('id', 'record-1');
        expect(mockServerSupabase.single).toHaveBeenCalled();
      });
      
      it('handles errors when fetching a health record', async () => {
        // Mock the Supabase error response
        mockServerSupabase.single.mockResolvedValue({ 
          data: null, 
          error: new Error('Health record not found') 
        });
        
        // Verify that the query throws an error
        await expect(healthRecordQueries.getHealthRecordById('record-1')).rejects.toThrow(
          'Failed to fetch health record'
        );
      });
    });
    
    describe('createHealthRecord', () => {
      it('creates a new health record', async () => {
        // Mock the Supabase response
        const mockRecord = { 
          id: 'record-1', 
          dog_id: 'dog-1', 
          record_type: 'examination',
          description: 'Annual checkup',
          record_date: '2023-01-15'
        };
        
        const newRecord = {
          dog_id: 'dog-1',
          record_type: 'examination',
          description: 'Annual checkup',
          record_date: '2023-01-15'
        };
        
        mockServerSupabase.single.mockResolvedValue({ data: mockRecord, error: null });
        
        // Call the query
        const result = await healthRecordQueries.createHealthRecord(newRecord);
        
        // Verify the result
        expect(result).toEqual(mockRecord);
        
        // Verify the Supabase calls
        expect(mockServerSupabase.from).toHaveBeenCalledWith('health_records');
        expect(mockServerSupabase.insert).toHaveBeenCalledWith(newRecord);
        expect(mockServerSupabase.select).toHaveBeenCalled();
        expect(mockServerSupabase.single).toHaveBeenCalled();
      });
      
      it('handles errors when creating a health record', async () => {
        // Mock the Supabase error response
        mockServerSupabase.single.mockResolvedValue({ 
          data: null, 
          error: new Error('Failed to create health record') 
        });
        
        // Call the query
        const newRecord = {
          dog_id: 'dog-1',
          record_type: 'examination',
          description: 'Annual checkup',
          record_date: '2023-01-15'
        };
        
        // Verify that the query throws an error
        await expect(healthRecordQueries.createHealthRecord(newRecord)).rejects.toThrow(
          'Failed to create health record'
        );
      });
    });
    
    describe('updateHealthRecord', () => {
      it('updates an existing health record', async () => {
        // Mock the Supabase response
        const mockRecord = { 
          id: 'record-1', 
          dog_id: 'dog-1', 
          record_type: 'examination',
          description: 'Updated checkup',
          record_date: '2023-01-15'
        };
        
        const updates = {
          description: 'Updated checkup'
        };
        
        mockServerSupabase.single.mockResolvedValue({ data: mockRecord, error: null });
        
        // Call the query
        const result = await healthRecordQueries.updateHealthRecord('record-1', updates);
        
        // Verify the result
        expect(result).toEqual(mockRecord);
        
        // Verify the Supabase calls
        expect(mockServerSupabase.from).toHaveBeenCalledWith('health_records');
        expect(mockServerSupabase.update).toHaveBeenCalledWith(updates);
        expect(mockServerSupabase.eq).toHaveBeenCalledWith('id', 'record-1');
        expect(mockServerSupabase.select).toHaveBeenCalled();
        expect(mockServerSupabase.single).toHaveBeenCalled();
      });
      
      it('handles errors when updating a health record', async () => {
        // Mock the Supabase error response
        mockServerSupabase.single.mockResolvedValue({ 
          data: null, 
          error: new Error('Failed to update health record') 
        });
        
        // Call the query
        const updates = {
          description: 'Updated checkup'
        };
        
        // Verify that the query throws an error
        await expect(healthRecordQueries.updateHealthRecord('record-1', updates)).rejects.toThrow(
          'Failed to update health record'
        );
      });
    });
    
    describe('deleteHealthRecord', () => {
      it('deletes a health record', async () => {
        // Mock the Supabase response
        mockServerSupabase.delete.mockResolvedValue({ error: null });
        
        // Call the query
        await healthRecordQueries.deleteHealthRecord('record-1');
        
        // Verify the Supabase calls
        expect(mockServerSupabase.from).toHaveBeenCalledWith('health_records');
        expect(mockServerSupabase.delete).toHaveBeenCalled();
        expect(mockServerSupabase.eq).toHaveBeenCalledWith('id', 'record-1');
      });
      
      it('handles errors when deleting a health record', async () => {
        // Mock the Supabase error response
        mockServerSupabase.delete.mockResolvedValue({ 
          error: new Error('Failed to delete health record') 
        });
        
        // Verify that the query throws an error
        await expect(healthRecordQueries.deleteHealthRecord('record-1')).rejects.toThrow(
          'Failed to delete health record'
        );
      });
    });
    
    describe('uploadHealthRecordDocument', () => {
      it('uploads a document for a health record', async () => {
        // Mock the file and Supabase responses
        const file = new File(['dummy content'], 'report.pdf', { type: 'application/pdf' });
        const uploadPath = 'record-1/report.pdf';
        const publicUrl = 'https://example.com/report.pdf';
        
        // Mock storage.from().upload()
        mockServerSupabase.storage.from().upload.mockResolvedValue({ 
          data: { path: uploadPath }, 
          error: null 
        });
        
        // Mock storage.from().getPublicUrl()
        mockServerSupabase.storage.from().getPublicUrl.mockReturnValue({ 
          data: { publicUrl } 
        });
        
        // Mock the record fetch response
        mockServerSupabase.single.mockResolvedValue({ 
          data: { documents: [] }, 
          error: null 
        });
        
        // Mock the update response
        mockServerSupabase.update.mockResolvedValue({ error: null });
        
        // Call the query
        const result = await healthRecordQueries.uploadHealthRecordDocument('record-1', file);
        
        // Verify the result
        expect(result).toBe(publicUrl);
        
        // Verify the Supabase calls
        expect(mockServerSupabase.storage.from).toHaveBeenCalledWith('health-documents');
        expect(mockServerSupabase.storage.from().upload).toHaveBeenCalledWith(
          expect.stringContaining('record-1/'), 
          file,
          expect.objectContaining({ cacheControl: '3600', upsert: true })
        );
        expect(mockServerSupabase.storage.from().getPublicUrl).toHaveBeenCalledWith(uploadPath);
        expect(mockServerSupabase.from).toHaveBeenCalledWith('health_records');
        expect(mockServerSupabase.select).toHaveBeenCalledWith('documents');
        expect(mockServerSupabase.eq).toHaveBeenCalledWith('id', 'record-1');
        expect(mockServerSupabase.single).toHaveBeenCalled();
        expect(mockServerSupabase.update).toHaveBeenCalledWith({ documents: [publicUrl] });
        expect(mockServerSupabase.eq).toHaveBeenCalledWith('id', 'record-1');
      });
      
      it('handles errors when uploading a document', async () => {
        // Mock the file and Supabase error response
        const file = new File(['dummy content'], 'report.pdf', { type: 'application/pdf' });
        
        // Mock storage.from().upload() error
        mockServerSupabase.storage.from().upload.mockResolvedValue({ 
          data: null, 
          error: new Error('Failed to upload document') 
        });
        
        // Verify that the query throws an error
        await expect(healthRecordQueries.uploadHealthRecordDocument('record-1', file)).rejects.toThrow(
          'Failed to upload document'
        );
      });
    });
  });
  
  describe('Client-side hooks', () => {
    describe('useHealthRecordQueries', () => {
      it('returns the expected query functions', () => {
        const queries = useHealthRecordQueries();
        
        expect(queries).toHaveProperty('getDogHealthRecords');
        expect(queries).toHaveProperty('createHealthRecord');
        expect(queries).toHaveProperty('updateHealthRecord');
        expect(queries).toHaveProperty('deleteHealthRecord');
      });
      
      describe('getDogHealthRecords', () => {
        it('fetches health records for a dog', async () => {
          // Mock the Supabase response
          const mockRecords = [
            { id: 'record-1', dog_id: 'dog-1', record_type: 'examination' },
            { id: 'record-2', dog_id: 'dog-1', record_type: 'vaccination' },
          ];
          
          mockBrowserSupabase.order.mockResolvedValue({ data: mockRecords, error: null });
          
          // Call the query
          const queries = useHealthRecordQueries();
          const result = await queries.getDogHealthRecords('dog-1');
          
          // Verify the result
          expect(result).toEqual(mockRecords);
          
          // Verify the Supabase calls
          expect(mockBrowserSupabase.from).toHaveBeenCalledWith('health_records');
          expect(mockBrowserSupabase.select).toHaveBeenCalledWith('*');
          expect(mockBrowserSupabase.eq).toHaveBeenCalledWith('dog_id', 'dog-1');
          expect(mockBrowserSupabase.order).toHaveBeenCalledWith('record_date', { ascending: false });
        });
      });
      
      describe('createHealthRecord', () => {
        it('creates a new health record with files', async () => {
          // Mock the Supabase responses
          const mockRecord = { 
            id: 'record-1', 
            dog_id: 'dog-1', 
            record_type: 'examination',
            description: 'Annual checkup',
            record_date: '2023-01-15',
            documents: []
          };
          
          const newRecord = {
            dog_id: 'dog-1',
            record_type: 'examination',
            description: 'Annual checkup',
            record_date: '2023-01-15'
          };
          
          // Mock file upload
          const file = new File(['dummy content'], 'report.pdf', { type: 'application/pdf' });
          const files = { 0: file, length: 1 } as unknown as FileList;
          
          const uploadPath = 'record-1/report.pdf';
          const publicUrl = 'https://example.com/report.pdf';
          
          // Mock insert response
          mockBrowserSupabase.single.mockResolvedValue({ data: mockRecord, error: null });
          
          // Mock storage.from().upload()
          mockBrowserSupabase.storage.from().upload.mockResolvedValue({ 
            data: { path: uploadPath }, 
            error: null 
          });
          
          // Mock storage.from().getPublicUrl()
          mockBrowserSupabase.storage.from().getPublicUrl.mockReturnValue({ 
            data: { publicUrl } 
          });
          
          // Mock update response
          mockBrowserSupabase.single.mockResolvedValueOnce({ 
            data: mockRecord, 
            error: null 
          }).mockResolvedValueOnce({ 
            data: { ...mockRecord, documents: [publicUrl] }, 
            error: null 
          });
          
          // Call the query
          const queries = useHealthRecordQueries();
          const result = await queries.createHealthRecord(newRecord, files);
          
          // Verify the result
          expect(result).toEqual({ ...mockRecord, documents: [publicUrl] });
          
          // Verify the Supabase calls
          expect(mockBrowserSupabase.from).toHaveBeenCalledWith('health_records');
          expect(mockBrowserSupabase.insert).toHaveBeenCalledWith(newRecord);
          expect(mockBrowserSupabase.storage.from).toHaveBeenCalledWith('health-documents');
          expect(mockBrowserSupabase.storage.from().upload).toHaveBeenCalledWith(
            expect.stringContaining('record-1/'), 
            file,
            expect.objectContaining({ cacheControl: '3600', upsert: true })
          );
        });
      });
    });
  });
});
