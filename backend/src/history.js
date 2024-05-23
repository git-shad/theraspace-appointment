const history = (app,pool) => {
    
    app.get('/dashboard/history',async (req,res)=>{
        const conn = await pool.getConnection();
        if(req.session.role === 'user'){
            const history = await conn.query(`
            SELECT 
              appointment.appointment_id AS app_id,
              DATE_FORMAT(appointment.date, "%m/%d/%Y") AS date, 
              DATE_FORMAT(schedule.time_s, "%h:%i%p") AS stime, 
              DATE_FORMAT(schedule.time_e, "%h:%i%p") AS etime 
            FROM 
              appointment 
            JOIN 
              schedule ON appointment.schedule_id = schedule.schedule_id 
            WHERE 
              appointment.portal_id IN (SELECT portal_id FROM portal WHERE username =?) 
            AND 
              DATE(appointment.date) < CURDATE()
            OR
              appointment.appointment_id IN(SELECT appointment_id FROM cancel)
                `, [req.session.user]);
  
            let historys = [];
            history.forEach((row) => {
                let history = {
                    id: row.app_id,
                    date: row.date,
                    time: `${row.stime} - ${row.etime}`.toLowerCase()
                };
                historys.push(history);
            });
            
            res.render('clientDashboard/history', {historys});
        }else if(req.session.role === 'admin'){
          const history = await conn.query(`
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
              DATE(appointment.date) < CURDATE()
            OR
              appointment.appointment_id IN(SELECT appointment_id FROM cancel)
                `, [req.session.user]);
  
            let historys = [];
            history.forEach((row) => {
                let history = {
                    id: row.app_id,
                    date: row.date,
                    time: `${row.stime} - ${row.etime}`.toLowerCase(),
                    name: row.name
                };
                historys.push(history);
            });
            
          res.render('adminDashboard/history',{historys})
        }else{
          res.redirect('/login');
        }
    });

    app.put('/dashboard/history/:id', async (req, res) => {
      const conn = await pool.getConnection();
      if (req.session.role === 'user') {
        try {
          await conn.beginTransaction();
          await conn.query('DELETE FROM cancel WHERE appointment_id =?', [req.params.id]);
          await conn.query('DELETE FROM prescription WHERE appointment_id =?', [req.params.id]);
          await conn.query('DELETE FROM appointment WHERE appointment_id =?', [req.params.id]);
          await conn.commit();
          res.json({ success: 'true' });
        } catch (err) {
          await conn.rollback();
          console.error(err);
          res.status(500).json({ error: 'Failed to delete appointment' });
        } finally {
          conn.end();
        }
      } else if (req.session.role === 'admin') {
        //...
      } else {
        //...
      }
    });

    app.put('/dashboard/history/view/:id', async (req, res) => {
      const conn = await pool.getConnection();
      
      try {
          if (req.session.role === 'user') {
              
          } else if (req.session.role === 'admin') {
            const appointment = await conn.query(`
              SELECT 
                  appointment_id, 
                  firstname, 
                  lastname, 
                  childname, 
                  contact 
              FROM 
                  appointment JOIN schedule ON appointment.schedule_id = schedule.schedule_id 
              WHERE appointment_id =?
          `, [req.params.id]);

           res.json(appointment[0]);
          } else {
            
          }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } finally {
      conn.end();
    }
  });

  app.post('/dashboard/history/msg',async(req,res)=>{
    const conn = await pool.getConnection();
    try {
          if (req.session.role === 'user') {
              
          } else if (req.session.role === 'admin') {
            const { message,appointemnt_id } = req.body;
            await conn.query('')
          } else {
            
          }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } finally {
      conn.end();
    }
  });
}

module.exports = {history};