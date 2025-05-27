const Validator = require("validatorjs");
const { ErrorHandler } = require("../middleware/errorHandler");

const { config } = require('dotenv');
const fileQueue = require('../queues/fileQueue');
const path = require('path');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');
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
const BlessModel  = require("../models/bless")(sequelize, DataTypes); // Adjust path as needed
class fileController {
    
  

static FileSave = (async (req, res, next) => {
    const { files } = req;   
    const {id}=req.user 
    if (!files || !files.image) {
        return next(new ErrorHandler("Please upload an image.", 400));
    }

    const image = files.image;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(image.mimetype)) {
        return next(new ErrorHandler("File format not supported.", 400));
    }

    // Save temp image locally
    const tempPath = path.join(__dirname, `../uploads/${Date.now()}-${image.name}`);
    await image.mv(tempPath);

    // Add job to queue
    await fileQueue.add('uploadFile', {
        tempFilePath: tempPath,
        userId: id,
        // createdBy: req.user.id,
    });

    res.status(202).json({
        success: true,
        message: 'File is being processed. You will be notified once it is uploaded.',
    });
});
static getFile=(async(req, res) =>{
  try {
    const fileId = req.params.id;

    const file = await BlessModel.findByPk(fileId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: file,
    });
  } catch (err) {
    console.error('Error in getFile:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
})
}

module.exports = fileController;
