import multer from 'multer';

// Multer setup for file handling
const storage = multer.memoryStorage(); // Use memory storage instead of disk storage

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
