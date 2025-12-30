import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrimeReactProvider } from 'primereact/api'

const queryClient = new QueryClient()

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </PrimeReactProvider>
  )
}
