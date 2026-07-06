import { Router } from 'express';
import { 
  updateProfile, 
  updatePassword, 
  getSessions, 
  revokeSession, 
  revokeAllSessions,
  getAllUsers,
  uploadAvatar
} from '../controllers/user.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const router = Router();

// Configure multer storage for avatars
const uploadDir = path.join(__dirname, '../../public/uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user?.id}_${Date.now()}_${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only image files (JPEG, PNG, WEBP) are allowed.'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Protect all routes after this middleware
router.use(requireAuth);

router.post('/avatar', upload.single('image'), uploadAvatar);
router.put('/profile', updateProfile);
router.put('/update-password', updatePassword);

router.get('/sessions', getSessions);
router.delete('/sessions/:id', revokeSession);
router.delete('/sessions', revokeAllSessions);

// Admin only routes
router.use(requireAdmin);
router.get('/', getAllUsers);

export default router;
