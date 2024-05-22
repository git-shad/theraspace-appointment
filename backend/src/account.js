const multer = require('multer');
const fs = require('fs');

const account = (app, pool) => {
  const upload = multer({ dest: './profiles' });

  app.get('/dashboard/account', async (req, res) => {
    const conn = await pool.getConnection();
    if (req.session.role === 'user') {
        const user = await conn.query('SELECT email FROM portal WHERE username =?', [req.session.user]);
        const result = await conn.query('select firstname,lastname,email,address,contact,image from account join portal on account.portal_id = portal.portal_id where portal.portal_id in(select portal_id from portal where username = ?)', [req.session.user]);
        const account = Object.assign({},result[0],{            
            username: req.session.user,
            email: user[0].email
        });
        console.log(account);

        res.render('clientDashboard/account',account);
    } else if (req.session.role === 'admin') {
      // admin
    } else {
      res.redirect('/login');
    }
  });

  app.post('/dashboard/upload', upload.single('image'), async (req, res) => {
    if (!fs.existsSync('profiles')) {
      fs.mkdirSync('profiles');
    }


    const conn = await pool.getConnection();
    try {
      const { firstname, lastname, email, address, contact } = req.body;
      const image = req.file;

      if (image) {
        const fileContent = await fs.promises.readFile(image.path);
        await fs.promises.writeFile(`profiles/${image.originalname}`, fileContent);  
      }

      const account = await conn.query('update account set firstname=?,lastname=?,address=?,contact=? where portal_id in(select portal_id from portal where username = ?)', [firstname, lastname, address, contact, req.session.user]);
      const portal = await conn.query('update portal set email=? where  username = ?', [email, req.session.user]);

      if(account.affectedRows > 0 && portal.affectedRows > 0){
        console.log('updated account info');
      }

      
    } catch (error) {
      console.error(error);
      res.status(500).send('Error writing file');
    }finally{
      conn.end();
    }
  });
};

module.exports = { account };