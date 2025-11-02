'use client'

import { useState, useEffect } from 'react'
import { FileUpload } from './file-upload'
import { DataTableViewer } from './data-table-viewer'
import { parseFile, ParsedData } from '@/lib/data-parser'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { RotateCcw, AlertCircle } from 'lucide-react'
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
  const [showRestoredNotice, setShowRestoredNotice] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = loadParsedDataFromStorage()
    if (storedData) {
      setParsedData(storedData)
      setShowRestoredNotice(true)
      // Auto-hide the notice after 5 seconds
      const timer = setTimeout(() => setShowRestoredNotice(false), 5000)
      return () => clearTimeout(timer)
    }
    setIsHydrated(true)
  }, [])

  // Mark as hydrated after initial load attempt
  useEffect(() => {
    if (parsedData) {
      setIsHydrated(true)
    }
  }, [parsedData])

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
    setShowRestoredNotice(false)
    toast.success('Ready for a new file')
  }

  const handleDismissNotice = () => {
    setShowRestoredNotice(false)
  }

  // Don't render until hydrated to avoid hydration mismatch
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
      {/* Restored Data Notice */}
      {showRestoredNotice && parsedData && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <p className="font-medium text-blue-900 dark:text-blue-100">Data Restored</p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Your previous session data for <strong>{parsedData.fileName}</strong> has been
              restored.
              {getStorageTimestamp() && (
                <span> Last saved: {new Date(getStorageTimestamp()!).toLocaleString()}</span>
              )}
            </p>
          </div>
          <button
            onClick={handleDismissNotice}
            className="shrink-0 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ✕
          </button>
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
