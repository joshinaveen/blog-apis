const express = require('express');
const CategoryController = require('../controllers/CategoryController');

const router = express.Router();

const categoryController = new CategoryController();

router.get(
    '/',
    categoryController.getAll,
);

module.exports = router;
