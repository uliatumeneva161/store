/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neon': '0 0 20px rgba(129, 140, 248, 0.3), 0 0 40px rgba(167, 139, 250, 0.2)',
        'neon-hover': '0 0 30px rgba(129, 140, 248, 0.5), 0 0 60px rgba(167, 139, 250, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      colors: { 
        'light': '#0f172a',           // фон
        'main': '#818cf8',            
        'dark': '#e2e8f0',            // Светлый текст
        'accent': '#a78bfa',          // Дополнительный акцент
        'success': '#34d399',         
        'warning': '#fbbf24',         
        'error': '#fca5a5',           
        'gray-light': '#1e293b',      
        'gray-medium': '#334155',    
        'gray-dark': '#94a3b8'        
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
        'gradient-accent': 'linear-gradient(135deg, #34d399 0%, #a78bfa 100%)',
      }
    },
  },
  plugins: [],
}


// 'light': '#0f172a',      
// 'main': '#818cf8',        
// 'dark': '#e2e8f0',        
// 'accent': '#a78bfa',
// 'success': '#34d399',
// 'warning': '#fbbf24',
// 'error': '#fca5a5',
// 'gray-light': '#1e293b',
// 'gray-medium': '#334155',
// 'gray-dark': '#818ea0ff'
