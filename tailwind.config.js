// // /** @type {import('tailwindcss').Config} */
// // export default {
// //   content: [
// //     "./index.html",
// //     "./src/**/*.{js,ts,jsx,tsx}",
// //   ],
// //   theme: {
// //     extend: {
// //       boxShadow: {
// //         'neon': '0 0 25px rgba(129, 137, 141, 0.6), 0 0 50px rgba(76, 84, 100, 0.4)',
// //         'neon-hover': '0 0 35px rgba(168, 182, 182, 0.8), 0 0 70px rgba(129, 137, 141, 0.6), 0 0 100px rgba(76, 84, 100, 0.4)',
// //       },
// //       colors: { 
// //         'light': '#e8f4f4', // Более светлый и чистый фон
// //         'main': '#5d8aa8',  // Приятный сине-серый акцент
// //         'dark': '#2c3e50'   // Более глубокий и насыщенный темный
// //       },
// //       backgroundImage: {
// //         'gradient-light': 'linear-gradient(135deg, #e8f4f4 0%, #d1e7e7 100%)',
// //         'gradient-main': 'linear-gradient(135deg, #5d8aa8 0%, #4a7694 100%)',
// //       }
// //     },
// //   },
// //   plugins: [],
// // }

// // /** @type {import('tailwindcss').Config} */
// // export default {
// //   content: [
// //     "./index.html",
// //     "./src/**/*.{js,ts,jsx,tsx}",
// //   ],
// //   theme: {
// //     extend: {
// //       boxShadow: {
// //         'neon': '0 0 20px rgba(79, 70, 229, 0.3), 0 0 40px rgba(99, 102, 241, 0.2)',
// //         'neon-hover': '0 0 30px rgba(79, 70, 229, 0.5), 0 0 60px rgba(99, 102, 241, 0.3)',
// //         'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
// //         'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
// //       },
// //       colors: { 
// //         'light': '#f8fafc',      // Светлый фон
// //         'main': '#4f46e5',       // Основной акцент (индиго)
// //         'dark': '#1e293b',       // Темный текст
// //         'accent': '#06b6d4',     // Дополнительный акцент (циан)
// //         'success': '#10b981',    // Успех (зеленый)
// //         'warning': '#f59e0b',    // Предупреждение (янтарный)
// //         'error': '#ef4444',      // Ошибка (красный)
// //         'gray-light': '#f1f5f9', // Светло-серый
// //         'gray-medium': '#e2e8f0', // Средне-серый
// //         'gray-dark': '#64748b',  // Темно-серый
// //       },
// //       backgroundImage: {
// //         'gradient-primary': 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
// //         'gradient-accent': 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
// //       }
// //     },
// //   },
// //   plugins: [],
// // }

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   safelist: [
//     // Базовые классы (БЕЗ hover:, focus: и т.д.)
//     'shadow-neon',
//     'shadow-neon-hover',        // ← без "hover:"
//     'shadow-card',
//     'shadow-card-hover',
    
//     'bg-main',
//     'bg-success',
//     'bg-gray-medium',
//     'bg-indigo-700',
//     'bg-emerald-700',
    
//     'text-white',
//     'text-gray-dark',
//     'text-dark',
    
//     'cursor-not-allowed',
//     'shadow-none'
//   ],
//   theme: {
//     extend: {
//       boxShadow: {
//         'neon': '0 0 20px rgba(79, 70, 229, 0.3), 0 0 40px rgba(99, 102, 241, 0.2)',
//         'neon-hover': '0 0 30px rgba(79, 70, 229, 0.5), 0 0 60px rgba(99, 102, 241, 0.3)',
//         'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//         'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//       },
//       colors: { 
//         // 'light': '#f8fafc',
//         // 'main': '#6661c3ff',
//         // 'dark': '#1e293b',
//         // 'accent': '#06b6d4',
//         // 'success': '#10b981',
//         // 'warning': '#f59e0b',
//         // 'error': '#ef4444',
//         // 'gray-light': '#f1f5f9',
//         // 'gray-medium': '#e2e8f0',
//         // 'gray-dark': '#64748b',

//         'light': '#0f172a',       // Тёмный фон по умолчанию
// 'main': '#818cf8',        // Мягкий лавандовый акцент
// 'dark': '#e2e8f0',        // Светлый текст
// 'accent': '#a78bfa',
// 'success': '#34d399',
// 'warning': '#fbbf24',
// 'error': '#fca5a5',
// 'gray-light': '#1e293b',
// 'gray-medium': '#334155',
// 'gray-dark': '#818ea0ff'
//       },
//       backgroundImage: {
//         'gradient-primary': 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
//         'gradient-accent': 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
//       }
//     },
//   },
//   plugins: [],
// }

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