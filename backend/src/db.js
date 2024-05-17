const mariadb = require('mariadb');

const createPool = () => {
    try{
        const pool = mariadb.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'theraspace'
        });
        console.log('database connected!')
        return pool;
    }catch(error){
        console.error(`Error creating database connection : ${error}`);
        throw error;
    }
};

const role = async (pool, user = '') => {
    try {
      const conn = await pool.getConnection();
      try {
        const rows = await conn.query('SELECT role FROM urole WHERE portal_id IN(SELECT portal_id FROM portal WHERE username =?)', [user]);
        if (rows.length > 0) {
          return rows[0].role;
        }
      } catch (err) {
        console.log(err);
      } finally {
        conn.end();
      }
    } catch (error) {
      console.log(error);
    }
  }


module.exports = {createPool,role};