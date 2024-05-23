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
                const prescriptions = await conn.query(`SELECT 
                appointment.appointment_id AS id,date,
                LOWER(
                  CONCAT(
                    DATE_FORMAT(schedule.time_s, "%h:%i %p"),
                    ' - ',
                    DATE_FORMAT(schedule.time_e, "%h:%i %p")
                  )
                ) AS time,
                appointment.childname AS childname
              FROM 
                appointment 
              JOIN 
                schedule ON appointment.schedule_id = schedule.schedule_id 
              WHERE appointment.date < CURDATE()
                `);

              res.render('adminDashboard/prescription',{prescriptions})
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

    // app.post('/dashboard/prescription/change',async(req,res)=>{
    //   const conn = await pool.getConnection();
      
    //     try{
    //         if (req.session.role === 'user') {

    //         } else if (req.session.role === 'admin') {
    //           const {inputDate} = req.body;
    //           const prescriptions = await conn.query(`SELECT 
    //             appointment.appointment_id AS id,date,
    //             LOWER(
    //               CONCAT(
    //                 DATE_FORMAT(schedule.time_s, "%h:%i %p"),
    //                 ' - ',
    //                 DATE_FORMAT(schedule.time_e, "%h:%i %p")
    //               )
    //             ) AS time,
    //             appointment.childname AS childname
    //           FROM 
    //             appointment 
    //           JOIN 
    //             schedule ON appointment.schedule_id = schedule.schedule_id 
    //           WHERE appointment.date < CURDATE() and appointment.date = ?
    //             `,[inputDate]);

    //             console.log(inputDate);
    //             if(prescriptions.length > 0){
    //               console.log('new status');
    //               res.render('adminDashboard/prescription',{prescriptions})
    //             }
    //         } else {
    //             res.redirect('/login');
    //         }
    //   } catch (err) {
    //     console.error(err);
    //     res.status(500).send('Internal Server Error');
    //   } finally {
    //     conn.end();
    //   }
    // })
}

module.exports = {prescription};