const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { createPool, role } = require('./src/db.js');

const app = express();
const pool = createPool(); 

var whoAccess = 'no-login';

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
}))


app.get('/',(req,res)=>{
    res.redirect('/home')
});

app.get('/home',(req,res) => {
    res.render('index');
})

app.get('/signup',(req,res)=>{
    res.render('signup'); 
});

app.get('/dashboard/appointments', async (req,res) => {
    const conn = await pool.getConnection();

    if(whoAccess === 'user'){
        const user = await conn.query('SELECT email FROM portal WHERE username = ?',[req.session.user]);
        const schedule = await conn.query('SELECT schedule_id,DATE_FORMAT(time_s, "%h:%i%p") as stime, DATE_FORMAT(time_e, "%h:%i%p") as etime from schedule');
        
        let appointments = [];
        schedule.forEach(row => {
            const img = ['random/1.png','random/2.png','random/3.png','random/4.png','random/5.png'];
            let appointment = {
                schedule: `${row.stime} - ${row.etime}`.toLowerCase(),
                image: img[Math.floor(Math.random() * 5)],
                id: row.schedule_id
            };
            appointments.push(appointment);
        });
        res.render('clientDashboard/appointments',{
            appointments,
            username: req.session.user,
            email: user[0].email});
    }else if(whoAccess === 'admin'){
        //addmin
    }else{
        res.redirect('/login')
    }
    conn.end();
});

app.post('/dashboard/appointments',async (req,res)=>{
    if(whoAccess === 'user'){
        const {schedule_id,date,fname,lname,childname,contact} = req.body; 
        try{
            const conn = await pool.getConnection();
            await conn.query(`INSERT INTO appointment (portal_id,schedule_id,date,firstname,lastname,childname,contact) VALUES((SELECT portal_id from portal where username = ?),?,?,?,?,?,?)`,[req.session.user,parseInt(schedule_id),date,fname,lname,childname,contact]);
            console.log('appointment recorded!');
            conn.end();
        }catch(error){
            console.log(error);
        }
    }else if(whoAccess === 'admin'){
        //addmin
    }else{

    }

});

app.get('/dashboard/schedule',async (req,res) => {
    const conn = await pool.getConnection();
    
    if(whoAccess === 'user'){
        const user = await conn.query('SELECT email FROM portal WHERE username = ?',[req.session.user]);
        const schedule = await conn.query(`SELECT 
                                                    appointment.appointment_id AS id,
                                                    DATE_FORMAT(appointment.date, "%m/%d/%Y") AS date, 
                                                    DATE_FORMAT(schedule.time_s, "%h:%i%p") AS stime, 
                                                    DATE_FORMAT(schedule.time_e, "%h:%i%p") AS etime 
                                           FROM 
                                                    appointment JOIN schedule ON appointment.schedule_id = schedule.schedule_id 
                                           WHERE appointment.portal_id IN(SELECT portal_id FROM portal WHERE username = ?)`
                                        ,[req.session.user]);
        
        let schedules = [];
        schedule.forEach(row => {
            let schedule = {
                id: row.id,
                date: row.date,
                time: `${row.stime} - ${row.etime}`.toLowerCase()
            };
            schedules.push(schedule);
        });

        res.render('clientDashboard/schedule',{
            schedules,
            username: req.session.user,
            email: user[0].email
        });
    }else if(whoAccess === 'admin'){
        //addmin
    }else{
        res.redirect('/login')
    }
});

app.post('/dashboard/schedule',async(req,res) => {
    const conn = await pool.getConnection();
    
    if(whoAccess === 'user'){
        const {appointment_id} = req.body;
        const appointment = await conn.query('SELECT portal_id,')
    }else if(whoAccess === 'admin'){

    }else{

    }

});

app.get('/dashboard/account',(req,res) => {
     
    if(whoAccess === 'user'){
        //user
        res.render('clientDashboard/account');
    }else if(whoAccess === 'admin'){
        //addmin
    }else{
        res.redirect('/login')
    }
});

app.get('/login', (req, res) => {
    if(whoAccess !== 'no-login'){
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
                whoAccess = await role(pool,req.session.user);
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
            whoAccess = 'no-login';
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