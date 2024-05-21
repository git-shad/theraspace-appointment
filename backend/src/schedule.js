const schedule = (app,pool)=>{
    app.get('/dashboard/schedule',async (req,res) => {
        const conn = await pool.getConnection();
        
        if(global.whoAccess === 'user'){
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
        }else if(global.whoAccess === 'admin'){
            //addmin
        }else{
            res.redirect('/login')
        }
    });
    
    app.put('/dashboard/schedule/:appointment_id',async (req,res) => {
        const conn = await pool.getConnection();
        
        if(global.whoAccess === 'user'){
            const {appointment_id} = req.params;
            const appointment = await conn.query('SELECT appointment_id,firstname,lastname,childname,contact FROM appointment JOIN schedule ON appointment.schedule_id = schedule.schedule_id WHERE portal_id IN(SELECT portal_id FROM portal WHERE username = ?) AND appointment_id = ?;',[req.session.user,appointment_id]);
            
            res.json(appointment[0]);
            
        }else if(global.whoAccess === 'admin'){
    
        }else{
    
        }
        conn.end();
    
    });
}

module.exports = {schedule};