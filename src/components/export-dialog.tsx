'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Download, FileJson } from 'lucide-react'
import { ParsedData } from '@/lib/data-parser'
import { exportToPDF } from '@/lib/pdf-export'
import { toast } from 'sonner'

interface ExportDialogProps {
  data: ParsedData
  filteredRows: Record<string, unknown>[]
  searchTerm?: string
  totalRows: number
}

export function ExportDialog({ data, filteredRows, searchTerm, totalRows }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'csv'>('pdf')
  const [includeTimestamp, setIncludeTimestamp] = useState(true)
  const [exportFiltered, setExportFiltered] = useState(searchTerm ? true : false)
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape')
  const [isExporting, setIsExporting] = useState(false)

  const rowsToExport = exportFiltered ? filteredRows : data.rows
  const rowCount = rowsToExport.length

  const handleExport = async () => {
    setIsExporting(true)
    try {
      if (exportFormat === 'pdf') {
        exportToPDF(data, rowsToExport, {
          title: searchTerm ? `${data.fileName} (Filtered: ${searchTerm})` : data.fileName,
          includeTimestamp,
          pageSize,
          orientation,
        })
        toast.success(`PDF exported with ${rowCount} rows`)
      } else if (exportFormat === 'json') {
        const jsonData = {
          metadata: {
            fileName: data.fileName,
            fileType: data.fileType,
            rowCount,
            columnCount: data.headers.length,
            exportedAt: includeTimestamp ? new Date().toISOString() : undefined,
            filtered: exportFiltered,
            searchTerm: searchTerm || undefined,
          },
          headers: data.headers,
          data: rowsToExport,
        }

        const jsonString = JSON.stringify(jsonData, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${data.fileName.replace(/\.[^/.]+$/, '')}_${new Date().getTime()}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success(`JSON exported with ${rowCount} rows`)
      } else if (exportFormat === 'csv') {
        const csvContent = [
          data.headers.map((h) => `"${h}"`).join(','),
          ...rowsToExport.map((row) =>
            data.headers
              .map((header) => {
                const value = row[header]
                const stringValue = String(value ?? '')
                // Escape quotes and wrap in quotes if contains comma or quote
                const escaped = stringValue.replace(/"/g, '""')
                return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
                  ? `"${escaped}"`
                  : escaped
              })
              .join(','),
          ),
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${data.fileName.replace(/\.[^/.]+$/, '')}_${new Date().getTime()}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success(`CSV exported with ${rowCount} rows`)
      }

      setOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed'
      toast.error(message)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>Choose format and options for exporting your data</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF (Table Format)</SelectItem>
                <SelectItem value="json">JSON (Structured)</SelectItem>
                <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PDF-specific options */}
          {exportFormat === 'pdf' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pageSize">Page Size</Label>
                <Select value={pageSize} onValueChange={(value: any) => setPageSize(value)}>
                  <SelectTrigger id="pageSize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orientation">Orientation</Label>
                <Select value={orientation} onValueChange={(value: any) => setOrientation(value)}>
                  <SelectTrigger id="orientation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Data Selection */}
          <div className="space-y-3">
            <Label>Data to Export</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="exportAll"
                  checked={!exportFiltered}
                  onCheckedChange={(checked) => setExportFiltered(!checked)}
                />
                <label htmlFor="exportAll" className="cursor-pointer text-sm">
                  All data ({data.rowCount} rows)
                </label>
              </div>
              {searchTerm && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="exportFiltered"
                    checked={exportFiltered}
                    onCheckedChange={(checked) => setExportFiltered(checked === true)}
                  />
                  <label htmlFor="exportFiltered" className="cursor-pointer text-sm">
                    Filtered results ({filteredRows.length} rows)
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Timestamp Option */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="timestamp"
              checked={includeTimestamp}
              onCheckedChange={(checked) => setIncludeTimestamp(checked === true)}
            />
            <label htmlFor="timestamp" className="cursor-pointer text-sm">
              Include export timestamp
            </label>
          </div>

          {/* Summary */}
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="mb-1 font-medium">Export Summary</p>
            <p className="text-muted-foreground">
              Format: <span className="font-medium">{exportFormat.toUpperCase()}</span>
            </p>
            <p className="text-muted-foreground">
              Rows: <span className="font-medium">{rowCount}</span>
            </p>
            <p className="text-muted-foreground">
              Columns: <span className="font-medium">{data.headers.length}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting} className="gap-2">
              {isExporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
