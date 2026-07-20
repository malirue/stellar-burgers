## Особенности проекта

- **TypeScript** с настроенными алиасами (`@pages`, `@components`, `@utils` и др.)
- **Webpack** как сборщик (без Create React App / Vite)
- **Redux Toolkit + react-redux** для управления состоянием
- **Storybook** для изолированной разработки и демонстрации компонентов
- **Jest + Testing Library** для юнит-тестов
- **Cypress** для E2E-тестирования
- **ESLint + Prettier** для контроля качества кода и автоформатирования
- **Алиасы путей** в `tsconfig.json` для удобных импортов

---

## Стек технологий

| Категория                | Инструменты                                 |
| ------------------------ | ------------------------------------------- |
| Фреймворк                | React 18                                    |
| Язык                     | TypeScript                                  |
| Сборка                   | Webpack 5                                   |
| Состояние                | Redux Toolkit, react-redux, redux-thunk     |
| Роутинг                  | react-router-dom v6                         |
| UI‑компоненты            | @zlden/react-developer-burger-ui-components |
| Тестирование             | Jest, React Testing Library, Cypress        |
| Документация компонентов | Storybook 7                                 |
| Качество кода            | ESLint (Airbnb + Prettier), Prettier        |

---

## Установка

1. Клонируйте репозиторий.
2. Установите зависимости:

```bash
npm install
```

Если возникают проблемы с peer-зависимостями, можно использовать:

```bash
npm install --legacy-peer-deps
```

## Запуск

| Задача                                          | Команда                                 |
| ----------------------------------------------- | --------------------------------------- |
| Запуск в режиме разработки (Webpack Dev Server) | `npm start`                             |
| Сборка для production                           | `npm run build `                        |
| Запуск Storybook                                | `npm run storybook`                     |
| Сборка Storybook                                | `npm run build-storybook`               |
| Юнит-тесты (Jest)                               | `npm test`                              |
| E2E-тесты (Cypress)                             | `npm run cypress:open`                  |
| Проверка кода (ESLint)                          | `npm run lint`                          |
| Автоисправление ошибок форматирования           | `npm run lint:fix` или `npm run format` |


