const FALLBACK_SITE_URL = 'https://example.com';

function normalizeBasePath(pathname: string): string {
  if (!pathname || pathname === '/') return '';
  const withLeading = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withLeading.replace(/\/+$/, '');
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

export function getSiteName(): string {
  return process.env.NEXT_PUBLIC_SITE_NAME || 'XMUM Physics Department Blog';
}

export function getBasePath(): string {
  return normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH || '');
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return stripTrailingSlash(configured);
  return `${FALLBACK_SITE_URL}${getBasePath()}`;
}

export function absoluteUrl(pathname: string = '/'): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalized, `${getSiteUrl()}/`).toString();
}

