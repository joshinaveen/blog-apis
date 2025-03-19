const CategoryDao = require('../dao/CategoryDoa'); // Adjust the path to your DAO

class CategoryService {
    constructor() {
        this.categoryDao = new CategoryDao();
    }

    // Create a new category
    async createCategory(categoryData) {
        try {
             // Generate a slug from the blog title
             let slug = this.generateSlug(categoryData.name);
    
             // Check if a blog with the same title or slug already exists
             let existingCat = await this.categoryDao.getBySlug(slug);
     
             // If the slug already exists, append a unique suffix to the slug
             let suffix = 1;
             while (existingCat) {
                 slug = `${this.generateSlug(categoryData.name)}-${suffix}`;
                 existingCat = await this.categoryDao.getBySlug(slug);
                 suffix++;
             }
     
             // Update blogData with the unique slug
             categoryData.handle = slug;
            if (await this.categoryDao.isNameExists(categoryData.name)) {
                return { status: false, message: 'Category with this name already exists' };
            }

            // Create a new category entry
            const newCategory = await this.categoryDao.createWithTransaction(categoryData);
            return { status: true, data: newCategory };
        } catch (error) {
            console.error('Error creating category:', error);
            throw new Error('Error creating category');
        }
    }

    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')   // Replace non-alphanumeric characters with hyphens
            .replace(/(^-|-$)/g, '')       // Remove leading or trailing hyphens
            .trim();                       // Remove whitespace
    }

    // Find a category by its ID
    async findCategoryById(id) {
        try {
            const category = await this.categoryDao.findById(id);
            if (!category) {
                return { status: false, message: 'Category not found' };
            }
            return { status: true, data: category };
        } catch (error) {
            console.error('Error finding category:', error);
            throw new Error('Error finding category');
        }
    }

    // Find categories by name
    async findCategoriesByName(name) {
        try {
            const categories = await this.categoryDao.findByName(name);
            return { status: true, data: categories };
        } catch (error) {
            console.error('Error finding categories:', error);
            throw new Error('Error finding categories');
        }
    }

    // Get all categories with optional pagination
    async getAllCategories({ limit, offset }) {
        try {
            // Get total count of records
            const totalRecords = await this.categoryDao.count();
    
            let categories;
            // Get paginated records if limit and offset are provided
            if (limit && offset) {
                categories = await this.categoryDao.findAll({
                    limit,
                    offset,
                    order: [['created_at', 'DESC']], // Order by created_at in descending order
                });
            } else {
                // Get all records if pagination parameters are not provided
                categories = await this.categoryDao.findAll({
                    order: [['created_at', 'DESC']],
                });
            }
    
            return { status: true, data: categories, totalRecords };
        } catch (error) {
            console.error('Error retrieving categories:', error);
            throw new Error('Error retrieving categories');
        }
    }
    

    // Get a category by ID
    async getCategoryById(id) {
        try {
            const category = await this.categoryDao.findById(id);
            return category;
        } catch (error) {
            console.error('Error retrieving category by ID:', error);
            throw new Error('Error retrieving category by ID');
        }
    }

    // Update a category by ID
    async updateCategory(id, categoryData) {
        try {
            const category = await this.categoryDao.update(id, categoryData);
            return category;
        } catch (error) {
            console.error('Error updating category:', error);
            throw new Error('Error updating category');
        }
    }
}

module.exports = CategoryService;
