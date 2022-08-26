import SQ from 'sequelize';
import { config } from '../config.js';

const { host, user, database, password } = config.db;
export const sequelize = new SQ.Sequelize(database, user, password, {
  define: {
    charset: 'utf8',
    dialectOptions: { collate: 'utf8_general_ci' },
  },
  host,
  dialect: 'mysql',
  logging: false,
});

const DataTypes = SQ.DataTypes;

export const category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      comment: '카테고리 PK',
    },
    Img: {
      type: DataTypes.STRING(256),
      allowNull: false,
      comment: '카테고리 이미지',
    },
    Name: {
      type: DataTypes.STRING(256),
      allowNull: false,
      comment: '카테고리 명',
    },
  },
  { freezeTableName: true, comment: '카테고리 테이블' }
);

export const restaurant = sequelize.define(
  'Restaurant',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: '식당 PK',
    },
    Name: {
      type: DataTypes.STRING(256),
      allowNull: false,
      comment: '식당 명',
    },
    X: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      comment: 'X 좌표 값',
    },
    Y: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      comment: 'Y 좌표 값',
    },
    Tel: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '식당 전화번호',
    },
    Address: {
      type: DataTypes.STRING(256),
      allowNull: false,
      comment: '주소(도로명)',
    },
    Times: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: '영업시간',
    },
  },
  {
    freezeTableName: true,
    comment: '식당 테이블',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const menu = sequelize.define(
  'Menu',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      comment: '메뉴 PK',
    },
    Name: {
      type: DataTypes.STRING(256),
      allowNull: false,
      comment: '메뉴 명',
    },
    Price: {
      type: DataTypes.INTEGER,
      comment: '가격',
    },
  },
  { freezeTableName: true, comment: '메뉴 테이블' }
);
export const order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    Phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '예약자 전화번호',
    },
    Booker: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '예약자 명',
    },
    People: {
      type: DataTypes.INTEGER,
      comment: '예약자 명',
    },
    Book_date: {
      type: 'TIMESTAMP',
      allowNull: false,
      comment: '예약날짜 + 시간',
    },
  },
  { freezeTableName: true, comment: '예약 테이블' }
);

category.hasMany(
  restaurant
  //   , {
  //   foreignKey: 'Category_id',
  //   onUpdate: 'CASCADE',
  //   onDelete: 'CASCADE',
  // }
);
restaurant.belongsTo(category);
restaurant.hasMany(menu);
menu.belongsTo(restaurant);
restaurant.hasMany(order);
