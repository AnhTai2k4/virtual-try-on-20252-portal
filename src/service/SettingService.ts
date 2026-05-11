export const getSetting = async () => {
  const token = await window.shopify.idToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portal/tryon/settings`, {
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

export const setSetting = async (data: object) => {
  const token = await window.shopify.idToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portal/tryon/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`

    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const result = await response.json();
  return result.data;

}