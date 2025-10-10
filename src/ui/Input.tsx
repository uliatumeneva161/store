import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '',
  ...props 
}) => {
  const inputClasses = `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
    error 
      ? 'border-error focus:ring-error focus:border-error' 
      : 'border-gray-medium focus:ring-main focus:border-main'
  } ${className}`

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="text-error text-sm">{error}</p>
      )}
    </div>
  )
}

export default Input