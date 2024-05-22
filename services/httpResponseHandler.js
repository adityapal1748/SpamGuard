

const successResponse = (res, data, message = 'Request was successful', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

module.exports = successResponse;