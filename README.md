# SamReshung - Интернет-магазин электронной техники

Интернет-магазин электронной техники

## Технический стек

- **Frontend**: React 18 с TypeScript
- **Build Tool**: Vite
- **Стилизация**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Роутинг**: React Router

## Требования

- npm 9.0 или выше
- Аккаунт Supabase

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone <url-репозитория>
cd samreshung
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создатьфайл .env в корне проекта:

```bash
cp .env.example .env
```

Заполнить.env файл реальными данными из панели управления Supabase:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

## Сборка для продакшена

### Создание production сборки

```bash
npm run build
```

### Предпросмотр production сборки

```bash
npm run preview
```

## Деплой

### Подготовка к деплою

1. Выполните сборку проекта:
```bash
npm run build
```

### Настройка хостинга

Добавьте следующие переменные окружения в настройках вашего хостинга:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## Структура проекта

```
src/
  components/    
  pages/ 
    admin/
    CheckoutPage
    FavoritesPage
    HomePage
    OrderSuccessPage
    ProductPage
    ProductsPage
    ProfilePage   
  hooks/
  services/ 
  consts/        
  types/   
  ui/      
  utils/        
  styles/       
  
```
## Скрипты

- `npm run dev` - запуск сервера разработки
- `npm run build` - сборка для продакшена
- `npm run preview` - предпросмотр собранного приложения
- `npm run lint` - проверка кода с ESLint

## База данных

Проект использует Supabase с PostgreSQL. Структура базы данных включает таблицы:

- products (товары)
- orders (заказы)
- users (пользователи)
