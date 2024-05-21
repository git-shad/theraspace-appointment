const history = (app,pool) => {
    app.get('/dashboard/history',async (req,res)=>{
        if(global.whoAccess === 'user'){
            const user = await conn.query('SELECT email FROM portal WHERE username =?', [req.session.user]);
            const history = await conn.query(`
                SELECT 
                    appointment.appointment_id AS app_id,
                    DATE_FORMAT(appointment.date, "%m/%d/%Y") AS date, 
                    DATE_FORMAT(schedule.time_s, "%h:%i%p") AS stime, 
                    DATE_FORMAT(schedule.time_e, "%h:%i%p") AS etime 
                FROM 
                    appointment JOIN schedule ON appointment.schedule_id = schedule.schedule_id 
                WHERE appointment.portal_id IN(SELECT portal_id FROM portal WHERE username =?)
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
            
            res.render('clientDashboard/history', {
                historys,
                username: req.session.user,
                email: user[0].email
            });
        }else if(global.whoAccess === 'admin'){
    
        }else{
    
        }
    });
}

module.exports = {history};