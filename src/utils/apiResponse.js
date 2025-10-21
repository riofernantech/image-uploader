export const ApiResponse = {
    success(data = null, message = null, code = 200) {
        return {
            status: 'success',
            code,
            message,
            data,
        };
    },

    error(message, code = 400, data = null) {
        return {
            status: 'error',
            code,
            message,
            data,
        };
    },
};

export default ApiResponse;