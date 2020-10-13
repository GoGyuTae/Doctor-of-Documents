/*const { DataTypes } = require("sequelize/types");
const { sequelize } = require(".");
*/
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("usertable", {
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
}