const dashboard = (app,pool) => {
    app.get('/dashboard/dashboard',(req,res)=>{
        res.json({location: '/dashboard/main'});
    });
    
    app.get('/dashboard/main', async(req,res) => {
        console.log('hayss')
        //const conn = await pool.getConnection();
        
        if(global.wwhoAccess === 'admin'){
            
            res.render('adminDashboard/appoinntments');
        }else{
        }
        //conn.end();
    });

    app.put('/dashboard/main/:id',(req,res)=>{

    });
}

module.exports = {dashboard}