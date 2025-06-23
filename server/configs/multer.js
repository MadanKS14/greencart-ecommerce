import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(), // store in memory buffer for cloud upload
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});
