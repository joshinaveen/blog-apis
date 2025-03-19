const express = require('express');
const CmsController = require('../controllers/CmsController');

const router = express.Router();

const cmsController = new CmsController();

router.get(
    '/',
    cmsController.getAll
);
router.get(
    '/tags',
    cmsController.getAllTags
);
router.get(
    '/:slug',
    cmsController.getBlogBySlug
);
module.exports = router;
