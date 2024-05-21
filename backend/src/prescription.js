const prescription = (app,pool)=>{
    app.get('/dashboard/prescription',(req,res)=>{
        res.render('clientDashboard/prescription');
    });
}

module.exports = {prescription};