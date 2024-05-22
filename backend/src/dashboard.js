const dashboard = (app,pool) => {
    app.get('/dashboard/dashboard',(req,res)=>{
        res.redirect('/dashboard/main');
    });
    
    app.get('/dashboard/main', async(req,res) => {
        const conn = await pool.getConnection();
        if(global.whoAccess === 'admin'){
            const appointments = await conn.query('select appointment.appointment_id as id,account.image as image,concat(account.firstname," ",account.lastname) as name,portal.email as email from appointment inner join account on appointment.account_id = account.account_id inner join portal on appointment.portal_id = portal.portal_id');
            
            const result = await conn.query('select (select count(*) from account where portal_id not in(select portal_id from urole where role = "admin")) as users, (select count(*) from appointment where month(date) = month(current_date) and year(date) = year(current_date)) as month, (select count(*) from cancel) as cancel');
            
            res.render('adminDashboard/dashboard',{
                appointments,
                count_appointment: `${appointments.length}`,
                count_user: result[0].users,
                count_month: result[0].month,
                count_cancel: result[0].cancel
            });
        }else{
        }
        conn.end();
    });

    app.put('/dashboard/main/:id',(req,res)=>{

    });
}

module.exports = {dashboard}