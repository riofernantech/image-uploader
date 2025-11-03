import ValidationException from "../exception/validationException.js";
import ApiResponse from "../utils/apiResponse.js";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ValidationException) {
        res.status(err.status).json(
            ApiResponse.error(err.message, err.status)
        ).end();
    } else {
        res.status(500).json(
            ApiResponse.error(err.message, 500)
        ).end();
    }
}

export default errorMiddleware;