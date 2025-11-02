/**
 * PDF export utilities for data tables
 */

import { jsPDF } from 'jspdf'
import { formatCellValue, ParsedData } from './data-parser'

interface PDFExportOptions {
  title?: string
  includeTimestamp?: boolean
  pageSize?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
}

/**
 * Export data to PDF
 */
export function exportToPDF(
  data: ParsedData,
  rows: Record<string, unknown>[],
  options: PDFExportOptions = {},
): void {
  const {
    title = data.fileName,
    includeTimestamp = true,
    pageSize = 'a4',
    orientation = 'landscape',
  } = options

  // Create PDF document
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize,
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 10
  let yPosition = margin

  // Add title
  doc.setFontSize(16)
  doc.text(title, margin, yPosition)
  yPosition += 10

  // Add metadata
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  const metadata = [
    `Type: ${data.fileType.toUpperCase()}`,
    `Rows: ${rows.length}`,
    `Columns: ${data.headers.length}`,
  ]

  if (includeTimestamp) {
    metadata.push(`Generated: ${new Date().toLocaleString()}`)
  }

  metadata.forEach((line) => {
    doc.text(line, margin, yPosition)
    yPosition += 5
  })

  yPosition += 5
  doc.setTextColor(0, 0, 0)

  // Calculate column widths
  const availableWidth = pageWidth - 2 * margin
  const columnWidth = availableWidth / data.headers.length

  // Add table header
  doc.setFontSize(11)
  doc.setFont('', 'bold')
  doc.setFillColor(240, 240, 240)

  data.headers.forEach((header, index) => {
    const x = margin + index * columnWidth
    doc.rect(x, yPosition, columnWidth, 7, 'F')
    doc.text(header, x + 1, yPosition + 5, { maxWidth: columnWidth - 2 })
  })

  yPosition += 7

  // Add table rows
  doc.setFont('', 'normal')
  doc.setFontSize(9)
  const rowHeight = 6

  rows.forEach((row, rowIndex) => {
    // Check if we need a new page
    if (yPosition + rowHeight > pageHeight - margin) {
      doc.addPage()
      yPosition = margin

      // Repeat header on new page
      doc.setFontSize(11)
      doc.setFont('', 'bold')
      doc.setFillColor(240, 240, 240)

      data.headers.forEach((header, index) => {
        const x = margin + index * columnWidth
        doc.rect(x, yPosition, columnWidth, 7, 'F')
        doc.text(header, x + 1, yPosition + 5, { maxWidth: columnWidth - 2 })
      })

      yPosition += 7
      doc.setFont('', 'normal')
      doc.setFontSize(9)
    }

    // Alternate row colors
    if (rowIndex % 2 === 0) {
      doc.setFillColor(250, 250, 250)
      doc.rect(margin, yPosition, availableWidth, rowHeight, 'F')
    }

    // Add row data
    data.headers.forEach((header, index) => {
      const x = margin + index * columnWidth
      const cellValue = formatCellValue(row[header])
      doc.text(cellValue, x + 1, yPosition + 4, {
        maxWidth: columnWidth - 2,
      })
    })

    yPosition += rowHeight
  })

  // Save PDF
  const fileName = `${title.replace(/\.[^/.]+$/, '')}_${new Date().getTime()}.pdf`
  doc.save(fileName)
}

/**
 * Export filtered data to PDF
 */
export function exportFilteredToPDF(
  data: ParsedData,
  filteredRows: Record<string, unknown>[],
  searchTerm: string,
  options: PDFExportOptions = {},
): void {
  const title = searchTerm ? `${data.fileName} (Filtered: ${searchTerm})` : data.fileName

  exportToPDF(data, filteredRows, {
    ...options,
    title,
  })
}
