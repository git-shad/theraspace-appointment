const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { createPool, role } = require('./src/db.js');
const { appointments } = require('./src/appointments.js');
const { schedule } = require('./src/schedule.js');

const app = express();
const pool = createPool(); 

global.whoAccess = 'no-login';

app.set('views',path.join(__dirname, '../frontend/views'))
app.set('view engine', 'ejs'); 
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'../frontend/views'), {serverIndex: true}));
app.use('/dashboard',express.static(path.join(__dirname,'../frontend/views'), {serverIndex: true}));
app.use(express.static(path.join(__dirname,'./src'), {serverIndex: true}));
app.use('/dashboard',express.static(path.join(__dirname,'./src'), {serverIndex: true}));

app.use(session({
    secret: uuid.v4(),
    resave: true,
    saveUninitialized: true
}));

appointments(app,pool);
schedule(app,pool);


app.get('/',(req,res)=>{
    res.redirect('/home')
});

app.get('/home',(req,res) => {
    res.render('index');
})

app.get('/signup',(req,res)=>{
    res.render('signup'); 
});

app.get('/dashboard/account',(req,res) => {
     
    if(global.whoAccess === 'user'){
        //user
        res.render('clientDashboard/account');
    }else if(global.whoAccess === 'admin'){
        //addmin
    }else{
        res.redirect('/login')
    }
});

app.get('/login', (req, res) => {
    if(global.whoAccess !== 'no-login'){
        res.redirect('/dashboard/appointments');
    }else{
        res.render('login');
    }
});

app.post('/login', async (req,res)=>{
    const {username, password} = req.body;
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT username, email, password FROM portal WHERE email =?', [username]);
        if(rows.length > 0){
            const user = rows[0];
            const result = await bcrypt.compare(password, user.password);
            if(result){
                req.session.user = user.username;
                global.whoAccess = await role(pool,req.session.user);
                res.json({success: 'true'});
            }else{
                res.json({success: 'Incorrect password'});
            }
        }else{
             res.json({success: 'No account configured!'});
        }
        conn.end();
    } catch (err) {
        console.log(err);
        res.json({redirect: '/signup'})
    }
});

app.get('/dashboard/logout', (req,res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error destroying session');
        } else {
            global.whoAccess = 'no-login';
            res.redirect('/login');
        }
    });
})

app.post('/signup', async (req,res) => {
    const {username, email, password} = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const conn = await pool.getConnection();
        await conn.query('INSERT INTO portal (username,email,password) VALUES (?,?,?)',[username, email, hash]);
        await conn.query('insert into urole (portal_id,role) values ((select portal_id from portal where username =?),?)',[username,'user']);
        res.json({redirect: '/login'});
        conn.end();
    } catch (err) {
        console.log(err);
        res.json({redirect: '/signup'})
    }
})

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});