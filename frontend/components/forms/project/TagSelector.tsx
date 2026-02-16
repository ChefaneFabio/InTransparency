'use client'

import { useState } from 'react'
import { Plus, X, Search } from 'lucide-react'

const colorStyles = {
  green: {
    badge: 'bg-green-100 text-green-700',
    badgeHover: 'hover:text-green-900',
    selected: 'bg-green-600 text-white border-green-600',
  },
  purple: {
    badge: 'bg-purple-100 text-purple-700',
    badgeHover: 'hover:text-purple-900',
    selected: 'bg-purple-600 text-white border-purple-600',
  },
  blue: {
    badge: 'bg-blue-100 text-blue-700',
    badgeHover: 'hover:text-blue-900',
    selected: 'bg-blue-600 text-white border-blue-600',
  },
  indigo: {
    badge: 'bg-indigo-100 text-indigo-700',
    badgeHover: 'hover:text-indigo-900',
    selected: 'bg-indigo-600 text-white border-indigo-600',
  },
}

interface TagSelectorProps {
  items: string[]
  selected: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  label?: string
  color?: keyof typeof colorStyles
}

export function TagSelector({
  items,
  selected,
  onChange,
  placeholder = 'Search...',
  label,
  color = 'blue',
}: TagSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [customInput, setCustomInput] = useState('')

  const styles = colorStyles[color]

  const addItem = (item: string) => {
    if (!selected.includes(item)) {
      onChange([...selected, item])
    }
  }

  const removeItem = (item: string) => {
    onChange(selected.filter(s => s !== item))
  }

  const addCustomItem = () => {
    const trimmed = customInput.trim()
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed])
      setCustomInput('')
    }
  }

  const filtered = searchTerm
    ? items.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Selected tags */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((item) => (
              <span
                key={item}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${styles.badge}`}
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  className={styles.badgeHover}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
          />
        </div>

        {/* Suggestion grid */}
        <div className="max-h-48 overflow-y-auto border-2 border-border rounded-lg p-3">
          {filtered.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {filtered.map((item) => {
                const isSelected = selected.includes(item)
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => addItem(item)}
                    disabled={isSelected}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? styles.selected + ' opacity-50 cursor-not-allowed'
                        : 'border-border text-foreground/80 hover:border-foreground/40 hover:bg-muted'
                    }`}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              No matches found. Add a custom entry below.
            </p>
          )}
        </div>

        {/* Custom entry */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCustomItem()
              }
            }}
            placeholder="Add custom entry..."
            className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
          />
          <button
            type="button"
            onClick={addCustomItem}
            disabled={!customInput.trim() || selected.includes(customInput.trim())}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
