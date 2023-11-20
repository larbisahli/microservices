import { Router } from 'express';
const router = Router();

// Route for '/analytics'
router.route('/health-status').get(async (req, res) => {
  return res.status(200).json({ status: 'ok' });
});

export default router;
