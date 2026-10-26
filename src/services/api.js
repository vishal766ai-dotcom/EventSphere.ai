// Central API Service Client
const API_BASE = '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const customKey = localStorage.getItem('gemini_api_key');
  if (customKey) {
    headers['x-gemini-key'] = customKey;
  }
  return headers;
}

export const api = {
  // Packages
  async getPackages(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/packages?${query}`);
    return res.json();
  },

  async getPackageById(id) {
    const res = await fetch(`${API_BASE}/packages/${id}`);
    return res.json();
  },

  // Vendors & Location Dispatch
  async getVendors(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/vendors?${query}`);
    return res.json();
  },

  async checkDispatch(pinCode) {
    const res = await fetch(`${API_BASE}/vendors/dispatch-check/${pinCode}`);
    return res.json();
  },

  async getDarkStores() {
    const res = await fetch(`${API_BASE}/vendors/dark-stores`);
    return res.json();
  },

  // Reverse Budget Planner
  async calculateReverseBudget(payload) {
    const res = await fetch(`${API_BASE}/reverse-budget/calculate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Express 90-120 min Party
  async getExpressOrders() {
    const res = await fetch(`${API_BASE}/express`);
    return res.json();
  },

  async dispatchExpressParty(payload) {
    const res = await fetch(`${API_BASE}/express/dispatch`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async updateExpressOrderStatus(orderId, payload) {
    const res = await fetch(`${API_BASE}/express/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Escrow Vault & Milestones
  async getEscrowVault() {
    const res = await fetch(`${API_BASE}/escrow`);
    return res.json();
  },

  async submitMilestonePhoto(escrowId, payload) {
    const res = await fetch(`${API_BASE}/escrow/${escrowId}/partner-photo`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async verifyAndReleaseEscrow(escrowId, otp) {
    const res = await fetch(`${API_BASE}/escrow/${escrowId}/verify-release`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ otp })
    });
    return res.json();
  },

  // Day-of Live Control Room
  async getControlRoom() {
    const res = await fetch(`${API_BASE}/control-room`);
    return res.json();
  },

  async broadcastItinerary(payload) {
    const res = await fetch(`${API_BASE}/control-room/broadcast`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Crowd-Gifting Pool
  async getCrowdPool(poolId = 'POOL-COLLEGE-FAREWELL') {
    const res = await fetch(`${API_BASE}/crowd-pool/${poolId}`);
    return res.json();
  },

  async contributeToPool(poolId, payload) {
    const res = await fetch(`${API_BASE}/crowd-pool/${poolId}/contribute`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // WhatsApp Guest Concierge Bot
  async askGuestBot(question) {
    const res = await fetch(`${API_BASE}/guest-bot/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ question })
    });
    return res.json();
  },

  // Living Room Decor Visualizer
  async getSampleRooms() {
    const res = await fetch(`${API_BASE}/decor-visualizer/sample-rooms`);
    return res.json();
  },

  async analyzeFitting(payload) {
    const res = await fetch(`${API_BASE}/decor-visualizer/analyze-fitting`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // SOPs
  async getSops() {
    const res = await fetch(`${API_BASE}/sops`);
    return res.json();
  },

  // Gemini Status
  async getGeminiStatus() {
    const res = await fetch(`${API_BASE}/gemini/status`);
    return res.json();
  }
};
