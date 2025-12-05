import { upload } from "../service/imageService.js";
import ApiResponse from "../utils/apiResponse.js";

export default class imageController {

    async upload(req, res, next) {
        try {
            const result = await upload(req);
            res.json(
                ApiResponse.success(result, "Berhasil Upload", 201)
            );
        } catch (error) {
            next(error);
        }
    }
}
