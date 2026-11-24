import { useEffect } from 'react'

import { BRAND } from '../content'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BRAND.name}` : `${BRAND.name}: آشپزخانهٔ چوب‌سوز`
  }, [title])
}
