'use strict'
module.exports = (sequelize, DataTypes) => {
    let usertable = sequelize.define("usertable", {
        
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        }

        

    },{
        timestamps: true,
        tableName: "usertable",
    });

    return usertable;
}