'use strict'
module.exports = (sequelize, DataTypes) => {
    let usertable = sequelize.define("usertable", {
        
        useremail: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },

        name: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },

    },{
        timestamps: true,
        tableName: "usertable",
    });

    return usertable;
}