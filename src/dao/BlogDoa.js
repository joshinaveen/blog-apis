const SuperDao = require('./SuperDao');
const models = require('../models');

const Blog = models.blog; // Ensure 'blog' model is correctly defined in models
const Category = models.category
class BlogDao extends SuperDao {
    constructor() {
        super(Blog);
    }

    async findById(id) {
        try {
            // Fetch the blog with associated categories
            const blog = await Blog.findByPk(id, {
                include: [
                    {
                        model: Category, // Assuming Category is the model for categories
                        as: 'categories', // Use the alias you defined in the association
                    }
                ]
            });
    
            if (!blog) {
                throw new Error('Blog not found');
            }
    
            return blog;
        } catch (error) {
            console.error('Error finding blog by ID:', error);
            throw new Error('Error finding blog by ID');
        }
    }

    async count() {
        try {
            return await Blog.count({ status: 'Published' });
        } catch (error) {
            console.error('Error counting blogs:', error);
            throw new Error('Error counting blogs');
        }
    }

    // Find blogs by title
    async findByTitle(title) {
        return Blog.findAll({ where: { title } });
    }

    // Check if a blog with a given title exists
    async isTitleExists(title) {
        return Blog.count({ where: { title } }).then(count => {
            return count > 0;
        });
    }

    // Create a new blog entry with transaction support
    async createWithTransaction(blog, transaction) {
        return Blog.create(blog, { transaction });
    }

    // Get all blogs with optional pagination
    async findAll({ limit = 10, offset = 0, where } = {}) {
        return Blog.findAll({
            where,
            limit,
            offset,
            order: [['created_at', 'DESC']],
            include: [{ model: Category, through: { attributes: [] },  as: 'categories' }] // Order by created_at in descending order
        });
    }

    async update(id, blogData) {
        try {
            // Fetch the blog before updating
            const existingBlog = await Blog.findByPk(id);
            if (!existingBlog) {
                throw new Error('Blog not found');
            }
    
            // Update the blog data
            await Blog.update(blogData, {
                where: { id },
            });
    
            // Fetch the updated blog
            const updatedBlog = await Blog.findByPk(id);
            return updatedBlog;
        } catch (error) {
            console.error('Error updating blog:', error);
            throw error; // Re-throw the error to be handled by the calling function
        }
    }

    async getBySlug(handle) {
        return await Blog.findOne({
            where: { handle },
            include: [
                {
                    model: Category, // Assuming Category is the associated model
                    as: 'categories', // Alias if defined in the relationship
                    attributes: ['name'], // Select only the fields you need
                },
            ],
        });
    }
}

module.exports = BlogDao;
