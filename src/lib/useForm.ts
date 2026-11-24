import { useState } from 'react'

import type { Errors } from '../shared/validation'
import { ApiError, postJSON } from './api'

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

/**
 * Field state, client validation with the shared rules, and the POST to a
 * Worker route. `validate` runs before sending; server field errors are merged
 * back into `errors` so both sides show messages the same way.
 */
export function useForm<V extends Record<string, unknown>, R = unknown>(initial: V, path: string, validate: (v: V) => Errors) {
  const [values, setValues] = useState<V>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<R | null>(null)

  const set = <K extends keyof V>(key: K, value: V[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key as string]) setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== key)))
  }

  const submit = async (extra?: Record<string, unknown>): Promise<R | null> => {
    const body = { ...values, ...extra } as V
    const found = validate(body)
    setErrors(found)
    if (Object.keys(found).length) {
      setStatus('error')
      setMessage('فیلدهای مشخص‌شده را بررسی کنید.')
      focusFirstError(found)
      return null
    }
    setStatus('submitting')
    setMessage('')
    try {
      const res = await postJSON<R>(path, body)
      setResult(res)
      setStatus('success')
      return res
    } catch (err) {
      const e = err instanceof ApiError ? err : new ApiError('مشکلی پیش آمد. دوباره تلاش کنید.', 0)
      setErrors(e.errors)
      setMessage(e.message)
      setStatus('error')
      focusFirstError(e.errors)
      return null
    }
  }

  const reset = (next: V = initial) => {
    setValues(next)
    setErrors({})
    setStatus('idle')
    setMessage('')
    setResult(null)
  }

  return { values, set, setValues, errors, setErrors, status, message, result, submit, reset }
}

function focusFirstError(errors: Errors) {
  const first = Object.keys(errors)[0]
  if (!first) return
  requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>(
      `[data-field="${first}"] input, [data-field="${first}"] select, [data-field="${first}"] textarea, [data-field="${first}"] button`,
    )
    el?.focus()
  })
}
