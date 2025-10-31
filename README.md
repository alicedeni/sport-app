## Sport App


### Установка

```bash
npm install
```

### Запуск в разработке

```bash
npm run dev
```

### Сборка продакшн

```bash
npm run build
```

### Структура проекта (основное)

- `src/components` — UI-компоненты (`main`, `mobile`, `profile`, `modals`, `admin`)
- `src/pages` — страницы маршрутов (лента, профиль, рейтинг и др.)
- `src/scss` — стили: утилиты и блоки (`base`, `blocks`, `main.scss`)
- `src/shared/services` — API-сервисы (`api.js`, `adminService`, `authService` и др.)
- `src/constants/api.js` — базовый URL и конечные точки API
- `dist/` — результат сборки
