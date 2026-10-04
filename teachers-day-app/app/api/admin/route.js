import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const authed = (req) => process.env.ADMIN_PASSCODE && req.headers.get('x-admin-passcode') === process.env.ADMIN_PASSCODE;
const deny = () => NextResponse.json({ error: 'Wrong passcode' }, { status: 401 });
const out = ({ data, error }) => NextResponse.json(error ? { error: error.message } : { data }, { status: error ? 500 : 200 });

export async function GET(req) {
  if (!authed(req)) return deny();
  return out(await db().from('messages').select('*').order('created_at', { ascending: false }));
}
export async function PATCH(req) {
  if (!authed(req)) return deny();
  const { id, to_name, message, from_name, archived_at, approved_at } = await req.json();
  const updates = {};
  if (to_name !== undefined) updates.to_name = to_name;
  if (message !== undefined) updates.message = message;
  if (from_name !== undefined) updates.from_name = from_name;
  if (archived_at !== undefined) updates.archived_at = archived_at;
  if (approved_at !== undefined) updates.approved_at = approved_at;
  return out(await db().from('messages').update(updates).eq('id', id).select().single());
}
export async function DELETE(req) {
  if (!authed(req)) return deny();
  const id = new URL(req.url).searchParams.get('id');
  return out(await db().from('messages').delete().eq('id', id));
}
