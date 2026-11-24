import { todayISO, type Errors } from '../shared/validation'
import { staticFetch } from './staticApi'

// The same routes, answered in the browser when the site is hosted statically
// (GitHub Pages) and there is no Worker behind it.
const request: typeof fetch = import.meta.env.VITE_STATIC_API === 'true' ? staticFetch : fetch

export class ApiError extends Error {
  status: number
  errors: Errors
  constructor(message: string, status: number, errors: Errors = {}) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

const headers = () => ({ 'content-type': 'application/json', 'x-client-date': todayISO() })
const OFFLINE = 'به سرور وصل نشدیم. اتصال اینترنت را بررسی و دوباره تلاش کنید.'

async function handle<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as { error?: string; errors?: Errors }
  if (!res.ok) throw new ApiError(data.error ?? 'مشکلی پیش آمد. دوباره تلاش کنید.', res.status, data.errors)
  return data as T
}

export async function postJSON<T>(path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await request(path, { method: 'POST', headers: headers(), body: JSON.stringify(body) })
  } catch {
    throw new ApiError(OFFLINE, 0)
  }
  return handle<T>(res)
}

export async function getJSON<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response
  try {
    res = await request(path, { headers: headers(), signal })
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err
    throw new ApiError(OFFLINE, 0)
  }
  return handle<T>(res)
}
