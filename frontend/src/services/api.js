const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    if (data && typeof data === 'object') {
      if (data.message) {
        errorMessage = data.message;
      }
      if (data.fieldErrors) {
        const details = Object.entries(data.fieldErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
        errorMessage += ` (${details})`;
      }
    } else if (typeof data === 'string' && data.length > 0) {
      errorMessage = data;
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function catchNetworkError(error) {
  if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message.includes('NetworkError')) {
    throw new Error('Unable to connect to server. Please make sure the Spring Boot backend is running.');
  }
  throw error;
}

export const authApi = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  }
};

export const productsApi = {
  getAll: async (query = '') => {
    try {
      const url = query
        ? `${API_BASE_URL}/products?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/products`;
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  },

  create: async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  },

  update: async (id, productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  },

  intakeStock: async (id, incomingQuantity, notes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incomingQuantity, notes })
      });
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  },

  getLowStock: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/low-stock`);
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  }
};

export const salesApi = {
  create: async (saleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  },

  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sales`);
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/${id}`);
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  },

  getByInvoice: async (invoiceNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/invoice/${encodeURIComponent(invoiceNumber)}`);
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  }
};

export const dashboardApi = {
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`);
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  }
};

export const analyticsApi = {
  getTopProducts: async (period = 'monthly', limit = 5) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/top-products?period=${period}&limit=${limit}`);
      return await handleResponse(response);
    } catch (error) {
      catchNetworkError(error);
    }
  }
};
