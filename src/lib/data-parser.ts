/**
 * Utility functions for parsing CSV and JSON files
 */

export interface ParsedData {
  headers: string[]
  rows: Record<string, unknown>[]
  fileName: string
  fileType: 'csv' | 'json'
  rowCount: number
}

/**
 * Parse CSV content into structured data
 */
export function parseCSV(content: string, fileName: string): ParsedData {
  const lines = content.trim().split('\n')

  if (lines.length === 0) {
    throw new Error('CSV file is empty')
  }

  // Parse header
  const headers = parseCSVLine(lines[0])

  if (headers.length === 0) {
    throw new Error('CSV file has no headers')
  }

  // Parse rows
  const rows: Record<string, unknown>[] = []
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue

    const values = parseCSVLine(lines[i])
    const row: Record<string, unknown> = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })

    rows.push(row)
  }

  return {
    headers,
    rows,
    fileName,
    fileType: 'csv',
    rowCount: rows.length,
  }
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // Add last field
  result.push(current.trim())

  return result
}

/**
 * Parse JSON content into structured data
 */
export function parseJSON(content: string, fileName: string): ParsedData {
  let data: unknown

  try {
    data = JSON.parse(content)
  } catch (error) {
    throw new Error('Invalid JSON format' + `\nERR: ${error}`)
  }

  let rows: Record<string, unknown>[] = []
  let headers: string[] = []

  // Handle array of objects
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error('JSON array is empty')
    }

    rows = data.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return item as Record<string, unknown>
      }
      return { value: item }
    })

    // Extract headers from first row
    if (rows.length > 0) {
      headers = Object.keys(rows[0])
    }
  }
  // Handle single object
  else if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>

    // If object contains an array, use that
    const arrayKey = Object.keys(obj).find((key) => Array.isArray(obj[key]))
    if (arrayKey) {
      const arrayData = obj[arrayKey] as unknown[]
      rows = arrayData.map((item) => {
        if (typeof item === 'object' && item !== null) {
          return item as Record<string, unknown>
        }
        return { value: item }
      })
      headers = rows.length > 0 ? Object.keys(rows[0]) : []
    } else {
      // Treat single object as single row
      rows = [obj]
      headers = Object.keys(obj)
    }
  } else {
    throw new Error('JSON must be an array or object')
  }

  if (headers.length === 0) {
    throw new Error('No data found in JSON')
  }

  return {
    headers,
    rows,
    fileName,
    fileType: 'json',
    rowCount: rows.length,
  }
}

/**
 * Parse file content based on file type
 */
export function parseFile(content: string, fileName: string): ParsedData {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (extension === 'csv') {
    return parseCSV(content, fileName)
  } else if (extension === 'json') {
    return parseJSON(content, fileName)
  } else {
    throw new Error('Unsupported file type. Please upload a CSV or JSON file.')
  }
}

/**
 * Format cell value for display
 */
export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}
