"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Send, Presentation, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DEPARTMENTS } from "@/lib/departments";
import DepartmentPills from "@/components/DepartmentPills";
import MessageCard from "@/components/MessageCard";
import ThemeBackground from "@/components/ThemeBackground";
import Scene from "@/components/scene/Scene";

const CHALK = "#F5F1E6";
const WOOD = {
  background:
    "repeating-linear-gradient(90deg, rgba(60,30,8,0) 0 5px, rgba(60,30,8,.12) 5px 6px, rgba(255,230,180,.07) 6px 11px), linear-gradient(135deg,#C68B4E,#8B5A2B 45%,#B07A3E 70%,#7a4d22)",
  boxShadow:
    "0 24px 48px rgba(0,0,0,.4), inset 0 2px 2px rgba(255,235,200,.5), inset 0 -4px 8px rgba(0,0,0,.45)",
};
const BOARD = {
  background:
    "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.10), transparent 60%), linear-gradient(135deg,#2E5A3F,#1F3A2B)",
  boxShadow: "inset 0 0 40px rgba(0,0,0,.6)",
};
const chalkLabel = { fontFamily: "var(--font-chalk), cursive" };
const inputCls =
  "w-full rounded-xl border-2 border-dashed border-[#F5F1E6]/35 bg-white/5 px-4 py-3 font-semibold text-[#F5F1E6] outline-none transition placeholder:text-[#F5F1E6]/40 focus:border-[#F5F1E6]/90 focus:bg-white/10";

export default function Home() {
  const [phase, setPhase] = useState("splash"); // splash -> leaving -> done
  const [dept, setDept] = useState("IT");
  const [form, setForm] = useState({ to_name: "", message: "", from_name: "" });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    done: false,
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const d = DEPARTMENTS[dept];

  useEffect(() => {
    document.body.style.overflow = phase === "splash" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);
  const enter = () => {
    setPhase("leaving");
    setTimeout(() => setPhase("done"), 900);
  };

  const celebrate = () => {
    const colors = [...d.palette, "#f8bf17"];
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.65 }, colors });
    setTimeout(
      () =>
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors,
        }),
      250,
    );
    setTimeout(
      () =>
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors,
        }),
      250,
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.to_name.trim() || !form.message.trim())
      return setStatus({
        loading: false,
        error: "Please add a teacher name and a message.",
        done: false,
      });
    setStatus({ loading: true, error: "", done: false });
    const { error } = await supabase.from("messages").insert({
      department: dept,
      to_name: form.to_name.trim(),
      message: form.message.trim(),
      from_name: form.from_name.trim() || "Anonymous",
    });
    if (error)
      return setStatus({
        loading: false,
        error: "Could not send your card. Please try again.",
        done: false,
      });
    celebrate();
    setForm({ to_name: "", message: "", from_name: "" });
    setStatus({ loading: false, error: "", done: true });
  };

  return (
    <main className="relative min-h-screen px-4 py-8 sm:px-8">
      <ThemeBackground dept={dept} />

      <div
        className={`relative z-10 mx-auto max-w-6xl transition duration-700 ${phase === "splash" ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              role="img"
              aria-label="EVSU seal"
              style={{ backgroundImage: "url(/logo.png)" }}
              className="h-16 w-16 shrink-0 rounded-full bg-white bg-cover bg-center shadow-lg ring-4 ring-white sm:h-20 sm:w-20"
            />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-stone-700">
                Eastern Visayas State University
              </p>
              <h1 className={`text-4xl font-black sm:text-5xl ${d.text}`}>
                Choose your department
              </h1>
              <p className="mt-1 max-w-xl font-semibold text-stone-700">
                Pick yours, then write a thank-you note for a teacher who made a
                difference.
              </p>
            </div>
          </div>
          <Link
            href="/presentation"
            className="flex items-center gap-2 rounded-full border-2 border-white bg-white/70 px-4 py-2 font-extrabold transition hover:-translate-y-0.5 hover:bg-white active:scale-95"
          >
            <Presentation className="h-5 w-5" /> View slideshow
          </Link>
        </header>

        <div className="mb-8">
          <DepartmentPills value={dept} onChange={setDept} />
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* chalkboard form */}
          <div className="rounded-[1.4rem] p-3 sm:p-4" style={WOOD}>
            <form
              onSubmit={submit}
              className="relative overflow-hidden rounded-xl p-5 sm:p-6"
              style={BOARD}
            >
              <div className="paper-grain pointer-events-none absolute inset-0" />
              <div className="relative space-y-5">
                <label className="block">
                  <span
                    className="mb-1 block text-xl"
                    style={{ ...chalkLabel, color: CHALK }}
                  >
                    To (teacher name)
                  </span>
                  <input
                    className={inputCls}
                    maxLength={80}
                    value={form.to_name}
                    onChange={set("to_name")}
                    placeholder="Ma'am Santos"
                  />
                </label>
                <label className="block">
                  <span
                    className="mb-1 block text-xl"
                    style={{ ...chalkLabel, color: CHALK }}
                  >
                    Message
                  </span>
                  <textarea
                    className={`${inputCls} min-h-[160px] resize-y`}
                    maxLength={800}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Thank you for believing in us…"
                  />
                  <span className="mt-1 block text-right text-sm font-semibold text-[#F5F1E6]/60">
                    {form.message.length}/800
                  </span>
                </label>
                <label className="block">
                  <span
                    className="mb-1 block text-xl"
                    style={{ ...chalkLabel, color: CHALK }}
                  >
                    From (your name, optional)
                  </span>
                  <input
                    className={inputCls}
                    maxLength={80}
                    value={form.from_name}
                    onChange={set("from_name")}
                    placeholder="Leave blank to stay anonymous"
                  />
                </label>
                {status.error && (
                  <p role="alert" className="font-bold text-[#ffb4a8]">
                    {status.error}
                  </p>
                )}
                {status.done && (
                  <p role="status" className="font-bold text-[#b7f0c8]">
                    Note submitted for review. It will appear after approval.
                  </p>
                )}
                <button
                  disabled={status.loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F5F1E6] px-6 py-4 text-lg font-black text-[#1F3A2B] transition hover:-translate-y-0.5 active:scale-95 disabled:opacity-60"
                  style={{ boxShadow: `0 0 26px ${d.palette[1]}` }}
                >
                  {status.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}{" "}
                  Send note
                </button>
              </div>
            </form>
          </div>

          {/* corkboard preview */}
          <div>
            <p className="mb-3 font-extrabold text-stone-700">Live preview</p>
            <div
              className="mx-auto max-w-md rounded-[1.4rem] p-3 sm:p-4"
              style={WOOD}
            >
              <div
                className="cork rounded-xl p-[7%]"
                style={{ boxShadow: "inset 0 0 30px rgba(0,0,0,.45)" }}
              >
                <div key={dept} className="pop relative aspect-[4/5] w-full">
                  <MessageCard
                    dept={dept}
                    to={form.to_name}
                    message={form.message}
                    from={form.from_name}
                    maxFont={44}
                  />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-[3%] z-20 h-4 w-4 -translate-x-1/2 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 35% 30%, #ffffffaa, ${d.ink})`,
                      boxShadow: "0 3px 5px rgba(0,0,0,.5)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {phase !== "done" && (
        <section
          className={`fixed inset-0 z-50 transition-transform duration-[900ms] ease-[cubic-bezier(.77,0,.18,1)] ${phase === "leaving" ? "-translate-y-full" : ""}`}
        >
          <Scene dept={dept} onDeptChange={setDept} onEnter={enter} />
        </section>
      )}
    </main>
  );
}
