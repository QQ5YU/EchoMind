import React from 'react'

interface SidebarNavItemProps {
  icon: string
  label: string
  isActive?: boolean
  onClick: () => void
  className?: string
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  icon,
  label,
  isActive,
  onClick,
  className = ''
}) => {
  return (
    <li 
      className={`
        p-2 rounded cursor-pointer flex items-center gap-3 transition-colors
        ${isActive 
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium' 
          : 'hover:bg-gray-50 text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
        }
        ${className}
      `}
      onClick={onClick}
    >
      <i className={`pi ${icon}`} />
      <span>{label}</span>
    </li>
  )
}
