import { useEffect, useMemo, useState } from 'react'
import { api } from './components/api'
import FacilityCard from './components/FacilityCard'
import UserBookings from './components/UserBookings'

function TopBar({ user, onSignOut }) {
  return (
    <div className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-slate-900" />
          <span className="font-semibold text-slate-900">Smart Access</span>
        </div>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-700">{user.name} · {user.id}</span>
            <button onClick={onSignOut} className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">Sign out</button>
          </div>
        ) : (
          <div className="text-slate-600 text-sm">Facilities</div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ id: '', name: '' })

  useEffect(() => {
    async function init() {
      setLoading(true)
      try {
        const list = await api.facilities()
        if (list.length === 0) {
          await api.seed()
        }
        const finalList = list.length === 0 ? await api.facilities() : list
        setFacilities(finalList)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleBooked = () => {
    setNotice('Your booking request has been submitted and awaits admin approval.')
    setTimeout(() => setNotice(''), 4000)
  }

  const grouped = useMemo(() => {
    const groups = {}
    for (const f of facilities) {
      const t = f.type
      if (!groups[t]) groups[t] = []
      groups[t].push(f)
    }
    return groups
  }, [facilities])

  const signIn = (e) => {
    e.preventDefault()
    if (!form.id || !form.name) return
    setUser({ id: form.id.trim(), name: form.name.trim() })
  }

  const signOut = () => {
    setUser(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
        <TopBar user={null} onSignOut={() => {}} />
        <main className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Welcome to Smart Access</h1>
          <p className="text-slate-600 mt-2">Manage and book meeting rooms, courts, and facilities. Sign in with your staff ID to continue.</p>
          <form onSubmit={signIn} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 bg-white border border-slate-200 rounded-xl p-4">
            <div className="md:col-span-1">
              <label className="text-xs text-slate-600">Staff ID</label>
              <input value={form.id} onChange={e=>setForm(v=>({...v, id: e.target.value}))} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="e.g. A12345" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs text-slate-600">Name</label>
              <input value={form.name} onChange={e=>setForm(v=>({...v, name: e.target.value}))} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Your name" required />
            </div>
            <div className="md:col-span-1 flex items-end">
              <button className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-black">Continue</button>
            </div>
          </form>
          <div className="mt-6 text-sm text-slate-500">You can browse facilities after signing in.</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <TopBar user={user} onSignOut={signOut} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Facilities Management</h1>
          <p className="text-slate-600 mt-1">Book rooms, courts and spaces. Real-time availability with auto-cancel for no-shows.</p>
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm text-slate-600">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 bg-white" />
          </div>
          {notice && (
            <div className="mt-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{notice}</div>
          )}
        </header>

        {loading ? (
          <div className="text-slate-500">Loading…</div>
        ) : (
          <div className="space-y-10">
            {Object.keys(grouped).map((group) => (
              <section key={group}>
                <h2 className="text-xl font-semibold mb-4 capitalize">{group.replaceAll('_',' ')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {grouped[group].map((f) => (
                    <FacilityCard key={f._id} facility={f} selectedDate={date} onBook={handleBooked} user={user} />
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h2 className="text-xl font-semibold mb-4">My bookings</h2>
              <UserBookings userId={user.id} />
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
