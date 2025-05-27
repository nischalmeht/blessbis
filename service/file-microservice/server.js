const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileroutes = require("./routes/fileroutes");
const { sql } = require("./utils/db");
const fileUpload = require('express-fileupload');

const startWorker = require('./workers/fileworker');
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());



async function initDB() {
  try {
    // Create users table
    await sql`
   CREATE TABLE IF NOT EXISTS bless (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url VARCHAR(255) UNIQUE NOT NULL,
  public_id  VARCHAR(255)  NOT NULL,  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`
// await sql`
// ALTER TABLE bless
// ADD COLUMN "createdAt" TIMESTAMP DEFAULT NOW(),
// ADD COLUMN "updatedAt" TIMESTAMP DEFAULT NOW();

// `
;

    console.log("✅ Database initialized successfully.");
  } catch (error) {
    console.log("❌ Error initializing database:", error);
  }
}
startWorker(); 
app.use(fileUpload({ useTempFiles: true }));
// Routes
app.use("/api/file", fileroutes);

const port = process.env.PORT || 5001;

initDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
});
