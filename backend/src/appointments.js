const appointments = (app, pool) => {
    app.get('/dashboard/appointments', async (req, res) => {
        const conn = await pool.getConnection();
        try {
            if (global.whoAccess === 'user') {
                const user = await conn.query('SELECT email FROM portal WHERE username =?',[req.session.user]);
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
                email: user[0].email
            });
        } else if (global.whoAccess === 'admin') {
          res.render('adminDashboard/appointments')
        } else {
          res.redirect('/login')
        }
      } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while processing your request.');
      }finally{
        conn.end();
      }
    });
  
    app.post('/dashboard/appointments',async (req, res) => {
        const conn = await pool.getConnection();
        
        try {
            if (global.whoAccess === 'user') {
                const {schedule_id,date,fname,lname,childname,contact} = req.body;
                await conn.query(`INSERT INTO appointment (portal_id,schedule_id,date,firstname,lastname,childname,contact) VALUES((SELECT portal_id from portal where username =?),?,?,?,?,?,?)`,[req.session.user,parseInt(schedule_id),date,fname,lname,childname,contact]);
                console.log('appointment recorded!');
                
            } else if (global.whoAccess === 'admin') {
                //addmin
            } else {
  
            }
      } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while processing your request.');
      }finally{
        conn.end();
      }
    });
  }
  
  module.exports = {appointments}