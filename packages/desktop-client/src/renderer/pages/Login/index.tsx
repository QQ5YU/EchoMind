import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { useNavigate } from 'react-router-dom'
import logo from '@renderer/assets/logo.svg'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <img src={logo} alt="EchoMind Logo" className="mx-auto mb-4 h-48" />
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-fluid">
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
              feedback={false}
            />
          </div>

          <Button label="Login" />
        </form>

        <div className="mt-6 text-center text-sm">
          <button 
            onClick={() => navigate('/register')} 
            className="text-primary hover:underline"
          >
            Need an account? Register
          </button>
        </div>
      </div>
    </div>
  )
}