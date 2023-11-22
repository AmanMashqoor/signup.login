// undefinedRouteHandler.js
const undefinedRouteHandler = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.status = 404;
    next(error); // Pass the error to the next middleware
};

export default undefinedRouteHandler;
