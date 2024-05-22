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
const { dashboard } = require('./src/dashboard');

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

app.use((req, res, next) => {
    res.cookie('cookieName', 'cookieValue', {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });
    next();
});

home(app);
dashboard(app,pool);
appointments(app,pool);
schedule(app,pool);
history(app,pool);
prescription(app,pool);
account(app,pool);

//runtime
// setInterval(async () => {
//     console.log('runtime looping');
//     const conn = await pool.getConnection();
//     const result = await conn.query(
//       'SELECT appointment.portal_id as portal_id, DATE_FORMAT(appointment.date, "%m/%d/%Y") as date, DATE_FORMAT(schedule.time_s, "%h:%i %p") as stime, DATE_FORMAT(schedule.time_e,"%h:%i %p") as etime, firstname, lastname, childname, contact FROM appointment JOIN schedule ON appointment.schedule_id = schedule.schedule_id WHERE DATE(appointment.date) > CURDATE();'
//     );
  
//     for (let i = 0; i < result.length; i++) {
//       const htmlMessage = `
//         <html>
//           <head>
//             <title>Appointment Reminder</title>
//           </head>
//           <body>
//             <h1>Appointment Reminder</h1>
//             <p>Dear ${result[i].firstname} ${result[i].lastname},</p>
//             <p>This is a friendly reminder that you have an appointment scheduled for ${result[i].childname} tomorrow, ${result[i].date}.</p>
//             <h2>Appointment Details:</h2>
//             <ul>
//               <li><strong>Date:</strong> ${result[i].date}</li>
//               <li><strong>Start Time:</strong> ${result[i].stime}</li>
//               <li><strong>End Time:</strong> ${result[i].etime}</li>
//               <li><strong>Contact Number:</strong> ${result[i].contact}</li>
//             </ul>
//             <p>Please ensure you arrive on time to avoid any inconvenience.</p>
//             <p>If you have any questions or need to reschedule, please don't hesitate to reach out to us.</p>
//             <p>Thank you for choosing our service.</p>
//             <p>Best regards,</p>
//             <p>Theraspace Appointment</p>
//           </body>
//         </html>
//       `;
  
//       const emailResult = await conn.query('SELECT email FROM portal WHERE portal_id =?', result[i].portal_id);
//       const email = emailResult[0].email;
//       const mailOptions = {
//         from: 'isaacnievarez@gmail.com',
//         to: email,
//         subject: "Reminder",
//         html: htmlMessage
//       };
  
//       await SEND_MAIL(mailOptions, (error, info) => {
//         if (error) {
//           console.error("Error sending email: ", error);
//         } else {
//           console.log("Email sent successfully");
//           console.log("MESSAGE ID: ", info.messageId);
//         }
//       });
//     }
  
//     conn.release();
//   }, 600000);

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
        const rows = await conn.query('SELECT username, email, password, role FROM portal join urole on portal.portal_id = urole.portal_id WHERE email =?', [username]);
        if(rows.length > 0){
            const user = rows[0];
            const result = await bcrypt.compare(password, user.password);
            if(result){
                req.session.user = user.username;
                global.whoAccess = await role(pool,req.session.user);

                const account = await conn.query('select image,email,username from account join portal on account.portal_id = portal.portal_id where account.portal_id in(select portal_id from portal where username = ?)',[req.session.user]);
                global.profile = account[0].image;
                global.email = account[0].email;
                global.username = req.session.user;

                res.json({success: 'true',location: user.role === 'user'?'/dashboard/appointments':'/dashboard/main'});
                

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
            res.send('<script>window.close()</script>');
            
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

app.use((req, res, next) => {
    res.status(404).render('404');
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});