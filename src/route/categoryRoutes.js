const express = require('express');
const CategoryController = require('../controllers/CategoryController');

const router = express.Router();
const auth = require('../middlewares/auth');

const categoryController = new CategoryController();

router.post(
    '/',
    auth(),
    categoryController.add,
);
router.get(
    '/',
    auth(),
    categoryController.getAll,
);

router.get(
    '/:id',
    auth(),
    categoryController.getCategoryById,
);

router.put(
    '/:id',
    auth(),
    categoryController.updateCategory,
);

module.exports = router;
