import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { useNavigate } from 'react-router-dom'
import logo from '@renderer/assets/logo.svg'

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl ring-1 ring-indigo-100">
        <div className="text-center mb-8">
          <img src={logo} alt="EchoMind Logo" className="mx-auto mb-4 h-32" />
          <h2 className="text-2xl font-bold text-gray-800">Join EchoMind</h2>
          <p className="text-gray-500 mt-2">Create an account to start transcribing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-fluid">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <InputText 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="John Doe" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <InputText 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Password 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              toggleMask 
              feedback={true}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
            <Password 
              id="confirmPassword" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              toggleMask 
              feedback={false}
              placeholder="Confirm your password"
            />
          </div>

          <Button label="Create Account" />
        </form>

        <div className="mt-6 text-center text-sm">
          <button 
            onClick={() => navigate('/login')} 
            className="text-primary hover:underline"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  )
}
