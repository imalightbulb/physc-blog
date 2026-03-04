export const dynamic = "force-static";

import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAdminAuthenticated, isAdminEnabled } from '@/lib/admin-auth';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);

function forbidden() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function safeFilename(original: string): string {
  const ext = path.extname(original).toLowerCase();
  const base = path.basename(original, ext).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${base || 'image'}-${seed}${ext}`;
}

export async function POST(req: Request) {
  if (!isAdminEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const cookieStore = await cookies();
  if (!isAdminAuthenticated(cookieStore)) return forbidden();

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: 'File exceeds 5MB limit.' }, { status: 400 });
  }

  const now = new Date();
  const year = `${now.getUTCFullYear()}`;
  const month = `${now.getUTCMonth() + 1}`.padStart(2, '0');
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', year, month);
  fs.mkdirSync(uploadDir, { recursive: true });

  const filename = safeFilename(file.name);
  const absolutePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(absolutePath, buffer);

  const relativeUrl = `/uploads/${year}/${month}/${filename}`;
  return NextResponse.json({ url: relativeUrl });
}
