const multer = require('multer');
const fs = require('fs');

const account = (app, pool) => {
  const upload = multer({ dest: './uploads' });

  app.get('/dashboard/account', (req, res) => {
    if (global.whoAccess === 'user') {
      // user
      res.render('clientDashboard/account');
    } else if (global.whoAccess === 'admin') {
      // admin
    } else {
      res.redirect('/login');
    }
  });

  app.post('/dashboard/upload', upload.single('image'), async (req, res) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }

    try {
      const { firstname, lastname, email, address, contact } = req.body;
      const image = req.file;

      if (!image) {
        throw new Error('No file provided');
      }

      const fileContent = await fs.promises.readFile(image.path);
      await fs.promises.writeFile(`uploads/${image.originalname}`, fileContent);

      res.redirect('/dashboard/account');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error writing file');
    }
  });
};

module.exports = { account };