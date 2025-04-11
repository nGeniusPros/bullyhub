import { supabase } from '../utils/supabase-client.js';

async function galleryHandler(req, res) {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch gallery images' });
    }

    return res.status(200).json({ images: data });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

export const handler = async (event, context) => {
  const req = {
    method: event.httpMethod,
  };

  const res = {
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      return {
        statusCode: this.statusCode || 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      };
    },
  };

  return await galleryHandler(req, res);
};
