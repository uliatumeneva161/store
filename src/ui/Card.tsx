import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  shadow?: 'card' | 'neon' | 'none'
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  hover = false,
  shadow = 'card'
}) => {
  const baseClasses = 'bg-gray-light rounded-xl border border-gray-medium'
  
  const shadows = {
    card: 'shadow-card',
    neon: 'shadow-neon',
    none: ''
  }

  const shadowClass = shadows[shadow]
  const hoverClasses = hover ? 'transition-all duration-300 hover:shadow-card-hover hover:scale-105' : ''
  
  const classes = `${baseClasses} ${shadowClass} ${hoverClasses} ${className}`

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

export default Card