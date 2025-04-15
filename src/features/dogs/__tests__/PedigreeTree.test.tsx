import React from 'react';
import { render, screen } from '@testing-library/react';
import { PedigreeTree } from '../components/PedigreeTree';
import { PedigreeData } from '../types';

// Mock the Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe('PedigreeTree', () => {
  const mockPedigree: PedigreeData = {
    dog: {
      id: 'dog-1',
      name: 'Buddy',
      breed: 'Bulldog',
      color: 'Brindle',
      date_of_birth: '2020-01-01',
      registration_number: 'REG123',
      image: 'https://example.com/buddy.jpg',
    },
    sire: {
      dog: {
        id: 'dog-2',
        name: 'Max',
        breed: 'Bulldog',
        color: 'Fawn',
        date_of_birth: '2018-01-01',
        registration_number: 'REG456',
        image: 'https://example.com/max.jpg',
      },
      sire: {
        dog: {
          id: 'dog-4',
          name: 'Rocky',
          breed: 'Bulldog',
          color: 'Brindle',
          date_of_birth: '2016-01-01',
          registration_number: 'REG789',
          image: null,
        }
      },
      dam: {
        dog: {
          id: 'dog-5',
          name: 'Daisy',
          breed: 'Bulldog',
          color: 'White',
          date_of_birth: '2016-06-01',
          registration_number: 'REG101',
          image: 'https://example.com/daisy.jpg',
        }
      }
    },
    dam: {
      dog: {
        id: 'dog-3',
        name: 'Bella',
        breed: 'Bulldog',
        color: 'White',
        date_of_birth: '2017-01-01',
        registration_number: 'REG789',
        image: 'https://example.com/bella.jpg',
      },
      sire: {
        dog: {
          id: 'dog-6',
          name: 'Duke',
          breed: 'Bulldog',
          color: 'Brindle',
          date_of_birth: '2015-01-01',
          registration_number: 'REG202',
          image: null,
        }
      },
      dam: null
    }
  };

  it('renders the pedigree tree with all available dogs', () => {
    render(<PedigreeTree pedigree={mockPedigree} />);
    
    // Check root dog
    expect(screen.getByText('Buddy')).toBeInTheDocument();
    
    // Check parents
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Bella')).toBeInTheDocument();
    
    // Check grandparents
    expect(screen.getByText('Rocky')).toBeInTheDocument();
    expect(screen.getByText('Daisy')).toBeInTheDocument();
    expect(screen.getByText('Duke')).toBeInTheDocument();
    expect(screen.getByText('Granddam Unknown')).toBeInTheDocument();
  });
  
  it('renders empty placeholders for missing dogs', () => {
    const incompletePedigree: PedigreeData = {
      dog: mockPedigree.dog,
      sire: null,
      dam: null
    };
    
    render(<PedigreeTree pedigree={incompletePedigree} />);
    
    // Check root dog
    expect(screen.getByText('Buddy')).toBeInTheDocument();
    
    // Check missing parents
    expect(screen.getByText('Sire Unknown')).toBeInTheDocument();
    expect(screen.getByText('Dam Unknown')).toBeInTheDocument();
    
    // Check missing grandparents
    expect(screen.getAllByText('Grandsire Unknown').length).toBe(2);
    expect(screen.getAllByText('Granddam Unknown').length).toBe(2);
  });
  
  it('displays registration numbers when available', () => {
    render(<PedigreeTree pedigree={mockPedigree} />);
    
    expect(screen.getByText('#REG123')).toBeInTheDocument();
    expect(screen.getByText('#REG456')).toBeInTheDocument();
    expect(screen.getByText('#REG789')).toBeInTheDocument();
  });
  
  it('displays color badges when available', () => {
    render(<PedigreeTree pedigree={mockPedigree} />);
    
    expect(screen.getByText('Brindle')).toBeInTheDocument();
    expect(screen.getByText('Fawn')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
  });
  
  it('renders images when available', () => {
    render(<PedigreeTree pedigree={mockPedigree} />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(4); // Buddy, Max, Daisy, Bella
    
    expect(images[0]).toHaveAttribute('src', 'https://example.com/buddy.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Buddy');
  });
});
