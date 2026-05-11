export const getOverview = async (period: string) => {
  const token = await window.shopify.idToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portal/tryon/analytics/overview?range=${period}d`, {
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

export const getTopProducts = async (period: string) => {
  const token = await window.shopify.idToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portal/tryon/analytics/products?period=${period}d&limit=10`, {
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
