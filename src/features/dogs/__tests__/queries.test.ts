import { useDogQueries } from '../data/queries';
import { createClient } from '@/lib/supabase-browser';

// Mock the Supabase client
jest.mock('@/lib/supabase-browser', () => ({
  createClient: jest.fn(),
}));

describe('Dog Queries', () => {
  let mockSupabase: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock Supabase client
    mockSupabase = {
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
    
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });
  
  describe('getAllDogs', () => {
    it('fetches all dogs for the current user', async () => {
      // Mock the Supabase response
      const mockDogs = [
        { id: 'dog-1', name: 'Buddy' },
        { id: 'dog-2', name: 'Max' },
      ];
      
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockResolvedValue({ data: mockDogs, error: null });
      
      // Call the query
      const queries = useDogQueries();
      const result = await queries.getAllDogs();
      
      // Verify the result
      expect(result).toEqual(mockDogs);
      
      // Verify the Supabase calls
      expect(mockSupabase.from).toHaveBeenCalledWith('dogs');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.order).toHaveBeenCalledWith('name', { ascending: true });
    });
    
    it('handles errors when fetching dogs', async () => {
      // Mock the Supabase error response
      mockSupabase.order.mockResolvedValue({ data: null, error: new Error('Failed to fetch dogs') });
      
      // Call the query
      const queries = useDogQueries();
      
      // Verify that the query throws an error
      await expect(queries.getAllDogs()).rejects.toThrow('Failed to fetch dogs');
    });
  });
  
  describe('getDogById', () => {
    it('fetches a dog by ID', async () => {
      // Mock the Supabase response
      const mockDog = { id: 'dog-1', name: 'Buddy' };
      
      mockSupabase.single.mockResolvedValue({ data: mockDog, error: null });
      
      // Call the query
      const queries = useDogQueries();
      const result = await queries.getDogById('dog-1');
      
      // Verify the result
      expect(result).toEqual(mockDog);
      
      // Verify the Supabase calls
      expect(mockSupabase.from).toHaveBeenCalledWith('dogs');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'dog-1');
      expect(mockSupabase.single).toHaveBeenCalled();
    });
    
    it('handles errors when fetching a dog', async () => {
      // Mock the Supabase error response
      mockSupabase.single.mockResolvedValue({ data: null, error: new Error('Dog not found') });
      
      // Call the query
      const queries = useDogQueries();
      
      // Verify that the query throws an error
      await expect(queries.getDogById('dog-1')).rejects.toThrow('Failed to fetch dog');
    });
  });
  
  describe('createDog', () => {
    it('creates a new dog', async () => {
      // Mock the Supabase response
      const mockDog = { id: 'dog-1', name: 'Buddy', breed: 'Bulldog' };
      const newDog = { name: 'Buddy', breed: 'Bulldog', owner_id: 'user-1' };
      
      mockSupabase.single.mockResolvedValue({ data: mockDog, error: null });
      
      // Call the query
      const queries = useDogQueries();
      const result = await queries.createDog(newDog);
      
      // Verify the result
      expect(result).toEqual(mockDog);
      
      // Verify the Supabase calls
      expect(mockSupabase.from).toHaveBeenCalledWith('dogs');
      expect(mockSupabase.insert).toHaveBeenCalledWith(newDog);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.single).toHaveBeenCalled();
    });
    
    it('handles errors when creating a dog', async () => {
      // Mock the Supabase error response
      mockSupabase.single.mockResolvedValue({ data: null, error: new Error('Failed to create dog') });
      
      // Call the query
      const queries = useDogQueries();
      const newDog = { name: 'Buddy', breed: 'Bulldog', owner_id: 'user-1' };
      
      // Verify that the query throws an error
      await expect(queries.createDog(newDog)).rejects.toThrow('Failed to create dog');
    });
  });
  
  describe('updateDog', () => {
    it('updates an existing dog', async () => {
      // Mock the Supabase response
      const mockDog = { id: 'dog-1', name: 'Buddy Updated', breed: 'Bulldog' };
      const updates = { name: 'Buddy Updated' };
      
      mockSupabase.single.mockResolvedValue({ data: mockDog, error: null });
      
      // Call the query
      const queries = useDogQueries();
      const result = await queries.updateDog('dog-1', updates);
      
      // Verify the result
      expect(result).toEqual(mockDog);
      
      // Verify the Supabase calls
      expect(mockSupabase.from).toHaveBeenCalledWith('dogs');
      expect(mockSupabase.update).toHaveBeenCalledWith(updates);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'dog-1');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.single).toHaveBeenCalled();
    });
    
    it('handles errors when updating a dog', async () => {
      // Mock the Supabase error response
      mockSupabase.single.mockResolvedValue({ data: null, error: new Error('Failed to update dog') });
      
      // Call the query
      const queries = useDogQueries();
      const updates = { name: 'Buddy Updated' };
      
      // Verify that the query throws an error
      await expect(queries.updateDog('dog-1', updates)).rejects.toThrow('Failed to update dog');
    });
  });
  
  describe('deleteDog', () => {
    it('deletes a dog', async () => {
      // Mock the Supabase response
      mockSupabase.delete.mockResolvedValue({ error: null });
      
      // Call the query
      const queries = useDogQueries();
      const result = await queries.deleteDog('dog-1');
      
      // Verify the result
      expect(result).toBe(true);
      
      // Verify the Supabase calls
      expect(mockSupabase.from).toHaveBeenCalledWith('dogs');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'dog-1');
    });
    
    it('handles errors when deleting a dog', async () => {
      // Mock the Supabase error response
      mockSupabase.delete.mockResolvedValue({ error: new Error('Failed to delete dog') });
      
      // Call the query
      const queries = useDogQueries();
      
      // Verify that the query throws an error
      await expect(queries.deleteDog('dog-1')).rejects.toThrow('Failed to delete dog');
    });
  });
  
  describe('uploadDogImage', () => {
    it('uploads a dog image', async () => {
      // Mock the file and Supabase responses
      const file = new File(['dummy content'], 'dog.jpg', { type: 'image/jpeg' });
      const uploadPath = 'dog-1/dog.jpg';
      const publicUrl = 'https://example.com/dog.jpg';
      
      // Mock storage.from().upload()
      mockSupabase.storage.from().upload.mockResolvedValue({ 
        data: { path: uploadPath }, 
        error: null 
      });
      
      // Mock storage.from().getPublicUrl()
      mockSupabase.storage.from().getPublicUrl.mockReturnValue({ 
        data: { publicUrl } 
      });
      
      // Mock the update response
      mockSupabase.single.mockResolvedValue({ 
        data: { id: 'dog-1', profile_image_url: publicUrl }, 
        error: null 
      });
      
      // Call the query
      const queries = useDogQueries();
      const result = await queries.uploadDogImage('dog-1', file);
      
      // Verify the result
      expect(result).toBe(publicUrl);
      
      // Verify the Supabase calls
      expect(mockSupabase.storage.from).toHaveBeenCalledWith('dog-images');
      expect(mockSupabase.storage.from().upload).toHaveBeenCalledWith(
        expect.stringContaining('dog-1/'), 
        file,
        expect.objectContaining({ cacheControl: '3600', upsert: true })
      );
      expect(mockSupabase.storage.from().getPublicUrl).toHaveBeenCalledWith(uploadPath);
      expect(mockSupabase.from).toHaveBeenCalledWith('dogs');
      expect(mockSupabase.update).toHaveBeenCalledWith({ profile_image_url: publicUrl });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'dog-1');
    });
    
    it('handles errors when uploading an image', async () => {
      // Mock the file and Supabase error response
      const file = new File(['dummy content'], 'dog.jpg', { type: 'image/jpeg' });
      
      // Mock storage.from().upload() error
      mockSupabase.storage.from().upload.mockResolvedValue({ 
        data: null, 
        error: new Error('Failed to upload image') 
      });
      
      // Call the query
      const queries = useDogQueries();
      
      // Verify that the query throws an error
      await expect(queries.uploadDogImage('dog-1', file)).rejects.toThrow('Failed to upload dog image');
    });
  });
  
  describe('removeDogImage', () => {
    it('removes a dog image', async () => {
      // Mock the Supabase responses
      const imageUrl = 'https://example.com/dog-images/dog-1/image.jpg';
      
      // Mock the fetch response
      mockSupabase.single.mockResolvedValueOnce({ 
        data: { profile_image_url: imageUrl }, 
        error: null 
      });
      
      // Mock storage.from().remove()
      mockSupabase.storage.from().remove.mockResolvedValue({ 
        data: {}, 
        error: null 
      });
      
      // Mock the update response
      mockSupabase.update.mockResolvedValue({ 
        error: null 
      });
      
      // Call the query
      const queries = useDogQueries();
      await queries.removeDogImage('dog-1');
      
      // Verify the Supabase calls
      expect(mockSupabase.from).toHaveBeenCalledWith('dogs');
      expect(mockSupabase.select).toHaveBeenCalledWith('profile_image_url');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'dog-1');
      expect(mockSupabase.single).toHaveBeenCalled();
      
      expect(mockSupabase.storage.from).toHaveBeenCalledWith('dog-images');
      expect(mockSupabase.storage.from().remove).toHaveBeenCalled();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('dogs');
      expect(mockSupabase.update).toHaveBeenCalledWith({ profile_image_url: null });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'dog-1');
    });
    
    it('handles errors when removing an image', async () => {
      // Mock the Supabase error response
      mockSupabase.single.mockResolvedValue({ 
        data: null, 
        error: new Error('Failed to fetch dog') 
      });
      
      // Call the query
      const queries = useDogQueries();
      
      // Verify that the query throws an error
      await expect(queries.removeDogImage('dog-1')).rejects.toThrow('Failed to fetch dog');
    });
    
    it('does nothing if the dog has no image', async () => {
      // Mock the Supabase responses
      mockSupabase.single.mockResolvedValue({ 
        data: { profile_image_url: null }, 
        error: null 
      });
      
      // Call the query
      const queries = useDogQueries();
      await queries.removeDogImage('dog-1');
      
      // Verify that storage.from().remove() was not called
      expect(mockSupabase.storage.from().remove).not.toHaveBeenCalled();
      expect(mockSupabase.update).not.toHaveBeenCalled();
    });
  });
});
