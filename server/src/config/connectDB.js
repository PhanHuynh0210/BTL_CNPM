const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('BTL_CNPM', 'root', 'Jacuby@123', {
    host: 'localhost',
    dialect: 'mysql' 
  });

  const checkconnect = async () =>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
  }
  export default checkconnect;