const errorResponse = (res, error, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message: error.message || 'Something went wrong'
    });
};

module.exports = errorResponse;
