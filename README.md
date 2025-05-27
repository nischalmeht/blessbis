# 📦 BlessBis File Upload & Auth Microservice (Neon PostgreSQL)

A scalable microservice using:

- 🔁 BullMQ + Redis Uptash (background job queue)
- ☁️ Cloudinary (image hosting)
- 🗄 Neon PostgreSQL (serverless Postgres DB)
- 🔐 JWT Authentication
- 🌐 Express REST API

---

## 🌐 API Endpoints

| Method | Endpoint                           | Description                      | Request Body / Params               |
|--------|----------------------------------|--------------------------------|-----------------------------------|
| POST   | `http://localhost:5001/api/file/upload` | Upload file (image)             | Multipart form-data with field `image` |
| GET    | `http://localhost:5001/api/file/:id`    | Get file metadata by ID         | URL param: `id`                   |
| POST   | `http://localhost:5000/api/v1/register` | Register a new user             | JSON `{ "name", "email", "password" }` |
| POST   | `http://localhost:5000/api/v1/login`    | Login user                     | JSON `{ "email", "password" }`    |

---

## 🗝 Environment Variables (`.env`)

```env
# Neon PostgreSQL connection URL (includes SSL)
DB_URL=postgresql://<username>:<password>@<neon_host>/<database>?sslmode=require

# Redis Uptash URL (secure connection)
REDIS_URL=rediss://default:<your_redis_token>@<your_redis_host>:<port>

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# JWT Config
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Node environment
NODE_ENV=development

Project Structure
blessbis/
│
├── controllers/
│   ├── fileController.js         # File upload & retrieval API logic
│   └── userController.js         # User auth (register/login)
│
├── models/
│   ├── bless.js                  # Sequelize file model
│   └── user.js                   # Sequelize user model
│
├── worker/
│   └── fileProcessor.js          # BullMQ worker for uploads
│
├── routes/
│   ├── file.js                   # File API routes
│   └── user.js                   # User auth routes
│
├── middlewares/
│   └── authentication.js         # JWT auth middleware
│
├── .env                         # Environment variables (not committed)
├── app.js                       # Express app entry point
└── README.md

⚙️ Setup & Installation
1.Clone the repo:
git clone https://github.com/your-repo/blessbis
cd blessbis

2.Install dependencies:
npm install

3.Create .env file with above variables.

▶️ Run Locally
1.Start your API server:
npm start
2.Run BullMQ worker (in separate terminal) (Optional) :
node worker/fileProcessor.js
else it will run in same server


🧪 API Usage Examples
curl -X POST http://localhost:5001/api/file/upload \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "image=@/path/to/your/image.jpg"
2. Get file metadata by ID
http://localhost:5001/api/file/:id

3.register api
http://localhost:5000/api/v1/register
payload
{
    "name":"",
    "email":"",
    "password":""
}
4.login api
http://localhost:5000/api/v1/login
payload
{
    "email":"",
    "password":""
}

