const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Blog extends Model {
        static associate(models) {
            Blog.belongsToMany(models.category, { through: 'blog_categories', foreignKey: 'blog_id',  as: 'categories', });
            
           // Blog.belongsTo(models.category, { foreignKey: 'category_id', as: 'category' });
        }
    }

    Blog.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            author: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            image_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('Draft', 'Published'),
                allowNull: false,
                defaultValue: 'Draft',
            },
            handle: {
                type: DataTypes.STRING,
                allowNull: true
            },
            tags: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: [],
                get() {
                    const rawValue = this.getDataValue('tags');
                    return rawValue ? JSON.parse(rawValue) : [];
                },
                set(value) {
                    this.setDataValue('tags', JSON.stringify(value));
                },
            },
            short_description: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                onUpdate: DataTypes.NOW,
            },
            category_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'categories', 
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            }
        },
        {
            sequelize,
            modelName: 'blog',
            tableName: 'blogs',
            underscored: true,
        },
    );

    return Blog;
};
