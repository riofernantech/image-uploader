import multer from 'multer';
import path from 'path';

const max = process.env.MAX_FILE_SIZE || '25';

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: max * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Hanya file gambar yang diperbolehkan!'));
    }
});

export default upload;
