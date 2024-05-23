const dashboard = (app,pool) => {
    app.get('/dashboard/dashboard',(req,res)=>{
        res.redirect('/dashboard/main');
    });
    
    app.get('/dashboard/main', async(req,res) => {
        const conn = await pool.getConnection();
        
        if(global.wwhoAccess === 'admin'){
            
            res.render('adminDashboard/dashboard');
        }
    });

    app.put('/dashboard/main/:id',(req,res)=>{

    });
}

module.exports = {dashboard}