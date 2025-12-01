import ValidationException from "../exception/validationException.js";
import ApiResponse from "../utils/apiResponse.js";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ValidationException) {
        return res.status(err.status).json(
            ApiResponse.error(err.message, err.status)
        );
    }

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json(
            ApiResponse.error("Invalid JSON format", 400)
        );
    }

    return res.status(500).json(
        ApiResponse.error(err.message, 500)
    ).end();

}

export default errorMiddleware;