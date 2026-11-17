'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useToast(duration = 2600) {
  const [toast, setToast] = useState('')
  const timer = useRef<number | undefined>(undefined)

  const notify = useCallback(
    (message: string) => {
      setToast(message)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setToast(''), duration)
    },
    [duration]
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { toast, notify }
}
