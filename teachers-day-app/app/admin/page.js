"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Archive,
  Check,
  ExternalLink,
  Loader2,
  LogOut,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { DEPARTMENTS } from "@/lib/departments";
import ThemeBackground from "@/components/ThemeBackground";

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white/80 px-3 py-2.5 font-semibold outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/10";

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const showNotice = (message, type = "success") => setNotice({ message, type });

  const adminRequest = async (method = "GET", body, id) => {
    const url = id ? `/api/admin?id=${encodeURIComponent(id)}` : "/api/admin";
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-passcode": passcode,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Request failed.");
    return result.data;
  };

  const loadMessages = async () => {
    setLoading(true);
    setNotice(null);
    try {
      setMessages(await adminRequest());
      setAuthenticated(true);
    } catch (error) {
      showNotice(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  

  const signIn = async (event) => {
    event.preventDefault();
    await loadMessages();
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    setBusyId(editing.id);
    setNotice(null);
    try {
      const updated = await adminRequest("PATCH", {
        id: editing.id,
        to_name: editing.to_name.trim(),
        message: editing.message.trim(),
        from_name: editing.from_name.trim() || "Anonymous",
      });
      setMessages((current) =>
        current.map((message) => (message.id === updated.id ? updated : message)),
      );
      setEditing(null);
      showNotice("Changes saved.");
    } catch (error) {
      showNotice(error.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const toggleArchive = async (message) => {
    setBusyId(message.id);
    setNotice(null);
    try {
      const updated = await adminRequest("PATCH", {
        id: message.id,
        archived_at: message.archived_at ? null : new Date().toISOString(),
      });
      setMessages((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      showNotice(message.archived_at ? "Card restored." : "Card archived.");
    } catch (error) {
      showNotice(error.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const toggleApproval = async (message) => {
    setBusyId(message.id);
    setNotice(null);
    try {
      const updated = await adminRequest("PATCH", {
        id: message.id,
        approved_at: message.approved_at ? null : new Date().toISOString(),
      });
      setMessages((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      showNotice(message.approved_at ? "Card returned to review." : "Card approved and published.");
    } catch (error) {
      showNotice(error.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const deleteMessage = async () => {
    if (!deleting) return;
    const message = deleting;
    setBusyId(message.id);
    setNotice(null);
    try {
      await adminRequest("DELETE", undefined, message.id);
      setMessages((current) => current.filter((item) => item.id !== message.id));
      setDeleting(null);
      showNotice("Card deleted.");
    } catch (error) {
      showNotice(error.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const signOut = () => {
    setAuthenticated(false);
    setMessages([]);
    setPasscode("");
    setNotice(null);
  };

  const visibleMessages = messages.filter((message) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "archived"
        ? Boolean(message.archived_at)
        : filter === "active"
          ? Boolean(message.approved_at) && !message.archived_at
          : !message.approved_at && !message.archived_at);
    const searchable = `${message.to_name} ${message.from_name} ${message.message} ${message.department}`;
    return matchesFilter && searchable.toLowerCase().includes(search.toLowerCase());
  });
  const activeCount = messages.filter(
    (message) => message.approved_at && !message.archived_at,
  ).length;
  const pendingCount = messages.filter(
    (message) => !message.approved_at && !message.archived_at,
  ).length;
  const archivedCount = messages.filter((message) => message.archived_at).length;

  return (
    <main className="relative min-h-screen px-4 py-6 sm:px-8 sm:py-10">
      <ThemeBackground />
      <div className="relative z-10 mx-auto max-w-6xl">
        {!authenticated ? (
          <section className="mx-auto mt-[10vh] max-w-md rounded-3xl border border-white/70 bg-white/75 p-7 shadow-xl backdrop-blur sm:p-9">
            <p className="mb-2 text-sm font-black uppercase tracking-wide text-emerald-900">
              Teacher&apos;s Day
            </p>
            <h1 className="text-3xl font-black text-stone-900">Admin sign in</h1>
            <p className="mt-2 font-semibold text-stone-600">
              Enter the admin passcode to manage submitted cards.
            </p>
            <form onSubmit={signIn} className="mt-6 space-y-4">
              <label className="block font-extrabold">
                Admin passcode
                <input
                  autoFocus
                  autoComplete="current-password"
                  className={`${inputClass} mt-2`}
                  type="password"
                  value={passcode}
                  onChange={(event) => setPasscode(event.target.value)}
                  required
                />
              </label>
              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1d4138] px-5 py-3 font-black text-white transition hover:bg-[#28584b] disabled:opacity-60"
              >
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                Sign in
              </button>
            </form>
            <Link href="/" className="mt-5 inline-flex font-bold text-emerald-900 hover:underline">
              Back to cards
            </Link>
          </section>
        ) : (
          <>
            <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-1 text-sm font-black uppercase tracking-wide text-emerald-900">
                  Teacher&apos;s Day
                </p>
                <h1 className="text-3xl font-black text-stone-900 sm:text-4xl">
                  Message dashboard
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/presentation"
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 font-extrabold transition hover:bg-white"
                >
                  <ExternalLink className="h-4 w-4" /> Slideshow
                </Link>
                <Link
                  href="/"
                  className="rounded-full bg-white/80 px-4 py-2 font-extrabold transition hover:bg-white"
                >
                  Public page
                </Link>
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 font-extrabold transition hover:bg-white"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </header>

            <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["All cards", messages.length],
                ["Pending review", pendingCount],
                ["Published", activeCount],
                ["Archived", archivedCount],
              ].map(([label, count]) => (
                <div key={label} className="rounded-2xl border border-white/70 bg-white/65 px-5 py-4 backdrop-blur">
                  <p className="text-sm font-bold text-stone-600">{label}</p>
                  <p className="mt-1 text-2xl font-black text-stone-900">{count}</p>
                </div>
              ))}
            </section>

            <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-lg backdrop-blur">
              <div className="flex flex-col gap-4 border-b border-stone-200/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex flex-wrap rounded-2xl bg-stone-100 p-1" role="tablist" aria-label="Filter cards">
                  {[
                    ["pending", `Pending ${pendingCount}`],
                    ["active", `Published ${activeCount}`],
                    ["archived", `Archived ${archivedCount}`],
                    ["all", "All cards"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={filter === key}
                      onClick={() => setFilter(key)}
                      className={`rounded-full px-3 py-2 text-sm font-extrabold transition sm:px-4 ${filter === key ? "bg-white text-emerald-950 shadow-sm" : "text-stone-600 hover:text-stone-900"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <label className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                    <input
                      className={`${inputClass} pl-9`}
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search cards"
                      aria-label="Search cards"
                    />
                  </label>
                  <button
                    onClick={loadMessages}
                    disabled={loading}
                    aria-label="Refresh messages"
                    title="Refresh messages"
                    className="grid aspect-square w-11 shrink-0 place-items-center rounded-xl border border-stone-200 bg-white/80 text-stone-700 transition hover:bg-white disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-stone-200/80">
                {visibleMessages.map((message) => {
                  const department = DEPARTMENTS[message.department];
                  const isBusy = busyId === message.id;
                  return (
                    <article key={message.id} className="p-4 sm:p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-3 py-1 text-xs font-black ${department?.soft || "bg-stone-100"} ${department?.text || "text-stone-800"}`}>
                              {message.department}
                            </span>
                            <span className={`rounded-full px-3 py-1 text-xs font-black ${message.archived_at ? "bg-stone-200 text-stone-700" : message.approved_at ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
                              {message.archived_at ? "Archived" : message.approved_at ? "Published" : "Pending review"}
                            </span>
                            <time className="text-xs font-bold text-stone-500" dateTime={message.created_at}>
                              {new Date(message.created_at).toLocaleString()}
                            </time>
                          </div>
                          <h2 className="break-words text-lg font-black text-stone-900">
                            {message.to_name}
                          </h2>
                          <p className="mt-2 whitespace-pre-wrap break-words text-sm font-semibold leading-relaxed text-stone-700">
                            {message.message}
                          </p>
                          <p className="mt-2 text-sm font-bold text-stone-500">
                            From {message.from_name || "Anonymous"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 lg:justify-end">
                          <button
                            onClick={() => setEditing({ ...message })}
                            disabled={isBusy}
                            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-3 py-2 text-sm font-extrabold text-stone-800 transition hover:bg-white disabled:opacity-50"
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </button>
                          {!message.archived_at && (
                            <button
                              onClick={() => toggleApproval(message)}
                              disabled={isBusy}
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-extrabold transition disabled:opacity-50 ${message.approved_at ? "border-stone-200 bg-white/80 text-stone-800 hover:bg-white" : "border-emerald-800 bg-[#1d4138] text-white hover:bg-[#28584b]"}`}
                            >
                              {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : message.approved_at ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                              {message.approved_at ? "Return to review" : "Approve & publish"}
                            </button>
                          )}
                          <button
                            onClick={() => toggleArchive(message)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-3 py-2 text-sm font-extrabold text-stone-800 transition hover:bg-white disabled:opacity-50"
                          >
                            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                            {message.archived_at ? "Restore" : "Archive"}
                          </button>
                          <button
                            onClick={() => setDeleting(message)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-3 py-2 text-sm font-extrabold text-rose-800 transition hover:bg-rose-50 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
                {!visibleMessages.length && (
                  <p className="px-6 py-14 text-center font-bold text-stone-600">
                    {loading ? "Loading cards..." : "No cards match this view."}
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/40 p-4" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-card-title"
            className="my-auto w-full max-w-xl rounded-3xl border border-white/70 bg-[#fbfaf6] p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-emerald-900">{editing.department}</p>
                <h2 id="edit-card-title" className="mt-1 text-2xl font-black">Edit card</h2>
              </div>
              <button
                onClick={() => setEditing(null)}
                aria-label="Close editor"
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-stone-700 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={saveEdit} className="space-y-4">
              <label className="block font-extrabold">
                Teacher name
                <input
                  className={`${inputClass} mt-2`}
                  maxLength={80}
                  required
                  value={editing.to_name}
                  onChange={(event) => setEditing({ ...editing, to_name: event.target.value })}
                />
              </label>
              <label className="block font-extrabold">
                Message
                <textarea
                  className={`${inputClass} mt-2 min-h-36 resize-y`}
                  maxLength={800}
                  required
                  value={editing.message}
                  onChange={(event) => setEditing({ ...editing, message: event.target.value })}
                />
              </label>
              <label className="block font-extrabold">
                From
                <input
                  className={`${inputClass} mt-2`}
                  maxLength={80}
                  value={editing.from_name || ""}
                  onChange={(event) => setEditing({ ...editing, from_name: event.target.value })}
                />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-full px-4 py-2 font-extrabold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  disabled={busyId === editing.id}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1d4138] px-5 py-2 font-black text-white hover:bg-[#28584b] disabled:opacity-60"
                >
                  {busyId === editing.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Save changes
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/40 p-4" role="presentation">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-card-title"
            aria-describedby="delete-card-description"
            className="my-auto w-full max-w-md rounded-3xl border border-white/70 bg-[#fbfaf6] p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-800">
                <Trash2 className="h-5 w-5" />
              </span>
              <div>
                <h2 id="delete-card-title" className="text-xl font-black text-stone-900">
                  Delete this card?
                </h2>
                <p id="delete-card-description" className="mt-2 font-semibold leading-relaxed text-stone-600">
                  The card for <span className="font-black text-stone-900">{deleting.to_name}</span> will be permanently deleted. This can&apos;t be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                autoFocus
                onClick={() => setDeleting(null)}
                disabled={busyId === deleting.id}
                className="rounded-full px-4 py-2 font-extrabold text-stone-700 hover:bg-stone-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteMessage}
                disabled={busyId === deleting.id}
                className="inline-flex items-center gap-2 rounded-full bg-rose-700 px-5 py-2 font-black text-white transition hover:bg-rose-800 disabled:opacity-60"
              >
                {busyId === deleting.id && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete permanently
              </button>
            </div>
          </section>
        </div>
      )}

      {notice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/40 p-4">
          <section
            role={notice.type === "error" ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby="admin-notice-title"
            aria-describedby="admin-notice-message"
            className="w-full max-w-md rounded-3xl border border-white/70 bg-[#fbfaf6] p-6 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-start gap-4">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${notice.type === "error" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-900"}`}>
                {notice.type === "error" ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
              </span>
              <div>
                <h2 id="admin-notice-title" className="text-xl font-black text-stone-900">
                  {notice.type === "error" ? "Could not complete action" : "Done"}
                </h2>
                <p id="admin-notice-message" className="mt-2 break-words font-semibold leading-relaxed text-stone-600">
                  {notice.message}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => setNotice(null)}
                className="rounded-full bg-[#1d4138] px-5 py-2 font-black text-white transition hover:bg-[#28584b]"
              >
                Dismiss
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
