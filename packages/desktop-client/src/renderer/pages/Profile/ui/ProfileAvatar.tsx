import React from 'react'
import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'

interface ProfileAvatarProps {
  label: string
  onChange?: () => void
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ label, onChange }) => {
  return (
    <div className="flex items-center gap-6 mb-8">
      <Avatar 
        label={label} 
        size="xlarge" 
        shape="circle" 
        className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 w-24 h-24 text-2xl border border-indigo-200 dark:border-indigo-800" 
      />
      <div>
        <Button 
          label="Change Avatar" 
          className="p-button-text p-button-sm dark:text-indigo-400" 
          onClick={onChange}
        />
      </div>
    </div>
  )
}
