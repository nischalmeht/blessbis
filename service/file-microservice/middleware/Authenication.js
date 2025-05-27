const jwt = require('jsonwebtoken');
// const catchAsyncErrors = require('./catchAsyncErrors');
const { ErrorHandler } = require('./errorHandler');


class Authentication {
    
      static isAuthenticated = async (req, res, next) => {
        try {
          const cookieHeader = req.headers.cookie;
          if (!cookieHeader) {
            return res.status(401).json({ message: 'Please Login - No cookie found' });
          }
    
          // Extract token from cookie string
          const cookies = Object.fromEntries(
            cookieHeader.split(';').map(c => c.trim().split('='))
          );
    
          const token = cookies.token;
    
          if (!token) {
            return res.status(401).json({ message: 'Please Login - Token missing' });
          }
    
          const decodeValue = jwt.verify(token, process.env.JWT_SECRET);
          
          if (!decodeValue ) {
            return res.status(401).json({ message: 'Invalid token' });
          }
    
          req.user = decodeValue;
          next();
        } catch (error) {
          console.error('JWT verification error:', error);
          return res.status(401).json({ message: 'Please Login - Jwt error' });
        }
      };
    
      static isAuthorized = (...roles) => {
        return (req, res, next) => {
          if (!roles.includes(req.user?.role)) {
            return next(
              new ErrorHandler(
                `Role (${req.user?.role}) is not allowed to access this resource.`,
                403
              )
            );
          }
          next();
        };
      };
    
    
    
}

module.exports = Authentication;