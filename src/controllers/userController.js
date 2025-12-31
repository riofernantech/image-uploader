import { register, login } from "../service/userService.js";
import ApiResponse from "../utils/apiResponse.js";

export default class userController {

    async register(req, res, next) {
        try {
            const result = await register(req.body);
            res.status(201).json(
                ApiResponse.success(result, "Berhasil Registrasi", 201)
            );
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const result = await login(req.body);
            res.json(
                ApiResponse.success(result, "Berhasil Login")
            );
        } catch (error) {
            next(error);
        }
    }
}
