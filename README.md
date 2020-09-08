
## О проекте:
Учебный проект в ЯндексПрактикуме по основам бэкэнда (node.js)

## Основной функционал: 
1. Создан сервер для проекта Mesto (вебпак проекта https://github.com/Itauiti/webpack-project.git)
2. Работа с БД - MongoDB (включая связи между схемами)
3. Настроены роутеры: 
- GET /users — возвращает всех пользователей
- GET /users/:userId - возвращает пользователя по _id
- POST /users — создаёт пользователя
- GET /cards — возвращает все карточки
- POST /cards — создаёт карточку
- DELETE /cards/:cardId — удаляет карточку по идентификатору
- PATCH /users/me — обновляет профиль
- PATCH /users/me/avatar — обновляет аватар
- PUT /cards/:cardId/likes — поставить лайк карточке
- DELETE /cards/:cardId/likes — убрать лайк с карточки


## Стэк технологий:
Node.js, express.js, MongoDBб, ES6, OOP, CSS3, HTML5, BEM

## Пакеты, которые используются в сборках:
- [body-parser](https://www.npmjs.com/package/body-parser)
- [express](https://expressjs.com)
- [validator](https://www.npmjs.com/package/validator)
- [helmet](https://helmetjs.github.io/)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [joi-objectid](https://www.npmjs.com/package/joi-objectid)
- mongoose

## Инструкции по запуску:
- Скачать или склонировать репозитори
- Установить зависимости при помощи npm - `npm i`
- Подключиться к mongo `npm i mongoose`
- Запустить сервер на localhost:3000 - `npm run start`

