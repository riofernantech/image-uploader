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

        const encryptionKey = crypto.randomBytes(16);
        const keyString = encryptionKey.toString('hex');

        const { encrypted, iv } = encryptFile(req.file.buffer, encryptionKey);

        const originalname = req.file.originalname.replace(/\s+/g, '_');
        const fileId = crypto.randomBytes(8).toString('hex') + originalname;
        const filename = `${fileId}.enc`;
        const filepath = path.join(UPLOAD_DIR, filename);

        const dataToSave = Buffer.concat([iv, encrypted]);
        await fs.writeFile(filepath, dataToSave);

        if (req.user) {
            await prismaClient.image.create({
                data: {
                    user_id: req.user.id,
                    file_id: fileId,
                    name: originalname,
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
    } catch (err) {
        throw new ValidationException(err.message);
    }
}

const download = async (req) => {
    try {
        const { fileId } = req.params;
        const { key } = req.query;

        if (!key) throw new ValidationException('Descryption key diperlukan');

        const filename = `${fileId}.enc`;
        const filepath = path.join(UPLOAD_DIR, filename);

        const encryptedData = await findFile(filepath);

        const iv = encryptedData.slice(0, 16);
        const encrypted = encryptedData.slice(16);

        const decryptionKey = Buffer.from(key, 'hex');

        const decrypted = decryptFile(encrypted, decryptionKey, iv);

        return {
            decrypted,
            mimetype: 'application/octet-stream',
            originalname: fileId
        }
    } catch (err) {
        throw err;
    }
}

const getHistory = async (req) => {
    try {
        if (!req.user) return [];

        const images = await prismaClient.image.findMany({
            where: { user_id: req.user.id },
            orderBy: { uploaded_at: 'desc' }
        });

        return images;
    } catch (err) {
        throw err;
    }
}


function encryptFile(buffer, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return { encrypted, iv };
}

function decryptFile(encrypted, key, iv) {
    try {
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        return Buffer.concat([decipher.update(encrypted), decipher.final()]);
    } catch (decErr) {
        throw new ValidationException('Kunci dekripsi tidak valid atau file rusak');
    }
}

async function findFile(filepath) {
    let encryptedData;
    try {
        encryptedData = await fs.readFile(filepath);
    } catch (fsErr) {
        if (fsErr.code === 'ENOENT') {
            throw new ValidationException('File tidak ditemukan');
        }
        throw new ValidationException('Gagal membaca file');
    }
    return encryptedData;
}

export {
    upload,
    download,
    getHistory
}