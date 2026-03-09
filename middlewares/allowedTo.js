const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

module.exports = (...roles) => {
    console.log("Allowed roles:", roles);
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) {  
            //return res.status(403).json({ status: httpStatusText.FAIL, message: 'Access denied' });
            const error = appError.create("Access denied (this role is not authorized)", 401);
            return next(error);
        }
        next();
    }
}




