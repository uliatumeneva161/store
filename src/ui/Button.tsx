import React from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  as?: React.ElementType
  to?: string
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  as: Component = 'button',
  to,
  ...props
}) => {
  const baseClasses = 'py-2 px-4 rounded-md font-medium transition-all duration-300 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-opacity-50'
  
  const variantClasses = {
    primary: 'bg-main text-dark shadow-neon hover:shadow-neon-hover hover:bg-accent focus:ring-main',
    secondary: 'bg-success text-dark shadow-neon hover:shadow-neon-hover hover:bg-green-400 focus:ring-success',
    outline: 'border-2 border-main text-dark bg-transparent hover:bg-main hover:text-dark focus:ring-main',
    ghost: 'bg-gray-medium text-gray-dark hover:bg-gray-dark hover:text-dark focus:ring-gray-medium'
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  // Если передан to, используем Link
  if (to) {
    return (
      <Link to={to} className={classes} {...props as any}>
        {children}
      </Link>
    )
  }

  if (Component !== 'button') {
    return (
      <Component className={classes} {...props}>
        {children}
      </Component>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button