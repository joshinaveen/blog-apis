const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Category extends Model {
        static associate(models) {
           // Category.hasMany(models.blog, { foreignKey: 'category_id' });
            Category.belongsToMany(models.blog, { through: 'blog_categories', foreignKey: 'category_id',  as: 'blogs' });
        }
    }

    Category.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
            handle: {
                type: DataTypes.STRING,
                allowNull: true
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
            status: {
                type: DataTypes.ENUM('Draft', 'Published'),
                allowNull: false,
                defaultValue: 'Published',
            }
        },
        {
            sequelize,
            modelName: 'category',
            tableName: 'categories',
            underscored: true,
        },
    );

    return Category;
};
