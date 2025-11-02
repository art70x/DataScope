'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { formatCellValue, ParsedData } from '@/lib/data-parser'
import { filterRowsByQuery } from '@/lib/advanced-search'
import { SearchHelpDialog } from './search-help-dialog'
import { ExportDialog } from './export-dialog'
import { StorageStatus } from './storage-status'
import { saveParsedDataToStorage } from '@/lib/storage'

interface DataTableViewerProps {
  data: ParsedData
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

export function DataTableViewer({ data }: DataTableViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Auto-save data to localStorage whenever it changes
  useEffect(() => {
    saveParsedDataToStorage(data)
  }, [data])

  // Filter rows based on advanced search
  const filteredRows = useMemo(() => {
    return filterRowsByQuery(data.rows, data.headers, searchTerm)
  }, [data.rows, data.headers, searchTerm])

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortColumn) return filteredRows

    return [...filteredRows].sort((a, b) => {
      const aValue = formatCellValue(a[sortColumn])
      const bValue = formatCellValue(b[sortColumn])

      // Try numeric comparison first
      const aNum = parseFloat(aValue)
      const bNum = parseFloat(bValue)

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum
      }

      // Fall back to string comparison
      const comparison = aValue.localeCompare(bValue)
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredRows, sortColumn, sortDirection])

  // Paginate rows
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedRows = sortedRows.slice(startIndex, endIndex)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Header Info with Storage Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{data.fileName}</h2>
          <p className="text-sm text-muted-foreground">
            {data.fileType.toUpperCase()} • {data.rowCount} rows • {data.headers.length} columns
          </p>
        </div>
        <StorageStatus />
      </div>

      {/* Search Bar and Controls */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search: name:john status:active or just john..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <SearchHelpDialog />
          <ExportDialog
            data={data}
            filteredRows={filteredRows}
            searchTerm={searchTerm}
            totalRows={data.rowCount}
          />
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        Showing {startIndex + 1} to {Math.min(endIndex, sortedRows.length)} of {sortedRows.length}{' '}
        rows
        {searchTerm && ` (filtered from ${data.rowCount} total)`}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {data.headers.map((header) => (
                  <TableHead
                    key={header}
                    onClick={() => handleSort(header)}
                    className="cursor-pointer whitespace-nowrap select-none hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <span>{header}</span>
                      {sortColumn === header && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {data.headers.map((header) => (
                      <TableCell
                        key={`${rowIndex}-${header}`}
                        className="max-w-xs truncate"
                        title={formatCellValue(row[header])}
                      >
                        {formatCellValue(row[header])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={data.headers.length}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
