import { upload, download, getHistory } from "../service/imageService.js";
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

    async download(req, res, next) {
        try {
            const result = await download(req);

            res.setHeader('Content-Disposition', `attachment; filename="${result.originalname}"`);
            res.setHeader('Content-Type', result.mimetype);
            res.send(result.decrypted);
        } catch (error) {
            next(error);
        }
    }

    async history(req, res, next) {
        try {
            const result = await getHistory(req);
            res.json(
                ApiResponse.success(result, "Berhasil menampilkan history", 200)
            );
        } catch (error) {
            next(error);
        }
    }
}
