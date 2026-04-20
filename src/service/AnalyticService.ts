export const getOverviewAnalytics = async () => {
  const token = await window.shopify.idToken();
  const response = await fetch(`http://localhost/api/portal/tryon/analytics/overview?period=30d`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`

    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.data;

}