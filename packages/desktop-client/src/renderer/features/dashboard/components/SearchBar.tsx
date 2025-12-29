import React from 'react'
import { InputText } from 'primereact/inputtext'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: () => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search for concepts or phrases..." 
}) => {
  return (
    <div className="mb-8 p-fluid">
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText 
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
          placeholder={placeholder} 
          className="p-4 text-lg" 
        />
      </IconField>
    </div>
  )
}
