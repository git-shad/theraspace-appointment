const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const ejs = require('ejs');

const SEND_MAIL = require('./mailer');
const { createPool, role } = require('./src/db');
const { appointments } = require('./src/appointments');
const { schedule } = require('./src/schedule');
const { history } = require('./src/history');
const { prescription } = require('./src/prescription');
const { account } = require('./src/account');
const { home } = require('./src/home');

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

home(app);
appointments(app,pool);
schedule(app,pool);
history(app,pool);
prescription(app,pool);
account(app,pool);

//runtime
setInterval(async()=>{
    console.log('runtime looping')
    const conn = await pool.getConnection();
    const result = await conn.query('select appointment.portal_id as portal_id,date_format(appointment.date, "%m/%d/%Y") as date,date_format(schedule.time_s, "%h:%i%n") as stime, date_format(schedule.time_e,"%h:%i%n") as etime, firstname, lastname, childname, contact from appointment join schedule on appointment.schedule_id = schedule.schedule_id where date(appointment.date) > curdate();');
    
    for(let i = 0; i < result.length; i++){
        const template = new ejs.Template(`
        **Appointment Reminder**

        Dear {{firstname}} {{lastname}},
        
        This is a friendly reminder that you have an appointment scheduled for {{childname}} tomorrow, {{date}}.
        
        **Appointment Details:**
        
        * **Date:** {{date}}
        * **Start Time:** {{stime}}
        * **End Time:** {{etime}}
        * **Contact Number:** {{contact}}
        
        Please ensure you arrive on time to avoid any inconvenience.
        
        If you have any questions or need to reschedule, please don't hesitate to reach out to us.
        
        Thank you for choosing our service.
        
        Best regards,
        Theraspace Appointment
`);
        const htmlMessage = template.render(result[i]);
        const email = await conn.query('select email from portal where portal_id = ?',result[i].portal_id);
        const mailOptions = {
            from: 'isaacnievarez@gmail.com',
            to: email,
            subject: "Reminder",
            html: htmlMessage
          };
          
          await SEND_MAIL(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email: ", error);
            } else {
              console.log("Email sent successfully");
              console.log("MESSAGE ID: ", info.messageId);
            }
          });
    }

    conn.release();
},1);

app.get('/',(req,res)=>{
    res.redirect('/home')
});

app.get('/home',(req,res) => {
    res.render('index');
})

app.get('/signup',(req,res)=>{
    res.render('signup'); 
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
    const conn = await pool.getConnection();
    try {
        const rows = await conn.query('SELECT username, email, password FROM portal WHERE email =?', [username]);
        if(rows.length > 0){
            const user = rows[0];
            const result = await bcrypt.compare(password, user.password);
            if(result){
                req.session.user = user.username;
                global.whoAccess = await role(pool,req.session.user);

                const account = await conn.query('select image from account where portal_id in(select portal_id from portal where username = ?)',[req.session.user]);
                global.profile = account[0].image;

                res.json({success: 'true'});
            }else{
                res.json({success: 'Incorrect password'});
            }
        }else{
             res.json({success: 'No account configured!'});
        }
    } catch (err) {
        console.log(err);
        res.json({redirect: '/signup'})
    }finally{
        conn.end();
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

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const conn = await pool.getConnection();
        
    try {
        if (!username ||!email ||!password) {
            throw new Error('All fields are required');
        }
        const hash = await bcrypt.hash(password, 10);
        await conn.query('INSERT INTO portal (username,email,password) VALUES (?,?,?)',[username, email, hash]);
        await conn.query('insert into urole (portal_id,role) values ((select portal_id from portal where username =?),?)',[username,'user']);
        await conn.query('insert into account (portal_id,image) values((select portal_id from portal where username = ?),?)', [username, 'img/logo-removebg-preview.png']);
        res.json({redirect: '/login'});
        
    } catch (err) {
        console.log(err);
        if (err.message === 'All fields are required') {
            res.json({error: 'All fields are required'});
        } else {
            res.json({redirect: '/signup'})
        }
    }finally{
        conn.end();
    }
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});