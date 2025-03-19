const express = require('express');
const authRoute = require('./authRoute');
const categoryRoutes = require('./categoryRoutes');
const cmsRoute = require('./cmsRoutes');
const router = express.Router();
const storeBlogRoute = require('./StoreBlogRoutes');
const storeCategoryRoute = require('./StoreCategoryRoutes');
const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/admin/blogs',
        route: cmsRoute,
    },
    {
        path: '/admin/category',
        route: categoryRoutes,
    },
    {
        path: '/blogs',
        route: storeBlogRoute,
    },
    
    {
        path: '/categories',
        route: storeCategoryRoute,
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
