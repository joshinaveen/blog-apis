const httpStatus = require('http-status');
const CategoryService = require('../service/CategoryService'); // Import the CategoryService
const logger = require('../config/logger');

class CategoryController {
    constructor() {
        this.categoryService = new CategoryService(); // Initialize CategoryService
    }

    // Add a new category
    add = async (req, res) => {
        try {
            const categoryData = req.body;

            if (!categoryData.name) {
                return res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    message: 'Category name is required'
                });
            }

            const result = await this.categoryService.createCategory(categoryData);

            if (result.status) {
                res.status(httpStatus.CREATED).send({
                    status: true,
                    message: 'Category created successfully',
                    data: result.data
                });
            } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    status: false,
                    message: result?.message || 'Failed to create category'
                });
            }
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                status: false,
                message: 'An error occurred',
                error: e.message
            });
        }
    };

    // Get all categories with pagination
    getAll = async (req, res) => {
        try {
            const limit = parseInt(req.query.limit);
            const offset = parseInt(req.query.offset)

            const categories = await this.categoryService.getAllCategories({ limit, offset });

            if (categories.status) {
                res.status(httpStatus.OK).send({
                    status: true,
                    data: categories.data,
                    totalRecords: categories.totalRecords
                });
            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    status: false,
                    message: 'No categories found',
                });
            }
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                status: false,
                message: 'An error occurred',
                error: e.message,
            });
        }
    };

    // Get a category by ID
    getCategoryById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    message: 'Category ID is required'
                });
            }

            const category = await this.categoryService.getCategoryById(id);

            if (category) {
                res.status(httpStatus.OK).send({
                    status: true,
                    data: category
                });
            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    status: false,
                    message: 'Category not found'
                });
            }
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                status: false,
                message: 'An error occurred',
                error: e.message
            });
        }
    };

    // Update a category by ID
    updateCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const categoryData = req.body;

            if (!id || !categoryData) {
                return res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    message: 'Category ID and data are required'
                });
            }

            const result = await this.categoryService.updateCategory(id, categoryData);

            if (result) {
                res.status(httpStatus.OK).send({
                    status: true,
                    message: 'Category updated successfully',
                    data: result
                });
            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    status: false,
                    message: 'Category not found'
                });
            }
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                status: false,
                message: 'An error occurred',
                error: e.message
            });
        }
    };
}

module.exports = CategoryController;
