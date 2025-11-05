'use client'

import { useState } from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ParsedData } from '@/lib/data-parser'

interface SessionRestoredBannerProps {
  parsedData: ParsedData
  getTimestamp: () => string | null
  onClose: () => void
}

export function SessionRestoredBanner({
  parsedData,
  getTimestamp,
  onClose,
}: SessionRestoredBannerProps) {
  const [visible, setVisible] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  const handleClose = () => {
    setVisible(false)

    setTimeout(() => {
      setCollapsed(true)
      onClose()
    }, 300)
  }

  const timestamp = getTimestamp()

  if (collapsed) return null

  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${visible ? 'mb-2 scale-100 opacity-100' : 'mb-0 scale-40 opacity-0'}
      `}
    >
      <Alert className="relative flex items-start justify-between rounded-lg border shadow-sm">
        <div className="flex items-start gap-2 pr-10">
          <AlertCircle className="size-5 shrink-0 text-card-foreground" />
          <div>
            <AlertTitle>Data Restored</AlertTitle>
            <AlertDescription>
              Your previous session data for “{parsedData.fileName}” has been restored.
              {timestamp && (
                <span className="block text-sm">
                  Last saved:{' '}
                  {new Date(timestamp).toLocaleString('en-US', {
                    hourCycle: 'h23',
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              )}
            </AlertDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-2 right-2"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </Button>
      </Alert>
    </div>
  )
}
