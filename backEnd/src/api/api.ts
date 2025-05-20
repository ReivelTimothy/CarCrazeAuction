
  const API_URL = 'http://localhost:3000';  

  export const fetchFromAPI = async (endpoint: string, method: string = 'GET', body: any = null) => {
    const token = localStorage.getItem('token'); 

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), 
    };

    const config: RequestInit = {
      method,
      headers,    
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  };