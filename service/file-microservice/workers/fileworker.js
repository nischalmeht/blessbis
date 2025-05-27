const dotenv = require("dotenv");
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;  // Use promise-based fs API
// const BlessModel = require('../models/bless');
const { Sequelize, DataTypes } = require('sequelize');
dotenv.config();
const { config } = require('dotenv');

config();
if (!process.env.DB_URL) {
    throw new Error('DATABASE_URL is not set');
}
const sequelize = new Sequelize(process.env.DB_URL, {
    dialectOptions: {
        ssl: {
            require: true,
        },
    },
});
const BlessModel  = require("../models/bless")(sequelize, DataTypes); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(process.env.REDIS_URL,"process.env.REDIS_URL");

const startWorker = () => {
  const connection = new Redis(process.env.REDIS_URL,{
    maxRetriesPerRequest: null,
  });

  connection.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  const worker = new Worker(
    'file-processing',
    async (job,req) => {
      const { tempFilePath ,userId} = job.data;

      try {
        await fs.access(tempFilePath);

        const result = await cloudinary.uploader.upload(tempFilePath, {
          folder: 'bless',
        });

        if (!result || result.error) {
          throw new Error('Cloudinary upload failed.');
        }

        const blessItem = await BlessModel.create({
          url: result.secure_url,
          public_id: result.public_id,
          user_id:userId
        //   createdBy,
        });

        // await blessItem.save();

        await fs.unlink(tempFilePath);

        console.log(`✅ Uploaded & saved by `);
      } catch (err) {
        console.log(err)
        console.error('❌ FileWorker Error:', err.message);
      }
    },
    { connection, concurrency: 5 }
  );

  worker.on('completed', (job) => {
    console.log(`🎉 Job ${job.id} completed`);
    
    // res.status(200).json({
    //     success: true,
    //     message: ` Job ${job.id} completed`,
    // });
  });

  worker.on('failed', (job, err) => {
    console.error(`💥 Job ${job.id} failed: ${err.message}`);
  });

  return worker;
};

module.exports = startWorker;
