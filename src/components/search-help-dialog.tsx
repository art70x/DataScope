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
import { HelpCircle } from 'lucide-react'

export function SearchHelpDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Search Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Advanced Search Guide</DialogTitle>
          <DialogDescription>Learn how to use powerful search techniques</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Simple Search</h4>
            <p className="mb-2 text-sm text-muted-foreground">Search across all columns:</p>
            <code className="mb-2 block rounded bg-muted p-2 text-xs">john</code>
            <p className="text-xs text-muted-foreground">Finds &#34;john&#34; in any column</p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Field-Specific Search</h4>
            <p className="mb-2 text-sm text-muted-foreground">Search in a specific column:</p>
            <code className="mb-2 block rounded bg-muted p-2 text-xs">name:john</code>
            <p className="text-xs text-muted-foreground">Finds &#34;john&#34; only in the name column</p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Multiple Fields</h4>
            <p className="mb-2 text-sm text-muted-foreground">Combine multiple field searches:</p>
            <code className="mb-2 block rounded bg-muted p-2 text-xs">name:john status:active</code>
            <p className="text-xs text-muted-foreground">
              Finds rows where name contains &#34;john&#34; AND status contains &#34;active&#34;
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Quoted Values</h4>
            <p className="mb-2 text-sm text-muted-foreground">Search for values with spaces:</p>
            <code className="mb-2 block rounded bg-muted p-2 text-xs">name:&#34;John Doe&#34;</code>
            <p className="text-xs text-muted-foreground">Finds &#34;John Doe&#34; as a complete phrase</p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Combined Search</h4>
            <p className="mb-2 text-sm text-muted-foreground">Mix field and global searches:</p>
            <code className="mb-2 block rounded bg-muted p-2 text-xs">name:john active</code>
            <p className="text-xs text-muted-foreground">
              Finds rows where name contains &#34;john&#34; AND any column contains &#34;active&#34;
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Examples</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>
                • <code className="bg-muted px-1">id:123</code> - Find by ID
              </li>
              <li>
                • <code className="bg-muted px-1">email:john@example.com</code> - Find by email
              </li>
              <li>
                • <code className="bg-muted px-1">status:pending priority:high</code> - Multiple
                filters
              </li>
              <li>
                • <code className="bg-muted px-1">city:&#34;New York&#34;</code> - Quoted values
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
