import React from 'react';
import { render, screen } from '@testing-library/react';
import { HealthClearanceList } from '../HealthClearanceList';

// Mock the health clearances data
jest.mock('../../data/queries', () => ({
  healthClearanceQueries: {
    getAllHealthClearances: jest.fn(),
  },
  useHealthClearanceQueries: () => ({
    healthClearances: { data: mockHealthClearances, isLoading: false, error: null },
  }),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock data
const mockHealthClearances = [
  {
    id: '1',
    dogId: '1',
    test: 'Hip Evaluation',
    date: '2023-01-15',
    result: 'OFA Good',
    status: 'passed',
    expiryDate: '2025-01-15',
    verificationNumber: 'OFA123456',
    dog: {
      id: '1',
      name: 'Rex',
      breed: 'Bulldog',
      color: 'Brindle',
    },
  },
  {
    id: '2',
    dogId: '2',
    test: 'Cardiac Evaluation',
    date: '2023-02-20',
    result: 'Normal',
    status: 'passed',
    expiryDate: '2024-02-20',
    verificationNumber: 'CARD987654',
    dog: {
      id: '2',
      name: 'Bella',
      breed: 'French Bulldog',
      color: 'Fawn',
    },
  },
];

describe('HealthClearanceList Component', () => {
  it('renders the health clearance list component', () => {
    render(<HealthClearanceList />);
    
    // Check if the component renders
    expect(screen.getByText('Health Clearances')).toBeInTheDocument();
  });

  it('displays health clearances when data is loaded', () => {
    render(<HealthClearanceList />);
    
    // Check if health clearances are displayed
    expect(screen.getByText('Hip Evaluation')).toBeInTheDocument();
    expect(screen.getByText('Cardiac Evaluation')).toBeInTheDocument();
    expect(screen.getByText('Rex')).toBeInTheDocument();
    expect(screen.getByText('Bella')).toBeInTheDocument();
  });

  it('displays status badges correctly', () => {
    render(<HealthClearanceList />);
    
    // Check if status badges are displayed
    const passedBadges = screen.getAllByText('Passed');
    expect(passedBadges.length).toBe(2);
  });

  it('displays expiry dates correctly', () => {
    render(<HealthClearanceList />);
    
    // Check if expiry dates are displayed
    expect(screen.getByText('Expires: Jan 15, 2025')).toBeInTheDocument();
    expect(screen.getByText('Expires: Feb 20, 2024')).toBeInTheDocument();
  });
});
