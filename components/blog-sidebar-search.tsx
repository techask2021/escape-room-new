'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface BlogSidebarSearchProps {
  placeholder?: string
}

export default function BlogSidebarSearch({ placeholder = "Search blog posts..." }: BlogSidebarSearchProps) {
  return (
    <div className="relative search-input-wrapper">
      <Input 
        type="text"
        placeholder={placeholder} 
        className="h-11 pl-10 pr-10 border-2 border-slate-300 focus:border-escape-red focus:ring-2 focus:ring-escape-red/20 text-sm transition-all shadow-sm search-input-selection"
        onFocus={(e) => {
          // Select all text when focused
          e.target.select()
        }}
        onKeyDown={(e) => {
          // Handle Ctrl+A (Cmd+A on Mac) to select all
          if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault()
            e.currentTarget.select()
          }
        }}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
    </div>
  )
}

