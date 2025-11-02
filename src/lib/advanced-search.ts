/**
 * Advanced search utilities for filtering data with field-specific queries
 * Supports syntax like: id:1, name:abc, status:active, etc.
 */

import { formatCellValue } from './data-parser'

export interface SearchQuery {
  fieldQueries: Map<string, string[]>
  globalSearch: string
}

/**
 * Parse search input into field-specific queries and global search
 * Examples:
 *   "id:1" -> fieldQueries: {id: ["1"]}
 *   "name:john status:active" -> fieldQueries: {name: ["john"], status: ["active"]}
 *   "john" -> globalSearch: "john"
 *   "id:1 john" -> fieldQueries: {id: ["1"]}, globalSearch: "john"
 */
export function parseSearchQuery(input: string): SearchQuery {
  const fieldQueries = new Map<string, string[]>()
  const globalTerms: string[] = []

  // Match patterns like "field:value" or "field:'quoted value'"
  const fieldPattern = /(\w+):(?:'([^']*)'|"([^"]*)"|([^\s]+))/g
  let lastIndex = 0
  let match

  while ((match = fieldPattern.exec(input)) !== null) {
    // Add any text before this match to global search
    if (match.index > lastIndex) {
      const textBefore = input.substring(lastIndex, match.index).trim()
      if (textBefore) {
        globalTerms.push(textBefore)
      }
    }

    const field = match[1].toLowerCase()
    const value = match[2] || match[3] || match[4]

    if (!fieldQueries.has(field)) {
      fieldQueries.set(field, [])
    }
    fieldQueries.get(field)!.push(value.toLowerCase())

    lastIndex = fieldPattern.lastIndex
  }

  // Add remaining text to global search
  if (lastIndex < input.length) {
    const remaining = input.substring(lastIndex).trim()
    if (remaining) {
      globalTerms.push(remaining)
    }
  }

  // If no field queries were found, treat entire input as global search
  if (fieldQueries.size === 0) {
    globalTerms.push(input)
  }

  return {
    fieldQueries,
    globalSearch: globalTerms.join(' ').toLowerCase(),
  }
}

/**
 * Check if a row matches the search query
 */
export function matchesSearchQuery(
  row: Record<string, unknown>,
  headers: string[],
  query: SearchQuery,
): boolean {
  // Check field-specific queries
  for (const [field, values] of query.fieldQueries) {
    const fieldLower = field.toLowerCase()
    const matchingHeader = headers.find((h) => h.toLowerCase() === fieldLower)

    if (!matchingHeader) {
      // Field doesn't exist, so this row doesn't match
      return false
    }

    const cellValue = formatCellValue(row[matchingHeader]).toLowerCase()
    const matches = values.some((value) => cellValue.includes(value))

    if (!matches) {
      return false
    }
  }

  // Check global search across all columns
  if (query.globalSearch) {
    const globalTerms = query.globalSearch.split(/\s+/).filter(Boolean)
    const matches = globalTerms.every((term) =>
      headers.some((header) => {
        const cellValue = formatCellValue(row[header]).toLowerCase()
        return cellValue.includes(term)
      }),
    )

    if (!matches) {
      return false
    }
  }

  return true
}

/**
 * Filter rows based on search query
 */
export function filterRowsByQuery(
  rows: Record<string, unknown>[],
  headers: string[],
  searchInput: string,
): Record<string, unknown>[] {
  if (!searchInput.trim()) {
    return rows
  }

  const query = parseSearchQuery(searchInput)
  return rows.filter((row) => matchesSearchQuery(row, headers, query))
}

/**
 * Get search suggestions based on current headers
 */
export function getSearchSuggestions(headers: string[]): string[] {
  return headers.map((header) => `${header}:`)
}

/**
 * Format search help text
 */
export function getSearchHelpText(): string {
  return `Search tips:
• Simple search: "john" searches all columns
• Field search: "name:john" searches only the name column
• Multiple fields: "name:john status:active"
• Quoted values: "name:'John Doe'" for values with spaces
• Combine: "name:john active" searches name column for "john" and all columns for "active"`
}
