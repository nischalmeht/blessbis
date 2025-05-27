const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/user");
const { sql } = require("./utils/db");


const app = express();
app.use(express.json());
app.use(cors());
const sequelize = require('./utils/sql');

// sequelize.authenticate()
//   .then(() => console.log('Database connected'))
//   .catch(err => console.error('Database connection error:', err));


async function initDB() {
  try {
    // Create users table
    await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      is_admin BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    `;

    console.log("✅ Database initialized successfully.");
  } catch (error) {
    console.log("❌ Error initializing database:", error);
  }
}

// Routes
app.use("/api/v1", userRoutes);

const port = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
});
