'use client';

import { PedigreeData } from '@/types';
import Image from 'next/image';

interface PedigreeTreeProps {
  pedigree: PedigreeData;
}

export function PedigreeTree({ pedigree }: PedigreeTreeProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px] p-6">
        <div className="flex flex-col">
          {/* Root Dog (Generation 0) */}
          <div className="flex justify-center mb-12">
            <DogCard dog={pedigree.dog} isRoot={true} />
          </div>
          
          {/* Parents (Generation 1) */}
          <div className="flex justify-between mb-12">
            <div className="flex-1 flex justify-center">
              {pedigree.sire ? (
                <DogCard dog={pedigree.sire} />
              ) : (
                <EmptyDogCard label="Sire Unknown" />
              )}
            </div>
            <div className="flex-1 flex justify-center">
              {pedigree.dam ? (
                <DogCard dog={pedigree.dam} />
              ) : (
                <EmptyDogCard label="Dam Unknown" />
              )}
            </div>
          </div>
          
          {/* Grandparents (Generation 2) */}
          <div className="flex justify-between">
            <div className="flex-1 flex justify-center">
              {pedigree.sire?.sire ? (
                <DogCard dog={pedigree.sire.sire} />
              ) : (
                <EmptyDogCard label="Grandsire Unknown" />
              )}
            </div>
            <div className="flex-1 flex justify-center">
              {pedigree.sire?.dam ? (
                <DogCard dog={pedigree.sire.dam} />
              ) : (
                <EmptyDogCard label="Granddam Unknown" />
              )}
            </div>
            <div className="flex-1 flex justify-center">
              {pedigree.dam?.sire ? (
                <DogCard dog={pedigree.dam.sire} />
              ) : (
                <EmptyDogCard label="Grandsire Unknown" />
              )}
            </div>
            <div className="flex-1 flex justify-center">
              {pedigree.dam?.dam ? (
                <DogCard dog={pedigree.dam.dam} />
              ) : (
                <EmptyDogCard label="Granddam Unknown" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DogCardProps {
  dog: {
    id: string;
    name: string;
    breed?: string;
    color?: string;
    dateOfBirth?: string;
    registrationNumber?: string;
    image?: string | null;
  };
  isRoot?: boolean;
}

function DogCard({ dog, isRoot = false }: DogCardProps) {
  return (
    <div
      className={`${
        isRoot ? 'w-64' : 'w-48'
      } bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:border-primary/50 transition-all duration-200`}
    >
      {dog.image ? (
        <div className="aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={dog.image}
            alt={dog.name}
            width={isRoot ? 256 : 192}
            height={isRoot ? 256 : 192}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-square w-full flex items-center justify-center bg-gray-100 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${isRoot ? 'w-16 h-16' : 'w-12 h-12'}`}
          >
            <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
            <path d="M14.5 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5" />
            <path d="M8 14v.5" />
            <path d="M16 14v.5" />
            <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
            <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
          </svg>
        </div>
      )}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate">{dog.name}</h3>
        {dog.registrationNumber && (
          <p className="text-sm text-gray-500">#{dog.registrationNumber}</p>
        )}
        {dog.color && (
          <div className="mt-2">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
              {dog.color}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyDogCard({ label }: { label: string }) {
  return (
    <div className="w-48 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center p-4 text-gray-400 text-sm font-medium">
      {label}
    </div>
  );
}
