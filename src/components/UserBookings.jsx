import { useEffect, useState } from 'react'
import { api } from './api'

export default function UserBookings() {
  const [email, setEmail] = useState('')
  const [rows, setRows] = useState([])

  const load = async () => {
    if (!email) return
    try {
      const data = await api.myBookings(email)
      setRows(data)
    } catch (e) {
      alert(e.message)
    }
  }

  useEffect(() => { if (email) load() }, [email])

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h3 className="font-semibold">My Bookings</h3>
      <div className="mt-2 flex items-center gap-2">
        <input type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2" />
        <button onClick={load} className="px-3 py-2 rounded-lg bg-slate-900 text-white">Load</button>
      </div>
      <div className="mt-3 divide-y">
        {rows.map(r => (
          <div key={r._id} className="py-2 text-sm flex items-center justify-between">
            <div>
              <div className="font-medium">{r.facility_code} • {r.date} {r.start_time}-{r.end_time}</div>
              <div className="text-slate-500">{r.status}</div>
            </div>
            {r.access_code && <div className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{r.access_code}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
