const BlogDao = require('../dao/BlogDoa'); // Adjust the path to your DAO

class BlogService {
    constructor() {
        this.blogDao = new BlogDao();
    }

    // Create a new blog
    async createBlog(blogData) {
        try {
            // Generate a slug from the blog title
            let slug = this.generateSlug(blogData.title);
    
            // Check if a blog with the same slug already exists
            let existingBlog = await this.blogDao.getBySlug(slug);
    
            // If the slug already exists, append a unique suffix to the slug
            let suffix = 1;
            while (existingBlog) {
                slug = `${this.generateSlug(blogData.title)}-${suffix}`;
                existingBlog = await this.blogDao.getBySlug(slug);
                suffix++;
            }
    
            // Update blogData with the unique slug
            blogData.handle = slug;
    
            // Create the new blog entry with transaction support
            const newBlog = await this.blogDao.createWithTransaction(blogData);
    
            // If categories are included in blogData, handle their association
            if (blogData.categories && blogData.categories.length > 0) {
                await newBlog.setCategories(blogData.categories);
            }
    
            return { status: true, data: newBlog };
    
        } catch (error) {
            console.error('Error creating blog:', error);
            throw new Error('Error creating blog');
        }
    }
    
    
    // Helper function to generate a URL-friendly slug from the title
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')   // Replace non-alphanumeric characters with hyphens
            .replace(/(^-|-$)/g, '')       // Remove leading or trailing hyphens
            .trim();                       // Remove whitespace
    }
    

    // Find a blog by its ID
    async findBlogById(id) {
        try {
            const blog = await this.blogDao.findById(id);
            if (!blog) {
                return { status: false, message: 'Blog not found' };
            }
            return { status: true, data: blog };
        } catch (error) {
            console.error('Error finding blog:', error);
            throw new Error('Error finding blog');
        }
    }

    // Find blogs by title
    async findBlogsByTitle(title) {
        try {
            const blogs = await this.blogDao.findByTitle(title);
            return { status: true, data: blogs };
        } catch (error) {
            console.error('Error finding blogs:', error);
            throw new Error('Error finding blogs');
        }
    }

    // Get all blogs with optional pagination
    async getAllBlogs({ limit, offset }) {
        try {
            // Set default values if limit or offset are not provided
            const pagination = {};
            if (limit) {
                pagination.limit = limit;
            }
            if (offset) {
                pagination.offset = offset;
            }
    
            // Get total count of records
            const totalRecords = await this.blogDao.count({
                where: { status: 'Published' }
            });
    
            // Get paginated records with optional limit and offset
            const blogs = await this.blogDao.findAll({
                where: {
                    status: 'Published'
                },
                order: [['created_at', 'DESC']], // Order by created_at in descending order
                ...pagination, // Spread the pagination object to apply limit and offset if present
            });
    
            return { status: true, data: blogs, totalRecords };
        } catch (error) {
            console.error('Error retrieving blogs:', error);
            throw new Error('Error retrieving blogs');
        }
    }
    

    async getBlogById(id) {
        try {
            const blog = await this.blogDao.findById(id); // Assuming findById is a method in your DAO
            return blog;
        } catch (error) {
            console.error('Error retrieving blog by ID:', error);
            throw new Error('Error retrieving blog by ID');
        }
    }

    async updateBlog(id, blogData) {
        try {
            const blog = await this.blogDao.update(id, blogData);
            return blog;
        } catch (error) {
            console.error('Error updating blog:', error);
            throw new Error('Error updating blog');
        }
    }

    async getBlogBySlug(slug) {
        try {
            const blog = await this.blogDao.getBySlug(slug);
    console.log("slug", slug);
            if (!blog) {
                throw new Error('Blog not found');
            }
    
            return blog;
        } catch (error) {
            console.error('Error fetching blog by slug:', error);
            throw new Error('Error fetching blog');
        }
    }
    
}

module.exports = BlogService;
