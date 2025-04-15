import React from 'react';
import { render, screen } from '@testing-library/react';
import { DNAResultsView } from '../DNAResultsView';

// Mock the DNA test data
jest.mock('../../data/queries', () => ({
  dnaTestingQueries: {
    getDNATestsByDogId: jest.fn(),
  },
  useDNATestingQueries: () => ({
    dnaTests: { data: mockDNATests, isLoading: false, error: null },
  }),
}));

// Mock data
const mockDNATests = [
  {
    id: '1',
    dogId: '1',
    testType: 'color-genetics',
    testProvider: 'Embark',
    testDate: '2023-03-10',
    results: {
      markers: {
        'B': {
          name: 'B Locus (Brown)',
          value: 'B/b',
          description: 'Dog carries one copy of brown',
        },
        'D': {
          name: 'D Locus (Dilute)',
          value: 'D/D',
          description: 'Dog does not carry dilute',
        },
        'K': {
          name: 'K Locus (Dominant Black)',
          value: 'k/k',
          description: 'Dog does not carry dominant black',
        },
      },
    },
  },
  {
    id: '2',
    dogId: '1',
    testType: 'health-markers',
    testProvider: 'Wisdom Panel',
    testDate: '2023-04-15',
    results: {
      markers: {
        'DM': {
          name: 'Degenerative Myelopathy',
          value: 'Clear',
          description: 'Dog does not carry the mutation',
        },
        'EIC': {
          name: 'Exercise-Induced Collapse',
          value: 'Carrier',
          description: 'Dog carries one copy of the mutation',
        },
      },
    },
  },
];

describe('DNAResultsView Component', () => {
  it('renders the DNA results view component', () => {
    render(<DNAResultsView dogId="1" />);
    
    // Check if the component renders
    expect(screen.getByText('DNA Test Results')).toBeInTheDocument();
  });

  it('displays DNA test providers', () => {
    render(<DNAResultsView dogId="1" />);
    
    // Check if test providers are displayed
    expect(screen.getByText('Embark')).toBeInTheDocument();
    expect(screen.getByText('Wisdom Panel')).toBeInTheDocument();
  });

  it('displays color genetics markers', () => {
    render(<DNAResultsView dogId="1" />);
    
    // Check if color genetics markers are displayed
    expect(screen.getByText('B Locus (Brown)')).toBeInTheDocument();
    expect(screen.getByText('D Locus (Dilute)')).toBeInTheDocument();
    expect(screen.getByText('K Locus (Dominant Black)')).toBeInTheDocument();
  });

  it('displays health markers', () => {
    render(<DNAResultsView dogId="1" />);
    
    // Check if health markers are displayed
    expect(screen.getByText('Degenerative Myelopathy')).toBeInTheDocument();
    expect(screen.getByText('Exercise-Induced Collapse')).toBeInTheDocument();
  });

  it('displays marker values correctly', () => {
    render(<DNAResultsView dogId="1" />);
    
    // Check if marker values are displayed
    expect(screen.getByText('B/b')).toBeInTheDocument();
    expect(screen.getByText('D/D')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText('Carrier')).toBeInTheDocument();
  });
});
