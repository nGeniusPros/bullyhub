import { studServiceQueries, useStudServiceQueries } from '../queries';
import { createClient } from '@/lib/supabase-server';
import { createClient as createBrowserClient } from '@/lib/supabase-browser';

// Mock the Supabase clients
jest.mock('@/lib/supabase-server', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/lib/supabase-browser', () => ({
  createClient: jest.fn(),
}));

describe('Stud Service Queries', () => {
  // Mock data
  const mockStudService = {
    id: 'service1',
    stud_id: 'dog1',
    fee: 500,
    description: 'Test stud service',
    availability: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    stud: {
      id: 'dog1',
      name: 'Rex',
      breed: 'Bulldog',
      color: 'Brindle',
      date_of_birth: '2020-01-01',
      owner_id: 'user1',
      profiles: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      },
    },
  };

  const mockBooking = {
    id: 'booking1',
    stud_service_id: 'service1',
    client_id: 'user2',
    female_dog_id: 'dog2',
    status: 'pending',
    scheduled_date: '2023-06-01',
    notes: 'Test booking',
    created_at: '2023-01-01T00:00:00Z',
    female_dog: {
      id: 'dog2',
      name: 'Bella',
      breed: 'Bulldog',
      color: 'White',
    },
    client: {
      id: 'user2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
    },
  };

  // Mock Supabase responses
  const mockSelect = jest.fn();
  const mockFrom = jest.fn(() => ({ select: mockSelect }));
  const mockSupabase = { from: mockFrom };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    (createBrowserClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('Server-side queries', () => {
    it('getAllStudServices should fetch and format stud services', async () => {
      // Setup mock chain
      const mockEq = jest.fn();
      const mockOrder = jest.fn(() => ({ eq: mockEq }));
      mockSelect.mockReturnValue({ order: mockOrder });
      mockOrder.mockReturnValue({ data: [mockStudService], error: null });

      const result = await studServiceQueries.getAllStudServices();

      expect(mockFrom).toHaveBeenCalledWith('stud_services');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      
      expect(result).toEqual([{
        id: 'service1',
        studId: 'dog1',
        fee: 500,
        description: 'Test stud service',
        availability: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        stud: {
          id: 'dog1',
          name: 'Rex',
          breed: 'Bulldog',
          color: 'Brindle',
          dateOfBirth: '2020-01-01',
          ownerId: 'user1',
          owner: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
        },
      }]);
    });

    it('getStudBookings should fetch and format bookings', async () => {
      // Setup mock chain
      const mockEq = jest.fn();
      const mockOrder = jest.fn(() => ({ eq: mockEq }));
      mockSelect.mockReturnValue({ order: mockOrder });
      mockEq.mockReturnValue({ order: mockOrder });
      mockOrder.mockReturnValue({ data: [mockBooking], error: null });

      const result = await studServiceQueries.getStudBookings('service1');

      expect(mockFrom).toHaveBeenCalledWith('stud_bookings');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('stud_service_id', 'service1');
      
      expect(result).toEqual([{
        id: 'booking1',
        studServiceId: 'service1',
        clientId: 'user2',
        femaleDogId: 'dog2',
        status: 'pending',
        scheduledDate: '2023-06-01',
        notes: 'Test booking',
        createdAt: '2023-01-01T00:00:00Z',
        femaleDog: {
          id: 'dog2',
          name: 'Bella',
          breed: 'Bulldog',
          color: 'White',
        },
        client: {
          id: 'user2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
        },
      }]);
    });
  });

  describe('Client-side queries', () => {
    it('should return client-side query functions', () => {
      const queries = useStudServiceQueries();
      
      expect(queries).toHaveProperty('getAllStudServices');
      expect(queries).toHaveProperty('getStudService');
      expect(queries).toHaveProperty('createStudService');
      expect(queries).toHaveProperty('updateStudService');
      expect(queries).toHaveProperty('deleteStudService');
      expect(queries).toHaveProperty('subscribeToStudServices');
      expect(queries).toHaveProperty('getStudBookings');
      expect(queries).toHaveProperty('createStudBooking');
      expect(queries).toHaveProperty('updateStudBooking');
    });
  });
});
