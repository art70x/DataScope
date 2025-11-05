'use client'

import { useState, useEffect } from 'react'
import { SessionRestoredBanner } from '@/components/session-restored-banner'
import { FileUpload } from './file-upload'
import { DataTableViewer } from './data-table-viewer'
import { parseFile, ParsedData } from '@/lib/data-parser'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { RotateCcw } from 'lucide-react'
import {
  saveParsedDataToStorage,
  loadParsedDataFromStorage,
  clearStorage,
  getStorageTimestamp,
} from '@/lib/storage'

export function DataExplorer() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const storedData = loadParsedDataFromStorage()
    if (storedData) {
      setParsedData(storedData)
      setShowBanner(true)
    }
    setIsHydrated(true)
  }, [])

  const handleFileSelect = async (file: File) => {
    setIsLoading(true)
    try {
      const content = await file.text()
      const data = parseFile(content, file.name)
      setParsedData(data)
      saveParsedDataToStorage(data)
      toast.success(`Successfully loaded ${file.name}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse file'
      toast.error(message)
      setParsedData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    clearStorage()
    setParsedData(null)
    setShowBanner(false)
    toast.success('Ready for a new file')
  }

  if (!isHydrated && !parsedData) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold">DataScope</h1>
            <p className="text-muted-foreground">
              Upload a CSV or JSON file to explore and analyze your data
            </p>
          </div>
          <div className="h-32 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      {showBanner && parsedData && (
        <div className="mx-auto w-full max-w-xl px-4">
          <SessionRestoredBanner
            parsedData={parsedData}
            getTimestamp={getStorageTimestamp}
            onClose={() => setShowBanner(false)}
          />
        </div>
      )}

      {!parsedData ? (
        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold">DataScope</h1>
            <p className="text-muted-foreground">
              Upload a CSV or JSON file to explore and analyze your data
            </p>
          </div>
          <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">DataScope</h1>
              <p className="text-muted-foreground">Explore, search, sort, and filter your data</p>
            </div>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Upload New File
            </Button>
          </div>
          <DataTableViewer data={parsedData} />
        </div>
      )}
    </div>
  )
}
