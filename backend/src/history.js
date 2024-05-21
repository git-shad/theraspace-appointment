const history = (app,pool) => {
    app.get('/dashboard/history',(req,res)=>{
        res.render('clientDashboard/history');
    });
}

module.exports = {history};