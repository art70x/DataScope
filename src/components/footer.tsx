'use client'

import { Github, Twitter } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-12 border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Left side - App info */}
          <div className="space-y-2">
            <h3 className="font-semibold">DataScope</h3>
            <p className="text-sm text-muted-foreground">
              Powerful data exploration tool for CSV and JSON files. Upload, search, filter, sort,
              and export your data with ease.
            </p>
          </div>

          {/* Right side - Author info */}
          <div className="flex flex-col gap-3 sm:items-end">
            <p className="text-sm text-muted-foreground">
              Built by{' '}
              <Link
                href="https://x.com/art70x"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                @art70x
              </Link>
            </p>
            <div className="flex gap-3">
              <Link
                href="https://x.com/art70x"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground tr-240 hover:text-foreground"
                aria-label="Follow on X"
              >
                <Twitter className="h-4 w-4" />
                <span className="hidden sm:inline">X</span>
              </Link>
              <Link
                href="https://github.com/art70x"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground tr-240 hover:text-foreground"
                aria-label="GitHub profile"
              >
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-6 border-t pt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} DataScope. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
