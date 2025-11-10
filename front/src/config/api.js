const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper para fazer chamadas à API
export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  },

  // Auth
  async register(email, password, nome) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nome })
    });
  },

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.data?.session?.access_token) {
      localStorage.setItem('access_token', data.data.session.access_token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  },

  async me() {
    return this.request('/auth/me');
  },

  // Compras
  async criarCompra(quantidade, valor_total) {
    return this.request('/compras', {
      method: 'POST',
      body: JSON.stringify({ quantidade, valor_total })
    });
  },

  async listarCompras(status) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/compras${query}`);
  },

  async confirmarCompra(id) {
    return this.request(`/compras/${id}/confirmar`, {
      method: 'PATCH'
    });
  },

  async rejeitarCompra(id) {
    return this.request(`/compras/${id}/rejeitar`, {
      method: 'PATCH'
    });
  },

  // Pontos
  async buscarPontos() {
    return this.request('/pontos');
  },

  async buscarEstatisticas() {
    return this.request('/pontos/estatisticas');
  },

  async listarClientesComBrindes() {
    return this.request('/pontos/clientes-com-brindes');
  },

  async darBaixaNoBrinde(usuarioId) {
    return this.request(`/pontos/dar-baixa-brinde/${usuarioId}`, {
      method: 'POST'
    });
  }
};

