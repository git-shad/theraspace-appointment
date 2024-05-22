const dashboard = (app,pool) => {
    app.get('/dashboard/dashboard',(req,res)=>{
        res.redirect('/dashboard/main');
    });
    
    app.get('/dashboard/main',(req,res) => {
        
        res.render('adminDashboard/dashboard');
    });

    app.put('/dashboard/main/:id',(req,res)=>{

    });
}

module.exports = {dashboard}