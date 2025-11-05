'use client'

import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
}

export function FileUpload({ onFileSelect, isLoading = false }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    const validTypes = ['text/csv', 'application/json', '.csv', '.json']
    const extension = file.name.split('.').pop()?.toLowerCase()

    if (!validTypes.includes(file.type) && !validTypes.includes(`.${extension}`)) {
      toast.error('Invalid file type. Please upload a CSV or JSON file.')
      return false
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit.')
      return false
    }

    return true
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        onFileSelect(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        onFileSelect(file)
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleClear = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition duration-200 ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          accept=".csv,.json"
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-medium">
              {selectedFile ? selectedFile.name : 'Drag and drop your file here'}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to select a CSV or JSON file (max 10MB)
            </p>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">
              ({(selectedFile.size / 1024).toFixed(2)} KB)
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={isLoading}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
