'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, Pencil, Trash2, LayoutGrid, Table2, Lock, X } from 'lucide-react';
import MessageCard from '@/components/MessageCard';
import DepartmentPills from '@/components/DepartmentPills';
import { DEPARTMENTS, NEUTRAL_GRADIENT } from '@/lib/departments';

export default function Admin() {
  const [pass, setPass] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [view, setView] = useState('table');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);
  const exportRefs = useRef({});

  const api = useCallback(async (method, body, query = '', p = pass) => {
    const res = await fetch('/api/admin' + query, { method, headers: { 'x-admin-passcode': p, 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
    return { ok: res.ok, ...(await res.json()) };
  }, [pass]);

  const login = async (e) => {
    e.preventDefault();
    const r = await api('GET');
    if (!r.ok) return setError(r.error || 'Could not sign in');
    sessionStorage.setItem('adminPass', pass);
    setItems(r.data); setAuthed(true); setError('');
  };
  useEffect(() => { // restore session
    const p = sessionStorage.getItem('adminPass');
    if (p) { setPass(p); api('GET', null, '', p).then((r) => { if (r.ok) { setItems(r.data); setAuthed(true); } }); }
  }, []); // eslint-disable-line

  const save = async () => {
    const r = await api('PATCH', editing);
    if (r.ok) { setItems(items.map((m) => (m.id === r.data.id ? r.data : m))); setEditing(null); } else alert(r.error);
  };
  const remove = async (id) => {
    if (!confirm('Delete this card permanently?')) return;
    const r = await api('DELETE', null, `?id=${id}`);
    if (r.ok) setItems(items.filter((m) => m.id !== id)); else alert(r.error);
  };
  const download = async (m) => {
    const node = exportRefs.current[m.id];
    const url = await toPng(node, { pixelRatio: 3, cacheBust: true });
    const a = document.createElement('a');
    a.href = url; a.download = `card-${m.department}-${m.to_name.replace(/\W+/g, '_')}-${m.id.slice(0, 6)}.png`; a.click();
  };
  const downloadSelected = async () => { for (const m of items.filter((x) => selected.has(x.id))) { await download(m); await new Promise((r) => setTimeout(r, 400)); } };
  const toggle = (id) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s); };

  if (!authed) {
    return (
      <main className={`grid min-h-screen place-items-center bg-gradient-to-br ${NEUTRAL_GRADIENT} p-4`}>
        <form onSubmit={login} className="w-full max-w-sm space-y-4 rounded-[2rem] bg-white p-8 shadow-xl">
          <Lock className="h-8 w-8" />
          <h1 className="text-2xl font-black">Admin passcode</h1>
          <input type="password" autoFocus value={pass} onChange={(e) => setPass(e.target.value)} className="w-full rounded-2xl border-2 px-4 py-3 font-semibold outline-none focus:border-stone-500" />
          {error && <p role="alert" className="font-bold text-rose-600">{error}</p>}
          <button className="w-full rounded-full bg-stone-800 py-3 font-black text-white">Open dashboard</button>
        </form>
      </main>
    );
  }

  const shown = filter === 'All' ? items : items.filter((m) => m.department === filter);
  const actions = (m) => (
    <div className="flex gap-1">
      <button aria-label="Download PNG" onClick={() => download(m)} className="rounded-full p-2 hover:bg-stone-100"><Download className="h-4 w-4" /></button>
      <button aria-label="Edit" onClick={() => setEditing({ ...m })} className="rounded-full p-2 hover:bg-stone-100"><Pencil className="h-4 w-4" /></button>
      <button aria-label="Delete" onClick={() => remove(m.id)} className="rounded-full p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
    </div>
  );

  return (
    <main className={`min-h-screen bg-gradient-to-br ${NEUTRAL_GRADIENT} p-4 sm:p-8`}>
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black">Moderation ({shown.length})</h1>
          <div className="flex items-center gap-2">
            <button disabled={!selected.size} onClick={downloadSelected} className="flex items-center gap-2 rounded-full bg-stone-800 px-4 py-2 font-bold text-white disabled:opacity-40"><Download className="h-4 w-4" /> Download selected ({selected.size})</button>
            <button aria-label="Table view" onClick={() => setView('table')} className={`rounded-full p-2 ${view === 'table' ? 'bg-stone-800 text-white' : 'bg-white'}`}><Table2 className="h-5 w-5" /></button>
            <button aria-label="Grid view" onClick={() => setView('grid')} className={`rounded-full p-2 ${view === 'grid' ? 'bg-stone-800 text-white' : 'bg-white'}`}><LayoutGrid className="h-5 w-5" /></button>
          </div>
        </header>
        <DepartmentPills allowAll size="sm" value={filter} onChange={setFilter} />

        {view === 'table' ? (
          <div className="overflow-x-auto rounded-3xl bg-white shadow">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 font-extrabold"><tr><th className="p-3" /><th className="p-3">Dept</th><th className="p-3">To</th><th className="p-3">Message</th><th className="p-3">From</th><th className="p-3" /></tr></thead>
              <tbody>{shown.map((m) => (
                <tr key={m.id} className="border-t align-top">
                  <td className="p-3"><input type="checkbox" aria-label="Select" checked={selected.has(m.id)} onChange={() => toggle(m.id)} /></td>
                  <td className="p-3"><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${DEPARTMENTS[m.department].soft} ${DEPARTMENTS[m.department].text}`}>{m.department}</span></td>
                  <td className="p-3 font-bold">{m.to_name}</td>
                  <td className="max-w-md p-3">{m.message}</td>
                  <td className="p-3">{m.from_name}</td>
                  <td className="p-3">{actions(m)}</td>
                </tr>))}</tbody>
            </table>
            {!shown.length && <p className="p-6 font-bold text-stone-500">No cards in this department yet.</p>}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((m) => (
              <div key={m.id} className="space-y-2 rounded-3xl bg-white/60 p-3">
                <div className="aspect-[4/5]"><MessageCard dept={m.department} to={m.to_name} message={m.message} from={m.from_name} maxFont={30} /></div>
                <div className="flex items-center justify-between"><input type="checkbox" aria-label="Select" checked={selected.has(m.id)} onChange={() => toggle(m.id)} />{actions(m)}</div>
              </div>))}
          </div>
        )}
      </div>

      {/* Off-screen fixed-size frames: 800x1000 CSS px x pixelRatio 3 = 2400x3000 PNG */}
      <div aria-hidden className="pointer-events-none fixed left-[-99999px] top-0">
        {items.map((m) => (
          <div key={m.id} ref={(el) => (exportRefs.current[m.id] = el)} style={{ width: 800, height: 1000, padding: 24 }} className={`bg-gradient-to-br ${DEPARTMENTS[m.department].gradient}`}>
            <MessageCard dept={m.department} to={m.to_name} message={m.message} from={m.from_name} maxFont={56} />
          </div>))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between"><h2 className="text-xl font-black">Edit card</h2><button aria-label="Close" onClick={() => setEditing(null)}><X /></button></div>
            {[['to_name', 'To'], ['from_name', 'From']].map(([k, l]) => (
              <label key={k} className="block font-bold">{l}<input value={editing[k]} maxLength={80} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} className="mt-1 w-full rounded-xl border-2 px-3 py-2 font-semibold" /></label>))}
            <label className="block font-bold">Message<textarea value={editing.message} maxLength={800} onChange={(e) => setEditing({ ...editing, message: e.target.value })} className="mt-1 min-h-[140px] w-full rounded-xl border-2 px-3 py-2 font-semibold" /></label>
            <div className="flex justify-end gap-2"><button onClick={() => setEditing(null)} className="rounded-full px-4 py-2 font-bold">Cancel</button><button onClick={save} className="rounded-full bg-stone-800 px-5 py-2 font-black text-white">Save changes</button></div>
          </div>
        </div>
      )}
    </main>
  );
}
