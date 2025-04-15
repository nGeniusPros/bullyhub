import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DogProfileImageUpload } from '../components/DogProfileImageUpload';
import { useDogQueries } from '../data/queries';
import { toast } from 'sonner';

// Mock the dependencies
jest.mock('../data/queries', () => ({
  useDogQueries: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('DogProfileImageUpload', () => {
  const mockDogId = 'dog-123';
  const mockOnImageUploaded = jest.fn();
  const mockUploadDogImage = jest.fn();
  const mockRemoveDogImage = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the useDogQueries hook
    (useDogQueries as jest.Mock).mockReturnValue({
      uploadDogImage: mockUploadDogImage,
      removeDogImage: mockRemoveDogImage,
    });
  });
  
  it('renders without crashing', () => {
    render(
      <DogProfileImageUpload
        dogId={mockDogId}
        onImageUploaded={mockOnImageUploaded}
      />
    );
    
    expect(screen.getByText('Click to upload image')).toBeInTheDocument();
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });
  
  it('displays the current image when provided', () => {
    const mockImageUrl = 'https://example.com/dog.jpg';
    
    render(
      <DogProfileImageUpload
        dogId={mockDogId}
        currentImageUrl={mockImageUrl}
        onImageUploaded={mockOnImageUploaded}
      />
    );
    
    const image = screen.getByAltText('Dog profile');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockImageUrl);
    expect(screen.getByText('Change Image')).toBeInTheDocument();
  });
  
  it('handles file upload successfully', async () => {
    const mockImageUrl = 'https://example.com/uploaded.jpg';
    mockUploadDogImage.mockResolvedValue(mockImageUrl);
    
    render(
      <DogProfileImageUpload
        dogId={mockDogId}
        onImageUploaded={mockOnImageUploaded}
      />
    );
    
    // Create a mock file
    const file = new File(['dummy content'], 'dog.png', { type: 'image/png' });
    const input = screen.getByLabelText('Upload Image');
    
    // Simulate file selection
    fireEvent.change(input, { target: { files: [file] } });
    
    // Wait for the upload to complete
    await waitFor(() => {
      expect(mockUploadDogImage).toHaveBeenCalledWith(mockDogId, file);
      expect(mockOnImageUploaded).toHaveBeenCalledWith(mockImageUrl);
      expect(toast.success).toHaveBeenCalledWith('Profile image updated successfully');
    });
  });
  
  it('handles file upload error', async () => {
    mockUploadDogImage.mockRejectedValue(new Error('Upload failed'));
    
    render(
      <DogProfileImageUpload
        dogId={mockDogId}
        onImageUploaded={mockOnImageUploaded}
      />
    );
    
    // Create a mock file
    const file = new File(['dummy content'], 'dog.png', { type: 'image/png' });
    const input = screen.getByLabelText('Upload Image');
    
    // Simulate file selection
    fireEvent.change(input, { target: { files: [file] } });
    
    // Wait for the upload to fail
    await waitFor(() => {
      expect(mockUploadDogImage).toHaveBeenCalledWith(mockDogId, file);
      expect(toast.error).toHaveBeenCalledWith('Failed to upload profile image');
    });
  });
  
  it('handles image removal', async () => {
    const mockImageUrl = 'https://example.com/dog.jpg';
    
    render(
      <DogProfileImageUpload
        dogId={mockDogId}
        currentImageUrl={mockImageUrl}
        onImageUploaded={mockOnImageUploaded}
      />
    );
    
    // Mock the confirm dialog to return true
    window.confirm = jest.fn().mockReturnValue(true);
    
    // Click the remove button
    const removeButton = screen.getByLabelText('Remove image');
    fireEvent.click(removeButton);
    
    // Wait for the removal to complete
    await waitFor(() => {
      expect(mockRemoveDogImage).toHaveBeenCalledWith(mockDogId);
      expect(mockOnImageUploaded).toHaveBeenCalledWith('');
      expect(toast.success).toHaveBeenCalledWith('Profile image removed successfully');
    });
  });
  
  it('validates file type', async () => {
    render(
      <DogProfileImageUpload
        dogId={mockDogId}
        onImageUploaded={mockOnImageUploaded}
      />
    );
    
    // Create a mock file with invalid type
    const file = new File(['dummy content'], 'dog.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Image');
    
    // Simulate file selection
    fireEvent.change(input, { target: { files: [file] } });
    
    // Wait for validation error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please select an image file');
      expect(mockUploadDogImage).not.toHaveBeenCalled();
    });
  });
  
  it('validates file size', async () => {
    render(
      <DogProfileImageUpload
        dogId={mockDogId}
        onImageUploaded={mockOnImageUploaded}
      />
    );
    
    // Create a mock file with size > 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Upload Image');
    
    // Simulate file selection
    fireEvent.change(input, { target: { files: [largeFile] } });
    
    // Wait for validation error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Image size should be less than 5MB');
      expect(mockUploadDogImage).not.toHaveBeenCalled();
    });
  });
});
