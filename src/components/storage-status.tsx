'use client'

import { useEffect, useState } from 'react'
import { HardDrive, Check } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getStorageTimestamp } from '@/lib/storage'

export function StorageStatus() {
  const [timestamp, setTimestamp] = useState<string | null>(null)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    const ts = getStorageTimestamp()
    setTimestamp(ts)

    // Show saved indicator briefly
    setShowSaved(true)
    const timer = setTimeout(() => setShowSaved(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!timestamp) return null

  const lastSaved = new Date(timestamp)
  const now = new Date()
  const diffSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)

  let timeText = ''
  if (diffSeconds < 60) {
    timeText = 'just now'
  } else if (diffSeconds < 3600) {
    timeText = `${Math.floor(diffSeconds / 60)}m ago`
  } else if (diffSeconds < 86400) {
    timeText = `${Math.floor(diffSeconds / 3600)}h ago`
  } else {
    timeText = lastSaved.toLocaleDateString()
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {showSaved ? (
              <>
                <Check className="h-3 w-3 text-green-600" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <HardDrive className="h-3 w-3" />
                <span>{timeText}</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p>Data saved to browser storage</p>
          <p className="text-muted-foreground">{lastSaved.toLocaleString()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
