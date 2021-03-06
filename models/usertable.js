'use strict'
module.exports = (sequelize, DataTypes) => {
    let usertable = sequelize.define("usertable", {
        
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true,
        }

        

    },{
        timestamps: true,
        tableName: "usertable",
    });

    return usertable;
}