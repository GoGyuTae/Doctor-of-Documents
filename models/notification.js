module.exports = (sequelize, DataTypes) => {
    let notification = sequelize.define("notification", {
        
        to: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        from: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        

    },{
        timestamps: true,
        tableName: "notification",
    });

    return notification;
}