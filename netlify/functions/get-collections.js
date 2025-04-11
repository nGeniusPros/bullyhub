import { supabase } from '../utils/supabase-client.js';

async function collectionsHandler(req, res) {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch collections' });
    }

    return res.status(200).json({ collections: data });
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

  return await collectionsHandler(req, res);
};
