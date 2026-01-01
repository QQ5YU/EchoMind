import React from 'react'
import { Card } from 'primereact/card'
import { LoginForm } from './ui/LoginForm'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@shared/api/axios-client'
import { useAuthStore } from '@entities/user/model/store'
import { Message } from 'primereact/message'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [error, setError] = React.useState<string | null>(null)

  const handleLogin = async (data: any) => {
    try {
      setError(null)
      const response = await api.post('/auth/login', data)
      const { user, access_token } = response.data
      setAuth(user, access_token)
      navigate('/dashboard')
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid email or password')
      } else {
        setError('An error occurred. Please try again.')
      }
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">EchoMind</h1>
          <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
        </div>
        
        {error && <Message severity="error" text=Failed to edit, 0 occurrences found for old_string (import React from 'react'\nimport { Card } from 'primereact/card'\nimport { LoginForm } from './ui/LoginForm'\nimport { Link } from 'react-router-dom'\n\nexport const LoginPage: React.FC = () => {\n  const handleLogin = () => {\n    console.log('Login attempt')\n  }\n\n  return (\n    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">\n      <Card className="w-full max-w-md p-4 shadow-lg">\n        <div className="mb-6 text-center">\n          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">EchoMind</h1>\n          <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>\n        </div>\n\n        <LoginForm onSubmit={handleLogin} />\n\n        <div className="mt-6 text-center text-sm">\n          <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>\n          <Link to="/register" className="font-medium text-blue-600 hover:underline">\n            Sign up\n          </Link>\n        </div>\n      </Card>\n    </div>\n  )\n}\n). Original old_string was (import React from 'react'\nimport { Card } from 'primereact/card'\nimport { LoginForm } from './ui/LoginForm'\nimport { Link } from 'react-router-dom'\n\nexport const LoginPage: React.FC = () => {\n  const handleLogin = () => {\n    console.log('Login attempt')\n  }\n\n  return (\n    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">\n      <Card className="w-full max-w-md p-4 shadow-lg">\n        <div className="mb-6 text-center">\n          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">EchoMind</h1>\n          <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>\n        </div>\n\n        <LoginForm onSubmit={handleLogin} />\n\n        <div className="mt-6 text-center text-sm">\n          <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>\n          <Link to="/register" className="font-medium text-blue-600 hover:underline">\n            Sign up\n          </Link>\n        </div>\n      </Card>\n    </div>\n  )\n}\n) in /workspaces/EchoMind/packages/desktop-client/src/renderer/pages/Login/index.tsx. No edits made. The exact text in old_string was not found. Ensure you're not escaping content incorrectly and check whitespace, indentation, and context. Use read_file tool to verify. className="mb-4 w-full" />}