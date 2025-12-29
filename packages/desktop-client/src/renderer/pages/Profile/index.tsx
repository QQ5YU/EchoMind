import React, { useState, useRef } from 'react'
import { Layout } from '@shared/ui/Layout'
import { DashboardSidebar } from '@features/dashboard/components/DashboardSidebar'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Avatar } from 'primereact/avatar'

export const ProfilePage: React.FC = () => {
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('john.doe@example.com')
  const toast = useRef<Toast>(null)

  const handleSave = () => {
    toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Profile updated successfully', life: 3000 })
  }

  return (
    <Layout sidebar={<DashboardSidebar />}>
      <Toast ref={toast} />
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Account Settings</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <div className="flex items-center gap-6 mb-8">
            <Avatar label="JD" size="xlarge" shape="circle" className="bg-indigo-100 text-indigo-700 w-24 h-24 text-2xl" />
            <div>
              <Button label="Change Avatar" className="p-button-text p-button-sm" />
            </div>
          </div>

          <div className="grid gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-600">Full Name</label>
              <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-600">Email</label>
              <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end">
            <Button label="Save Changes" onClick={handleSave} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
