'use client';
import { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Send, Presentation, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DEPARTMENTS } from '@/lib/departments';
import DepartmentPills from '@/components/DepartmentPills';
import MessageCard from '@/components/MessageCard';

const inputCls = 'w-full rounded-2xl border-2 border-white bg-white/80 px-4 py-3 font-semibold outline-none transition focus:border-stone-400';

export default function Home() {
  const [dept, setDept] = useState('IT');
  const [form, setForm] = useState({ to_name: '', message: '', from_name: '' });
  const [status, setStatus] = useState({ loading: false, error: '', done: false });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const celebrate = () => {
    const colors = [DEPARTMENTS[dept].hex, '#fbbf24', '#f472b6', '#60a5fa'];
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.65 }, colors });
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors }), 250);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors }), 250);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.to_name.trim() || !form.message.trim()) return setStatus({ loading: false, error: 'Please add a teacher name and a message.', done: false });
    setStatus({ loading: true, error: '', done: false });
    const { error } = await supabase.from('messages').insert({
      department: dept, to_name: form.to_name.trim(), message: form.message.trim(), from_name: form.from_name.trim() || 'Anonymous',
    });
    if (error) return setStatus({ loading: false, error: 'Could not send your card. Please try again.', done: false });
    celebrate();
    setForm({ to_name: '', message: '', from_name: '' });
    setStatus({ loading: false, error: '', done: true });
  };

  return (
    <main className={`bg-fade min-h-screen bg-gradient-to-br ${DEPARTMENTS[dept].gradient} px-4 py-8 sm:px-8`}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black sm:text-5xl">Happy Teacher&apos;s Day! 🍎</h1>
            <p className="mt-2 max-w-xl text-lg font-semibold text-stone-600">Write a thank-you card for a teacher who made a difference. It will be shown on the big screen.</p>
          </div>
          <Link href="/presentation" className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 font-extrabold hover:bg-white">
            <Presentation className="h-5 w-5" /> View slideshow
          </Link>
        </header>

        <div className="mb-6"><DepartmentPills value={dept} onChange={setDept} /></div>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={submit} className="space-y-5 rounded-[2rem] bg-white/50 p-6 backdrop-blur">
            <label className="block">
              <span className="mb-1 block font-extrabold">To (teacher name)</span>
              <input className={inputCls} maxLength={80} value={form.to_name} onChange={set('to_name')} placeholder="Ma'am Santos" />
            </label>
            <label className="block">
              <span className="mb-1 block font-extrabold">Message</span>
              <textarea className={`${inputCls} min-h-[160px] resize-y`} maxLength={800} value={form.message} onChange={set('message')} placeholder="Thank you for believing in us…" />
              <span className="mt-1 block text-right text-sm font-semibold text-stone-500">{form.message.length}/800</span>
            </label>
            <label className="block">
              <span className="mb-1 block font-extrabold">From (your name, optional)</span>
              <input className={inputCls} maxLength={80} value={form.from_name} onChange={set('from_name')} placeholder="Leave blank to stay anonymous" />
            </label>
            {status.error && <p role="alert" className="font-bold text-rose-600">{status.error}</p>}
            {status.done && <p role="status" className="font-bold text-emerald-700">Card sent! Write another if you like.</p>}
            <button disabled={status.loading} className={`flex w-full items-center justify-center gap-2 rounded-full ${DEPARTMENTS[dept].accent} px-6 py-4 text-lg font-black text-white shadow-lg transition hover:brightness-105 disabled:opacity-60`}>
              {status.loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} Send card
            </button>
          </form>

          <div>
            <p className="mb-2 font-extrabold text-stone-600">Live preview</p>
            <div className="mx-auto aspect-[4/5] w-full max-w-md">
              <MessageCard dept={dept} to={form.to_name} message={form.message} from={form.from_name} maxFont={34} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
