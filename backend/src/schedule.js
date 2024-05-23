const schedule = (app, pool) => {
    app.get('/dashboard/schedule', async (req, res) => {
        const conn = await pool.getConnection();
        
        try{
            if (req.session.role === 'user') {
                const schedule = await conn.query(`
                SELECT 
                  appointment.appointment_id AS app_id,
                  DATE_FORMAT(appointment.date, "%m/%d/%Y") AS date, 
                  DATE_FORMAT(schedule.time_s, "%h:%i%p") AS stime, 
                  DATE_FORMAT(schedule.time_e, "%h:%i%p") AS etime,
                  appointment.childname as name
                FROM 
                  appointment 
                JOIN 
                  schedule ON appointment.schedule_id = schedule.schedule_id 
                WHERE 
                  appointment.portal_id IN (SELECT portal_id FROM portal WHERE username =?) 
                AND 
                  DATE(appointment.date) >= CURDATE()
                AND
                  appointment.appointment_id NOT IN(SELECT appointment_id FROM cancel)
                `, [req.session.user]);
  
                let schedules = [];
                schedule.forEach((row) => {
                  let schedule = {
                    id: row.app_id,
                    date: row.date,
                    time: `${row.stime} - ${row.etime}`.toLowerCase(),
                    name: row.name
                  };
                  schedules.push(schedule);
                });
            
            res.render('clientDashboard/schedule', {schedules});
        } else if (req.session.role === 'admin') {

          res.render('adminDashboard/schedule');
        } else {
          res.redirect('/login');
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } finally {
        conn.end();
      }
    });
  
    app.put('/dashboard/schedule/:id', async (req, res) => {
        const conn = await pool.getConnection();
        
        try {
            if (req.session.role === 'user') {
                const appointment = await conn.query(`
                SELECT 
                    appointment_id, 
                    firstname, 
                    lastname, 
                    childname, 
                    contact 
                FROM 
                    appointment JOIN schedule ON appointment.schedule_id = schedule.schedule_id 
                WHERE 
                    portal_id IN(SELECT portal_id FROM portal WHERE username =?) 
                AND appointment_id =?
            `, [req.session.user, req.params.id]);
  
             res.json(appointment[0]);
        } else if (req.session.role === 'admin') {
          // admin
        } else {
          // unauthorized
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } finally {
        conn.end();
      }
    });
  
    app.put('/dashboard/schedule/:id/edit', async (req, res) => {
        const conn = await pool.getConnection();
        try {
            if (req.session.role === 'user') {
                const { firstname, lastname, childname, contact } = req.body;
                const { id } = req.params;
                const result = await conn.query(`
                UPDATE 
                    appointment 
                SET 
                    firstname =?, 
                    lastname =?, 
                    childname =?, 
                    contact =? 
                WHERE 
                    portal_id IN(SELECT portal_id FROM portal WHERE username =?) 
                AND appointment_id =?
                `, [firstname, lastname, childname, contact, req.session.user, id]);
  
          if (result.affectedRows > 0) {
            // updated
          } else {
            // not updated
          }

        } else if (req.session.role === 'admin') {
          // admin
        } else {
          // unauthorized
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } finally {
        conn.end();
      }
    });
  
    app.put('/dashboard/schedule/:id/cancel', async (req, res) => {
        const conn = await pool.getConnection();
        
        try {
            if (req.session.role === 'user') {
                const { id } = req.params;
                const result = await conn.query(`insert into cancel (appointment_id) values(?)`, [id]);

            if (result.affectedRows > 0) {
              res.redirect('/dashboard/schedule');
            }
        } else if (req.session.role === 'admin') {
          // admin
        } else {
          // unauthorized
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } finally {
        conn.end();
      }
    });
  };
  
  module.exports = { schedule };