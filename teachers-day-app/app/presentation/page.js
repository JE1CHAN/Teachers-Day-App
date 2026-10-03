'use client';
import { useEffect, useState, useCallback } from 'react';
import { Maximize, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DEPARTMENTS, NEUTRAL_GRADIENT } from '@/lib/departments';
import DepartmentPills from '@/components/DepartmentPills';
import MessageCard from '@/components/MessageCard';

const SLIDE_MS = 9000;

export default function Presentation() {
  const [all, setAll] = useState([]);
  const [filter, setFilter] = useState('All');
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    if (data) setAll(data);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel('messages-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, load).subscribe();
    const poll = setInterval(load, 30000); // fallback if realtime is off
    return () => { supabase.removeChannel(ch); clearInterval(poll); };
  }, [load]);

  const slides = filter === 'All' ? all : all.filter((m) => m.department === filter);
  useEffect(() => setI(0), [filter]);
  useEffect(() => {
    if (!playing || slides.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [playing, slides.length]);

  const go = (d) => setI((n) => (n + d + slides.length) % slides.length);
  const fullscreen = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  useEffect(() => {
    const k = (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); if (e.key === ' ') setPlaying((p) => !p); if (e.key === 'f') fullscreen(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });

  const cur = slides.length ? slides[Math.min(i, slides.length - 1)] : null;
  const bg = cur ? DEPARTMENTS[cur.department].gradient : filter !== 'All' ? DEPARTMENTS[filter].gradient : NEUTRAL_GRADIENT;

  return (
    <main className={`bg-fade flex h-screen flex-col overflow-hidden bg-gradient-to-br ${bg}`}>
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <h1 className="text-2xl font-black sm:text-3xl">Happy Teacher&apos;s Day 🍎</h1>
        <DepartmentPills allowAll size="sm" value={filter} onChange={setFilter} />
        <div className="flex gap-2">
          {[[ChevronLeft, () => go(-1), 'Previous'], [playing ? Pause : Play, () => setPlaying(!playing), playing ? 'Pause' : 'Play'], [ChevronRight, () => go(1), 'Next'], [Maximize, fullscreen, 'Fullscreen']].map(([Icon, fn, label]) => (
            <button key={label} onClick={fn} aria-label={label} className="rounded-full bg-white/70 p-2 hover:bg-white"><Icon className="h-5 w-5" /></button>
          ))}
        </div>
      </header>

      <section className="flex min-h-0 flex-1 items-center justify-center px-6 pb-6">
        {cur ? (
          <div key={cur.id} className="slide-in h-full max-h-[78vh] w-full max-w-5xl">
            <MessageCard dept={cur.department} to={cur.to_name} message={cur.message} from={cur.from_name} maxFont={96} />
          </div>
        ) : (
          <p className="text-2xl font-extrabold text-stone-600">No cards here yet. Be the first to write one!</p>
        )}
      </section>
      {slides.length > 0 && <p className="pb-3 text-center text-sm font-bold text-stone-600">{Math.min(i, slides.length - 1) + 1} / {slides.length}</p>}
    </main>
  );
}
