import appConfig from '@/configs/app';

export const getOverview = async (params: { period: string, start_time?: string, end_time?: string }) => {
  const token = await window.shopify.idToken();
  let query = '';

  if (params.period === 'all') {
    query = 'range=all';
  } else if (params.period === 'custom') {
    query = `start_time=${params.start_time}&end_time=${params.end_time}`;
  } else {
    query = `range=${params.period}d`;
  }

  const response = await fetch(`${appConfig.API_URL}/api/portal/tryon/analytics/overview?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export const getTopProducts = async (params: { period: string, start_time?: string, end_time?: string }) => {
  const token = await window.shopify.idToken();
  let query = '';

  if (params.period === 'all') {
    query = 'period=all';
  } else if (params.period === 'custom') {
    query = `start_time=${params.start_time}&end_time=${params.end_time}`;
  } else {
    query = `period=${params.period}d`;
  }

  const response = await fetch(`${appConfig.API_URL}/api/portal/tryon/analytics/products?${query}&limit=20`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.data;
}
