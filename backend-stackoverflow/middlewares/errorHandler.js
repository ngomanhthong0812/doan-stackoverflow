module.exports = (err, req, res, next) => {
    console.error('[Global Error]', {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });

    let statusCode = err.statusCode || res.statusCode;
    if (!statusCode || statusCode === 200) statusCode = 500;

    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            type: err.name || 'Error',
            path: req.originalUrl,
            method: req.method,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};
