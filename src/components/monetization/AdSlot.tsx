'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

export function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch {
      // AdSense not loaded
    }
  }, [])

  return (
    <div className={`ad-container my-6 text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client=""
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
