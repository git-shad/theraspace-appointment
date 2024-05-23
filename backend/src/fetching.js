function $($){
    return document.querySelector($);
}

function $$($){
    return document.querySelectorAll($);
}

function changeID(id){
    document.querySelector('#boxID').innerHTML = id;
}

function confirmLogout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Successfully Logged Out!",
          text: "Recorded",
          icon: "success"
        }).then(() => {
          window.location.href = 'logout';
        });
      }
    });
}  

const login = $('#login');
if(login){
    login.addEventListener('click',(e)=>{
        e.preventDefault();
        const username = $('#username').value;
        const password = $('#password').value;
    
        const data = {username,password};
        
        console.log(data);
        // Send the data to the backend
        fetch('/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if(data){
                const password = $('#password');
                console.log(data.success);
                if(data.redirect){
                    window.location.href = data.redirect;
                }else if(data.success === 'true'){
                    password.classList.remove('border-red-400');
                    Swal.fire({
                        title: "Succesfully Login!",
                        text: "Welcome!",
                        icon: "success"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          window.location.href = data.location;
                        }
                      });
                }else{ 
                    password.classList.add('border-red-400');
                    password.value = '';
                    $('#passerr').innerHTML = data.success;
                }
            } else {
                console.log('No data returned from the backend');
            }
        })
        .catch(error => {
            console.log('error fecthing signin');
        });
    
    });
}

const signup = $('#signup')[0];  // Ensure you get the DOM element, not a jQuery object
if (signup) {
  signup.addEventListener('click', (e) => {
    e.preventDefault();
    const username = $('#username').val();  // Use .val() for jQuery
    const email = $('#email').val();
    const password = $('#password').val();

    // Check if any field is empty
    if (!username || !email || !password) {
      Swal.fire({
        title: 'Signup Failed',
        text: 'All fields are required. Please fill out all fields.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;  // Exit the function if any field is empty
    }

    const data = { username, email, password };

    // Send the data to the backend
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data) {
        console.log(data);
        if (data.success) {
          Swal.fire({
            title: 'Signup Successful!',
            text: 'You will be redirected shortly.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            if (data.redirect) {
              window.location.href = data.redirect;
            }
          });
        } else {
          Swal.fire({
            title: 'Signup Failed',
            text: data.message || 'An error occurred during signup. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } else {
        console.log('No data returned from the backend');
        Swal.fire({
          title: 'Signup Failed',
          text: 'No response from server. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    })
    .catch(error => {
      console.error('Error fetching signup:', error);
      Swal.fire({
        title: 'Signup Failed',
        text: 'An error occurred while trying to sign up. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  });
}



const confirm_appointment = $('#confirm_appointment');

if (confirm_appointment) {
    confirm_appointment.addEventListener('click', (e) => {
        e.preventDefault();

        const schedule_id = $('#boxID').innerHTML;
        const date = $('#dateInput').value;
        const fname = $('#firstname').value;
        const lname = $('#lastname').value;
        const childname = $('#childname').value;
        const contact = $('#contact').value;


        if (!schedule_id || !date || !fname || !lname || !childname || !contact) {
            Swal.fire({
                title: "Error",
                text: "All fields are required.",
                icon: "error",
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        const data = { schedule_id, date, fname, lname, childname, contact };

        Swal.fire({
            title: "Do you want to proceed?",
            text: 'Set Appointment',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Appointment Successfully!",
                    text: "Recorded",
                    icon: "success"
                });
                fetch('/dashboard/appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    // Handle success
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });
    });
}



/*
    schedule
*/
const view_appointment = $$('#view_appointment');
if (view_appointment) {
    view_appointment.forEach((view)=>{
        view.addEventListener('click', (e) => {
            e.preventDefault();
            const id = $('#boxID').innerHTML;
            
            fetch(`/dashboard/schedule/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => response.json())
            .then(data => {
                if(data){
                    $('#appnum').value = data.appointment_id;
                    $('#firstname').value = data.firstname;
                    $('#lastname').value = data.lastname;
                    $('#childname').value = data.childname;
                    $('#contact').value = data.contact;
                }
            })
            .catch(error => {
                console.log(error);
            });
    
        });
    })
}


const editinfo = $$('#editinfo');
if (editinfo) {
    editinfo.forEach(editinfo => {
        editinfo.addEventListener('click',(e)=>{
            e.preventDefault();
            const id = $('#boxID').innerHTML;
            const firstname = $('#firstname').value;
            const lastname = $('#lastname').value;
            const childname = $('#childname').value;
            const contact = $('#contact').value;
    
            const data = { firstname,lastname,childname,contact };
        
                Swal.fire({
                      title: "Edited Successfully!",
                      text: "Recorded",
                      icon: "success"
                });
                fetch(`/dashboard/schedule/${id}/edit`,{
                    method: 'PUT',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
    
                })
                .catch(error => {
                    console.log(error);
                })
                       
            
        });
    })
}

const cancel = $$('#delapp');
if (cancel) {
    cancel.forEach(cancel => {
        cancel.addEventListener('click',(e)=>{
            e.preventDefault();
            const id = $('#boxID').innerHTML;
            Swal.fire({
                title: "Do you want to proceed?",
                text: 'Cancel Appointment',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                      title: "Successfully Canceled!",
                      text: "Recorded",
                      icon: "success"
                });
                fetch(`/dashboard/schedule/${id}/cancel`,{
                    method: 'PUT'
                })
                .then(response => response.json())
                .then(data => {
                })
                .catch(error => {
                    console.log(error);
                });
                }
            })

            
    
        });
    })
}
/*
    END  schedule
*/

/*
    START  
*/
const view_history = $$('#view_history');
if (view_history) {
    view_history.forEach((view)=>{
        view.addEventListener('click', (e) => {
            e.preventDefault();
            const id = $('#boxID').innerHTML;
            
            fetch(`/dashboard/schedule/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => response.json())
            .then(data => {
                if(data){
                    $('#appnum').value = data.appointment_id;
                    $('#firstname').value = data.firstname;
                    $('#lastname').value = data.lastname;
                    $('#childname').value = data.childname;
                    $('#contact').value = data.contact;
                }
            })
            .catch(error => {
                console.log(error);
            });
    
        });
    })
}

function deleteHistory(id){
    Swal.fire({
          title: "Do you want to proceed?",
          text: 'Delete History',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
      }).then((result) => {

        fetch(`/dashboard/history/${id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            if(result.isConfirmed && data.success === 'true'){
                Swal.fire({
                   title: "Deleted Successfully!",
                   text: "Recorded",
                   icon: "success"
                });
                
              }
        })
        .catch(error => {
            console.log(error);
        });
          
      })
  }

/*
    END
*/

/*
    START  
*/

const view_prescription = $$('#view_prescription');
if (view_prescription) {
    view_prescription.forEach((view)=>{
        view.addEventListener('click', (e) => {
            e.preventDefault();
            const id = $('#boxID').innerHTML;

            fetch(`/dashboard/prescription/${id}`, {
                method: 'PUT'
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    console.log(data.msg)
                    $('#msg').innerHTML = data.msg;
                }
            })
            .catch(error => {
                console.log(error);
            });
        });
    });
}

/*
    END  
*/

/*
START
*/
const uploadimg = $('#updateInfo');
if(uploadimg){
    uploadimg.addEventListener('click', (e) => {
        e.preventDefault();
        const img = $('#image');
        const formData = new FormData();
        formData.append('firstname',$('#fname').value);
        formData.append('lastname',$('#lname').value);
        formData.append('email',$('#eml').value);
        formData.append('address',$('#addr').value);
        formData.append('contact',$('#cont').value);
        formData.append('image', img.files[0]);

        fetch('/dashboard/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
                
        })
        .catch(error => {
            console.log(error);
        });

    });
}
/*
END
*/

/*
START
*/

const send = $('#emailsend');
if(send){
    send.addEventListener('click', (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email',$('#email').value);
        formData.append('subject',$('#subject').value);
        formData.append('message',$('#msg').value);
        console.log(formData);
        fetch('/home',{
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {})
        .catch(error =>{
            console.log(error);
        })
    });
}
/*
END
*/

/*
START
*/
const view_appointmentToday = $$('#view_appointmentToday');
if(view_appointmentToday){
    view_appointmentToday.forEach(view => {
        view.addEventListener('click', (e) => {
            e.preventDefault();
            const id = $('boxID').innerHTML;

            fetch('/dashboard/main/${id}',{
                method: "PUT"
            })
            .then(response => response.json())
            .then(data => {})
            .catch(error =>{
                console.log(error);
            });
        });
    });
}
/*
END
*/

/*
START
*/
// const prescription_changeInput = $('#dateInput');
// if(prescription_changeInput){
//     prescription_changeInput.addEventListener('change', (e) => {
//         const inputDate = prescription_changeInput.value;
//         console.log(inputDate);
        
//         fetch('/dashboard/prescription/change',{
//             method: "POST",
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ inputDate })
//         })
//         .then(response => response.json())
//         .then(date => {
//         })
//         .catch(error =>{
//             console.log(error);
//         });
//     });
// }