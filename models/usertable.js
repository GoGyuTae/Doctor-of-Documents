'use strict'
module.exports = (sequelize, DataTypes) => {
    let usertable = sequelize.define("usertable", {
        
        phone: {
            type: DataTypes.INTEGER,
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
        }

        

    },{
        timestamps: true,
        tableName: "usertable",
    });

    return usertable;
}