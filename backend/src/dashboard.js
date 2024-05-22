const dashboard = (app,pool) => {
    app.get('/dashboard/dashboard',(req,res)=>{
        res.redirect('/dashboard/main');
    });
    
    app.get('/dashboard/main', async(req,res) => {
        const conn = await pool.getConnection();
        if(global.whoAccess === 'admin'){
            const appointments = await conn.query('select appointment.appointment_id as id,account.image as image,concat(account.firstname," ",account.lastname) as fullname,portal.email as email from appointment inner join account on appointment.account_id = account.account_id inner join portal on appointment.portal_id = portal.portal_id');
            
            // let appointments = [];
            // appointment.forEach((row)=>{
            //     let appointment = {
            //         id: row.id,
            //         image: row.image,
            //         name: row.fullname,
            //         email: row.email
            //     }
            //     appointments.push
            // });
            console.log(appointments)
            res.render('adminDashboard/dashboard',{appointments});
        }else{
        }
        conn.end();
    });

    app.put('/dashboard/main/:id',(req,res)=>{

    });
}

module.exports = {dashboard}