import React from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

interface ProfileFormProps {
  name: string
  email: string
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onSave: () => void
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  name, 
  email, 
  onNameChange, 
  onEmailChange, 
  onSave 
}) => {
  return (
    <>
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-600 dark:text-gray-300">Full Name</label>
          <InputText 
            id="name" 
            value={name} 
            onChange={(e) => onNameChange(e.target.value)} 
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-600 dark:text-gray-300">Email</label>
          <InputText 
            id="email" 
            value={email} 
            onChange={(e) => onEmailChange(e.target.value)} 
          />
        </div>
      </div>

      <div className="pt-6 border-t dark:border-gray-700 flex justify-end mt-8">
        <Button label="Save Changes" onClick={onSave} className="text-white" />
      </div>
    </>
  )
}
