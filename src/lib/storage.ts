/**
 * LocalStorage utilities for persisting data
 */

import { ParsedData } from './data-parser'

const STORAGE_KEY = 'data_explorer_parsed_data'
const STORAGE_TIMESTAMP_KEY = 'data_explorer_timestamp'

/**
 * Save parsed data to localStorage
 */
export function saveParsedDataToStorage(data: ParsedData): void {
  try {
    const serialized = JSON.stringify(data)
    localStorage.setItem(STORAGE_KEY, serialized)
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, new Date().toISOString())
  } catch (error) {
    console.error('Failed to save data to localStorage:', error)
    // Silently fail - don't disrupt user experience
  }
}

/**
 * Load parsed data from localStorage
 */
export function loadParsedDataFromStorage(): ParsedData | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) {
      return null
    }
    return JSON.parse(serialized) as ParsedData
  } catch (error) {
    console.error('Failed to load data from localStorage:', error)
    clearStorage()
    return null
  }
}

/**
 * Get the timestamp when data was last saved
 */
export function getStorageTimestamp(): string | null {
  try {
    return localStorage.getItem(STORAGE_TIMESTAMP_KEY)
  } catch (error) {
    console.error('Failed to get storage timestamp:', error)
    return null
  }
}

/**
 * Clear all stored data
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY)
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

/**
 * Check if data exists in storage
 */
export function hasStoredData(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch (error) {
    console.error('Failed to check localStorage:', error)
    return false
  }
}
