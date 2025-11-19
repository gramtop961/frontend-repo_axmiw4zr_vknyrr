import { useEffect, useState } from 'react'
import { api } from './api'

export default function FacilityCard({ facility, selectedDate, onBook }) {
  const [availability, setAvailability] = useState(null)
  const [error, setError] = useState('')
  const [start, setStart] = useState('08:00')
  const [end, setEnd] = useState('09:00')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [purpose, setPurpose] = useState('')

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const res = await api.availability(facility.code, selectedDate)
        if (!ignore) setAvailability(res)
      } catch (e) {
        if (!ignore) setError(e.message)
      }
    }
    if (selectedDate) load()
    return () => { ignore = true }
  }, [facility.code, selectedDate])

  const handleBook = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.createBooking({
        facility_code: facility.code,
        user_name: name,
        user_email: email,
        purpose,
        date: selectedDate,
        start_time: start,
        end_time: end,
      })
      onBook && onBook()
      setPurpose('')
    } catch (err) {
      setError(err.message)
    }
  }

  const unavailable = availability?.unavailable || []

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{facility.name}</h3>
          <p className="text-slate-500 text-sm">{facility.location} • {facility.code}</p>
        </div>
        {availability?.fully_occupied ? (
          <span className="text-xs px-2 py-1 rounded-full bg-slate-900 text-white">Fully occupied</span>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">Open</span>
        )}
      </div>

      {/* Unavailable list */}
      <div className="mt-3">
        <p className="text-xs text-slate-500 mb-1">Unavailable times:</p>
        {unavailable.length === 0 ? (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded p-2">All day available</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {unavailable.map((u, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                {u.start} - {u.end}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Booking form */}
      <form onSubmit={handleBook} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-600">Start</label>
          <input type="time" value={start} onChange={e => setStart(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 bg-white" required />
        </div>
        <div>
          <label className="text-xs text-slate-600">End</label>
          <input type="time" value={end} onChange={e => setEnd(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 bg-white" required />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-slate-600">Your name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Jane Appleseed" required />
          </div>
          <div>
            <label className="text-xs text-slate-600">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="jane@company.com" required />
          </div>
          <div>
            <label className="text-xs text-slate-600">Purpose (optional)</label>
            <input value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Team sync" />
          </div>
        </div>
        <div className="md:col-span-2 flex items-center gap-2">
          <button disabled={availability?.fully_occupied} className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-black disabled:opacity-40">Book</button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>
    </div>
  )
}
