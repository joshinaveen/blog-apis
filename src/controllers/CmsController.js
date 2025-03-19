const httpStatus = require('http-status');
const BlogService = require('../service/BlogService'); // Import the new BlogService
const logger = require('../config/logger');

class CmsController {
    constructor() {
        this.blogService = new BlogService(); // Initialize BlogService
    }

    add = async (req, res) => {
        try {
            const blogData = req.body;

            // Validate and sanitize input as necessary
            if (!blogData.title || !blogData.author || !blogData.content) {
                return res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    message: 'Missing required fields'
                });
            }

            const result = await this.blogService.createBlog(blogData);

            if (result.status) {
                res.status(httpStatus.CREATED).send({
                    status: true,
                    message: 'Blog created successfully',
                    data: result.data
                });
            } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    status: false,
                    message: result?.message || "Failed to create blog"
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

    getAll = async (req, res) => {
        try {
                // Extract limit and offset from query parameters, with defaults
            const limit = parseInt(req.query.limit, 10) || "";
            const offset = parseInt(req.query.offset, 10) || "";

            // Fetch blogs using the limit and offset
            const blogs = await this.blogService.getAllBlogs({ limit, offset });

            if (blogs.status) {

                if (blogs) {
                    res.status(httpStatus.OK).send({
                        status: true,
                        data: blogs?.data,
                        totalRecords: blogs.totalRecords
                    });
                } else {
                    res.status(httpStatus.NOT_FOUND).send({
                        status: false,
                        message: 'No blogs found',
                    });
                }
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

    getAllTags = async (req, res) => {
        try {
            // Extract limit and offset from query parameters, with defaults
            const limit = parseInt(req.query.limit, 10) || "";
            const offset = parseInt(req.query.offset, 10) || "";
    
            // Fetch blogs using the limit and offset
            const blogs = await this.blogService.getAllBlogs({ limit, offset });
    
            if (blogs.status) {
                if (blogs.data && blogs.data.length > 0) {
                    // Extract all tags from blogs and flatten them
                    const allTags = blogs.data.reduce((acc, blog) => {
                        // Ensure the tags are parsed correctly as an array
                        let tags = blog.tags ? JSON.parse(blog.tags) : [];
                        if (tags && Array.isArray(tags)) {
                            acc.push(...tags);
                        }
                        return acc;
                    }, []);
    
                    // Count occurrences of each unique tag
                    const tagCount = allTags.reduce((acc, tag) => {
                        acc[tag] = (acc[tag] || 0) + 1;
                        return acc;
                    }, {});
    
                    // Return the tag count object
                    res.status(httpStatus.OK).send({
                        status: true,
                        data: tagCount,
                        totalRecords: blogs.totalRecords
                    });
                } else {
                    res.status(httpStatus.NOT_FOUND).send({
                        status: false,
                        message: 'No blogs found',
                    });
                }
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
    
    

    getBlogById = async (req, res) => {
        try {
            const { id } = req.params; // Extract the ID from request parameters

            if (!id) {
                return res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    message: 'Blog ID is required'
                });
            }

            const blog = await this.blogService.getBlogById(id);

            if (blog) {
                res.status(httpStatus.OK).send({
                    status: true,
                    data: blog
                });
            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    status: false,
                    message: 'Blog not found'
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

    getBlogBySlug = async (req, res) => {
        try {
            const { slug } = req.params; // Extract the ID from request parameters

            if (!slug) {
                return res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    message: 'Blog slug is required'
                });
            }

            const blog = await this.blogService.getBlogBySlug(slug);

            if (blog) {
                res.status(httpStatus.OK).send({
                    status: true,
                    data: blog
                });
            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    status: false,
                    message: 'Blog not found'
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


    updateBlog = async (req, res) => {
        try {
            const { id } = req.params; // Extract the ID from request parameters
            const blogData = req.body; // Extract blog data from request body

            if (!id || !blogData) {
                return res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    message: 'Blog ID and data are required'
                });
            }

            const result = await this.blogService.updateBlog(id, blogData);

            if (result) {
                res.status(httpStatus.OK).send({
                    status: true,
                    message: 'Blog updated successfully',
                    data: result
                });
            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    status: false,
                    message: 'Blog not found'
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

module.exports = CmsController;
