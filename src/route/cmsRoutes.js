const express = require('express');
const CmsController = require('../controllers/CmsController');

const router = express.Router();
const auth = require('../middlewares/auth');

const cmsController = new CmsController();

router.post(
    '/',
    auth(),
    cmsController.add,
);
router.get(
    '/',
    auth(),
    cmsController.getAll
);

router.get(
    '/:id',
    auth(),
    cmsController.getBlogById,
);

router.put(
    '/:id',
    auth(),
    cmsController.updateBlog,
);

module.exports = router;
