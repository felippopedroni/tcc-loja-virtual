# 🧠 Projeto TCC — API de Autenticação e Usuários

Este projeto foi desenvolvido como parte de um **TCC**, utilizando **Node.js**, **Express** e **MongoDB**, com autenticação baseada em **JWT (JSON Web Tokens)**.  
O sistema permite **cadastro, login, logout, atualização de dados do usuário e redefinição de senha**, além de **atualização de tokens** e **proteção de rotas seguras**.

---

## 📦 Tecnologias Utilizadas

- Node.js
- Express
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcrypt — criptografia de senhas  
- cookie-parser — leitura e gravação de cookies  
- helmet — segurança de headers HTTP  
- morgan — logs de requisições  
- dotenv — gerenciamento de variáveis de ambiente  
- React (utilizado parcialmente no front-end)

---

## ⚙️ Funcionalidades Principais

- Login de usuário
- Cadastro de novo usuário
- Logout (remove o refresh token e bloqueia acesso a rotas privadas)
- Atualização de perfil (nome e e-mail)
- Atualização de foto de perfil
- Renovação de token de acesso
- Reset de senha com verificação
- Verificação de senha esquecida via token

---

## 🗂️ Estrutura de Pastas (Back-end)

server/
├── config/
│ ├── connectDB.js
│ └── sendEmail.js
│
├── controllers/
│ └── user.controller.js
│
├── middleware/
│ ├── auth.js
│ └── multer.js
│
├── models/
│ ├── address.model.js
│ ├── cartproduct.model.js
│ ├── category.model.js
│ ├── order.model.js
│ ├── product.model.js
│ ├── subCategory.model.js
│ └── user.model.js
│
├── route/
│ └── user.route.js
│
├── utils/
│ ├── forgotPasswordTemplate.js
│ ├── generatedOtp.js
│ ├── generatedAccessToken.js
│ ├── generatedRefreshToken.js
│ ├── uploadImageCloudinary.js
│ └── verifyEmailTemplate.js
│
├── .env
├── index.js
├── package.json
└── package-lock.json





> Estrutura atualizada em 2025-10-19