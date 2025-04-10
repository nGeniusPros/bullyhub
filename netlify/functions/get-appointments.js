import { supabase } from '../utils/supabase-client.js';

export async function handler(event, context) {
  try {
    const params = new URLSearchParams(event.rawQuery || event.queryStringParameters);
    const type = params.get('type');
    const userId = params.get('user_id');

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing user_id parameter' }),
      };
    }

    const today = new Date().toISOString().split('T')[0];

    let query = supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId);

    if (type === 'upcoming') {
      query = query.gte('date', today).order('date', { ascending: true });
    } else if (type === 'past') {
      query = query.lt('date', today).order('date', { ascending: false });
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid or missing type parameter' }),
      };
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching appointments:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch appointments' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error in get-appointments function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}
