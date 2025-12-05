import { prismaClient } from "../config/database.js";
import ValidationException from "../exception/validationException.js";
import crypto from 'crypto';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../uploads');

const upload = async (req) => {
    try {
        if (!req.file) throw new ValidationException('File tidak ditemukan');

        const encryptionKey = crypto.randomBytes(32);
        const keyString = encryptionKey.toString('base64');

        const { encrypted, iv } = encryptFile(req.file.buffer, encryptionKey);

        const fileId = crypto.randomBytes(16).toString('hex');
        const filename = `${fileId}.enc`;
        const filepath = path.join(UPLOAD_DIR, filename);

        const dataToSave = Buffer.concat([iv, encrypted]);
        await fs.writeFile(filepath, dataToSave);

        if (req.user) {
            await prismaClient.image.create({
                data: {
                    user_id: req.user.id,
                    file_id: fileId,
                    name: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    uploaded_at: new Date()
                }
            });
        }

        return {
            fileId,
            filename: req.file.originalname,
            downloadUrl: `/api/download/${fileId}`,
            decryptionKey: keyString
        }
    } catch (error) {
        throw error;
    }
}

function encryptFile(buffer, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return { encrypted, iv };
}


export {
    upload
}