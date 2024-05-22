const prescription = (app,pool)=>{
    app.get('/dashboard/prescription',async (req,res)=>{
        const conn = await pool.getConnection();
        
        try{
            if (req.session.role === 'user') {
                const prescription = await conn.query('select prescription.prescription_id as id,date_format(appointment.date, "%m/%d/%Y") as date,appointment.childname as fullname from appointment join prescription on appointment.appointment_id = prescription.appointment_id where appointment.portal_id in (select portal_id from portal where username = ?)',[req.session.user]);
                
                let prescriptions = [];
                prescription.forEach((row)=>{
                    const prescription = {
                        id: row.id,
                        date: row.date,
                        name:row.fullname
                    } 
                    prescriptions.push(prescription);
                });

                res.render('clientDashboard/prescription',{prescriptions});
            } else if (req.session.role === 'admin') {
              res.render('adminDashboard/prescription')
            } else {
                res.redirect('/login');
            }
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } finally {
        conn.end();
      }
    });

    app.put('/dashboard/prescription/:id', async (req, res) => {
        const conn = await pool.getConnection();
        
        try {
            if (req.session.role === 'user') {
                const { id } = req.params;
                const result = await conn.query('select message from prescription join appointment on appointment.appointment_id = prescription.appointment_id where appointment.portal_id in(select portal_id from portal where username = ?) and prescription.prescription_id = ?;', [req.session.user, id]);
                const prescription = result[0].message;
                console.log(prescription);
                
                res.json({msg: prescription});
          
        } else if (req.session.role === 'admin') {
          // admin
        } else {
          // unauthorized
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } finally {
        conn.end();
      }
    });
}

module.exports = {prescription};