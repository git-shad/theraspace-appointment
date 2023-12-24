const dashboard = (app,pool) => {
    app.get('/dashboard/dashboard',(req,res)=>{
        
    })
    app.get('/dashboard/main',(req,res) => {

        res.render('adminDashboard/dashboard');
    });
}

module.exports = {dashboard}