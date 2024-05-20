const history = (app,pool) => {
    app.get('/dashboard/history',(req,res)=>{
        if(global.whoAccess === 'user'){
            res.render('clientDashboard/history');
        }else if(global.whoAccess === 'admin'){
    
        }else{
    
        }
    });
}

module.exports = {history};