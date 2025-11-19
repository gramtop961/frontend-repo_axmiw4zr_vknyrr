export const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function req(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  seed: () => req('/api/facilities/seed', { method: 'POST' }),
  facilities: () => req('/api/facilities'),
  availability: (facility_code, date) => req(`/api/availability?facility_code=${encodeURIComponent(facility_code)}&date=${encodeURIComponent(date)}`),
  createBooking: (payload) => req('/api/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  myBookingsByUserId: (user_id) => req(`/api/bookings/mine?user_id=${encodeURIComponent(user_id)}`),
  adminBookings: () => req('/api/admin/bookings'),
  adminAction: (id, action) => req(`/api/bookings/${id}/admin`, { method: 'POST', body: JSON.stringify(action) }),
}
