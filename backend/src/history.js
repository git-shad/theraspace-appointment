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
          res.render('adminDashboard/history')
        }else{
    
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
}

module.exports = {history};