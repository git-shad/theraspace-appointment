const schedule = (app,pool)=>{
    app.get('/dashboard/schedule',async (req,res) => {
        const conn = await pool.getConnection();
        
        if(global.whoAccess === 'user'){
            const user = await conn.query('SELECT email FROM portal WHERE username = ?',[req.session.user]);
            const schedule = await conn.query(`SELECT 
                                                        appointment.appointment_id AS app_id,
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
                    id: row.app_id,
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
    
    app.put('/dashboard/schedule/:id',async (req,res) => {
        const conn = await pool.getConnection();
        
        if(global.whoAccess === 'user'){
            
            const appointment = await conn.query('SELECT appointment_id,firstname,lastname,childname,contact FROM appointment JOIN schedule ON appointment.schedule_id = schedule.schedule_id WHERE portal_id IN(SELECT portal_id FROM portal WHERE username = ?) AND appointment_id = ?;',[req.session.user,req.params.id]);
            
            res.json(appointment[0]);
            
        }else if(global.whoAccess === 'admin'){
    
        }else{
    
        }
        conn.end();
    
    });

    app.put('/dashboard/schedule/:id/edit',async (req,res)=>{
        const conn = await pool.getConnection();
        
        if(global.whoAccess === 'user'){
            const { firstname,lastname,childname,contact } = req.body;
            const { id } = req.params;
            const result = await conn.query('UPDATE appointment SET firstname=?,lastname=?,childname=?,contact=? WHERE portal_id IN(SELECT portal_id FROM portal WHERE username = ?) AND appointment_id = ?',[firstname,lastname,childname,contact,req.session.user,id]);

            if(result.affectedRows > 0){
                // updated
            }else{
                // not updated
            }
        }else if(global.whoAccess === 'admin'){
    
        }else{
    
        }
        conn.end();
    });

    app.put('/dashboard/schedule/:id/delete',async (req,res)=>{
        const conn = await pool.getConnection();
        
        if(global.whoAccess === 'user'){
            const { id } = req.params;
            const result = await conn.query('DELETE FROM appointment WHERE portal_id IN(SELECT portal_id FROM portal WHERE username = ?) AND appointment_id = ?',[req.session.user,id]);
            
            if(result.affectedRows > 0){
                // deleted
            }else{
                // not deleted
            }
        }else if(global.whoAccess === 'admin'){
    
        }else{
    
        }
        conn.end();
    })
}

module.exports = {schedule};