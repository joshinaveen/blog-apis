const SuperDao = require('./SuperDao');
const models = require('../models');

const Category = models.category; // Ensure 'category' model is correctly defined in models

class CategoryDao extends SuperDao {
    constructor() {
        super(Category);
    }

    // Find a category by its ID
    async findById(id) {
        return Category.findByPk(id);
    }

    // Count the total number of categories
    async count() {
        try {
            return await Category.count();
        } catch (error) {
            console.error('Error counting categories:', error);
            throw new Error('Error counting categories');
        }
    }

    // Find categories by name
    async findByName(name) {
        return Category.findAll({
            where: {
                name: {
                    [Sequelize.Op.like]: `%${name}%` // Use Sequelize.Op.like for partial matches
                }
            }
        });
    }

    // Check if a category with a given name exists
    async isNameExists(name) {
        return Category.count({ where: { name } }).then(count => {
            return count > 0;
        });
    }

    // Create a new category entry with transaction support
    async createWithTransaction(category, transaction) {
        return Category.create(category, { transaction });
    }

    // Get all categories with optional pagination
    async findAll({ limit = 10, offset = 0 } = {}) {
        return Category.findAll({
            limit,
            offset,
            order: [['created_at', 'DESC']], // Order by created_at in descending order
        });
    }

    // Update a category by its ID
    async update(id, categoryData) {
        try {
            // Fetch the category before updating
            const existingCategory = await Category.findByPk(id);
            if (!existingCategory) {
                throw new Error('Category not found');
            }
    
            // Update the category data
            await Category.update(categoryData, {
                where: { id },
            });
    
            // Fetch the updated category
            const updatedCategory = await Category.findByPk(id);
            return updatedCategory;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error; // Re-throw the error to be handled by the calling function
        }
    }

    async getBySlug(handle) {
        return await Category.findOne({ where: { handle } }); // Use Sequelize's findOne method
    }
}

module.exports = CategoryDao;
