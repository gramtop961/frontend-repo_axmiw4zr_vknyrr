import { useEffect, useState } from 'react'
import { api } from './api'

export default function AdminPanel() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.adminBookings()
      setRows(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const act = async (id, action) => {
    try {
      await api.adminAction(id, { action })
      await load()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <div className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-slate-900" />
            <span className="font-semibold text-slate-900">Smart Access – Admin</span>
          </div>
          <button onClick={load} className="text-sm text-slate-600">Refresh</button>
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">All Bookings</h1>
        {loading ? (
          <div className="text-slate-500">Loading…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-3 py-2">Facility</th>
                  <th className="text-left px-3 py-2">Date</th>
                  <th className="text-left px-3 py-2">Time</th>
                  <th className="text-left px-3 py-2">User</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-left px-3 py-2">Access Code</th>
                  <th className="text-left px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r._id} className="border-t border-slate-200">
                    <td className="px-3 py-2">{r.facility_code}</td>
                    <td className="px-3 py-2">{r.date}</td>
                    <td className="px-3 py-2">{r.start_time}–{r.end_time}</td>
                    <td className="px-3 py-2">{r.user_name}<div className="text-slate-500">{r.user_email}</div></td>
                    <td className="px-3 py-2 capitalize">{r.status.replace('_',' ')}</td>
                    <td className="px-3 py-2 font-mono">{r.access_code || '-'}</td>
                    <td className="px-3 py-2">
                      {r.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => act(r._id, 'approve')} className="px-3 py-1 rounded bg-emerald-600 text-white">Approve</button>
                          <button onClick={() => act(r._id, 'reject')} className="px-3 py-1 rounded bg-red-600 text-white">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
