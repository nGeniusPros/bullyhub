import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.match(/\/id\/(\d+)/)?.[1];
  
  if (!id) {
    return NextResponse.json(
      { error: 'Invalid path: id parameter is required' },
      { status: 400 }
    );
  }

  // Example response
  return NextResponse.json({
    message: 'Successfully accessed breeding program dogs endpoint',
    id: id,
    breed: 'Bulldog'
  });
}

export const generateStaticParams = async () => {
  // Replace this with actual data fetching logic
  return [
    {
      params: {
        id: '1'
      }
    },
    {
      params: {
        id: '2'
      }
    }
  ];
};
