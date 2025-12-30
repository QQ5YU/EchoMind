import React, { useState, useRef } from 'react'
import { Layout } from '@shared/ui/Layout'
import { Sidebar } from '@widgets/Sidebar'
import { UserMenu } from '@widgets/UserMenu'
import { Toast } from 'primereact/toast'
import { ProfileAvatar } from './ui/ProfileAvatar'
import { ProfileForm } from './ui/ProfileForm'

export const ProfilePage: React.FC = () => {
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('john.doe@example.com')
  const toast = useRef<Toast>(null)

  const handleSave = () => {
    toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Profile updated successfully', life: 3000 })
  }

  return (
    <Layout sidebar={<Sidebar />} headerRight={<UserMenu />}>
      <Toast ref={toast} />
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Account Settings</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-transparent dark:border-gray-700">
          <ProfileAvatar 
            label="JD" 
            onChange={() => console.log('Change avatar clicked')} 
          />

          <ProfileForm
            name={name}
            email={email}
            onNameChange={setName}
            onEmailChange={setEmail}
            onSave={handleSave}
          />
        </div>
      </div>
    </Layout>
  )
}
