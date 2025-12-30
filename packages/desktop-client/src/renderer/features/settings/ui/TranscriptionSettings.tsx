import React from 'react'
import { Dropdown } from 'primereact/dropdown'

interface TranscriptionSettingsProps {
  language: string
  onChange: (language: string) => void
}

export const TranscriptionSettings: React.FC<TranscriptionSettingsProps> = ({ language, onChange }) => {
  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Italian', value: 'it' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Chinese (Simplified)', value: 'zh-CN' },
    { label: 'Chinese (Traditional)', value: 'zh-TW' },
    { label: 'Japanese', value: 'ja' },
    { label: 'Korean', value: 'ko' },
    { label: 'Russian', value: 'ru' },
    { label: 'Arabic', value: 'ar' },
    { label: 'Hindi', value: 'hi' }
  ]

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b dark:border-gray-700 pb-2">Transcription</h2>
      <div className="flex flex-col gap-2 max-w-md">
        <label htmlFor="language" className="text-sm font-medium text-gray-600 dark:text-gray-300">Default Language</label>
        <Dropdown 
          id="language"
          value={language} 
          options={languages} 
          onChange={(e) => onChange(e.value)} 
          placeholder="Select a Language"
          className="w-full"
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">This language will be used for all new transcriptions.</p>
      </div>
    </section>
  )
}
