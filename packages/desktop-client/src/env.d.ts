/// <reference types="vite/client" />
import { ElectronAPI } from '@electron-toolkit/preload'

interface CustomAPI {
  invoke: (channel: string, data?: any) => Promise<any>
  send: (channel: string, data?: any) => void
  on: (channel: string, callback: (...args: any[]) => void) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomAPI
  }
}