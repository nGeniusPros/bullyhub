import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HealthRecordForm } from '../components/HealthRecordForm';
import { useHealthRecordQueries } from '../data/queries';
import { useDogQueries } from '@/features/dogs/data/queries';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Mock the dependencies
jest.mock('../data/queries', () => ({
  useHealthRecordQueries: jest.fn(),
}));

jest.mock('@/features/dogs/data/queries', () => ({
  useDogQueries: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('HealthRecordForm', () => {
  const mockDogId = 'dog-123';
  const mockOnSuccess = jest.fn();
  const mockCreateHealthRecord = jest.fn();
  const mockUpdateHealthRecord = jest.fn();
  const mockGetAllDogs = jest.fn();
  const mockPush = jest.fn();
  const mockBack = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the useHealthRecordQueries hook
    (useHealthRecordQueries as jest.Mock).mockReturnValue({
      createHealthRecord: mockCreateHealthRecord,
      updateHealthRecord: mockUpdateHealthRecord,
    });
    
    // Mock the useDogQueries hook
    (useDogQueries as jest.Mock).mockReturnValue({
      getAllDogs: mockGetAllDogs,
    });
    
    // Mock the useRouter hook
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
    
    // Mock the getAllDogs response
    mockGetAllDogs.mockResolvedValue([
      { id: 'dog-123', name: 'Buddy' },
      { id: 'dog-456', name: 'Max' },
    ]);
  });
  
  it('renders the form with default values', async () => {
    render(<HealthRecordForm />);
    
    // Wait for dogs to load
    await waitFor(() => {
      expect(mockGetAllDogs).toHaveBeenCalled();
    });
    
    // Check form elements
    expect(screen.getByText('Dog')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Record Type')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Provider')).toBeInTheDocument();
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Record')).toBeInTheDocument();
  });
  
  it('pre-selects the dog when dogId is provided', async () => {
    render(<HealthRecordForm dogId={mockDogId} />);
    
    // Wait for dogs to load
    await waitFor(() => {
      expect(mockGetAllDogs).toHaveBeenCalled();
    });
    
    // Check that the dog select is disabled and has the correct value
    const dogSelect = screen.getByText('Select a dog').closest('button');
    expect(dogSelect).toBeDisabled();
  });
  
  it('loads existing record data when provided', async () => {
    const mockRecord = {
      id: 'record-123',
      dog_id: 'dog-123',
      record_date: '2023-01-15',
      record_type: 'examination',
      description: 'Annual checkup',
      provider: 'Dr. Smith',
      results: 'All good',
      notes: 'Follow up in 6 months',
      documents: ['https://example.com/doc.pdf'],
      created_at: '2023-01-15T12:00:00Z',
      updated_at: '2023-01-15T12:00:00Z',
    };
    
    render(<HealthRecordForm existingRecord={mockRecord} />);
    
    // Wait for dogs to load
    await waitFor(() => {
      expect(mockGetAllDogs).toHaveBeenCalled();
    });
    
    // Check that form fields have the correct values
    expect(screen.getByDisplayValue('Annual checkup')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All good')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Follow up in 6 months')).toBeInTheDocument();
    
    // Check that the update button is shown
    expect(screen.getByText('Update Record')).toBeInTheDocument();
  });
  
  it('validates required fields on submit', async () => {
    render(<HealthRecordForm />);
    
    // Wait for dogs to load
    await waitFor(() => {
      expect(mockGetAllDogs).toHaveBeenCalled();
    });
    
    // Submit the form without filling required fields
    fireEvent.click(screen.getByText('Save Record'));
    
    // Check that validation errors are shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please select a dog');
    });
    
    // Select a dog and try again
    fireEvent.click(screen.getByText('Select a dog'));
    fireEvent.click(screen.getByText('Buddy'));
    
    fireEvent.click(screen.getByText('Save Record'));
    
    // Check that date validation error is shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please select a date');
    });
    
    // No need to test all validations, just ensure the pattern works
  });
  
  it('creates a new health record on submit', async () => {
    // Mock successful creation
    mockCreateHealthRecord.mockResolvedValue({
      id: 'new-record-123',
      dog_id: 'dog-123',
    });
    
    render(<HealthRecordForm dogId={mockDogId} />);
    
    // Wait for dogs to load
    await waitFor(() => {
      expect(mockGetAllDogs).toHaveBeenCalled();
    });
    
    // Fill out the form
    // Select date
    fireEvent.click(screen.getByText('Select a date'));
    fireEvent.click(screen.getByRole('gridcell', { name: '15' }));
    
    // Select record type
    fireEvent.click(screen.getByText('Select a record type'));
    fireEvent.click(screen.getByText('Examination'));
    
    // Fill description
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Annual checkup' },
    });
    
    // Fill provider
    fireEvent.change(screen.getByLabelText('Provider'), {
      target: { value: 'Dr. Smith' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Record'));
    
    // Check that the record was created
    await waitFor(() => {
      expect(mockCreateHealthRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          dog_id: 'dog-123',
          record_type: 'examination',
          description: 'Annual checkup',
          provider: 'Dr. Smith',
        }),
        undefined
      );
      expect(toast.success).toHaveBeenCalledWith('Health record created successfully');
      expect(mockPush).toHaveBeenCalledWith('/dashboard/health/dog-123');
    });
  });
  
  it('updates an existing health record on submit', async () => {
    // Mock existing record
    const mockRecord = {
      id: 'record-123',
      dog_id: 'dog-123',
      record_date: '2023-01-15',
      record_type: 'examination',
      description: 'Annual checkup',
      provider: 'Dr. Smith',
      results: 'All good',
      notes: 'Follow up in 6 months',
      documents: [],
      created_at: '2023-01-15T12:00:00Z',
      updated_at: '2023-01-15T12:00:00Z',
    };
    
    // Mock successful update
    mockUpdateHealthRecord.mockResolvedValue({
      ...mockRecord,
      description: 'Updated checkup',
    });
    
    render(<HealthRecordForm existingRecord={mockRecord} onSuccess={mockOnSuccess} />);
    
    // Wait for dogs to load
    await waitFor(() => {
      expect(mockGetAllDogs).toHaveBeenCalled();
    });
    
    // Update the description
    fireEvent.change(screen.getByDisplayValue('Annual checkup'), {
      target: { value: 'Updated checkup' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Update Record'));
    
    // Check that the record was updated
    await waitFor(() => {
      expect(mockUpdateHealthRecord).toHaveBeenCalledWith(
        'record-123',
        expect.objectContaining({
          description: 'Updated checkup',
        }),
        undefined
      );
      expect(toast.success).toHaveBeenCalledWith('Health record updated successfully');
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
  
  it('handles file uploads', async () => {
    render(<HealthRecordForm dogId={mockDogId} />);
    
    // Wait for dogs to load
    await waitFor(() => {
      expect(mockGetAllDogs).toHaveBeenCalled();
    });
    
    // Create a mock file
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    // Add a file to the file input
    const fileInput = screen.getByLabelText(/Upload medical reports/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Fill required fields
    fireEvent.click(screen.getByText('Select a date'));
    fireEvent.click(screen.getByRole('gridcell', { name: '15' }));
    
    fireEvent.click(screen.getByText('Select a record type'));
    fireEvent.click(screen.getByText('Examination'));
    
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Annual checkup' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Record'));
    
    // Check that the record was created with the file
    await waitFor(() => {
      expect(mockCreateHealthRecord).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          0: file,
          length: 1,
        })
      );
    });
  });
  
  it('navigates back on cancel', () => {
    render(<HealthRecordForm />);
    
    // Click the cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Check that router.back was called
    expect(mockBack).toHaveBeenCalled();
  });
});
