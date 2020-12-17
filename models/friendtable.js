module.exports = (sequelize, DataTypes) => {
    let friendtable = sequelize.define("friendtable", {
        
        to: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        from: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        toname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fromname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        friendtype: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '아직'
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0'
        }

        

    },{
        timestamps: true,
        tableName: "friendtable",
    });

    return friendtable;
}