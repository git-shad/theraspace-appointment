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
        // Perform logout action here, e.g., redirect to logout page
        window.location.href = 'logout';
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
                          window.location.href = '/dashboard/appointments';
                        }
                      });
                }else{ 
                    password.classList.add('border-red-400');
                    password.value = '';
                    $('#passerr').innerHTML = data.success;
                }
                
                // Do something with the response data
            } else {
                console.log('No data returned from the backend');
                // Handle the case where no data is returned
            }
        })
        .catch(error => {
            console.log('error fecthing signin');
        });
    
    });
}

const signup = $('#signup');
if(signup){
    signup.addEventListener('click',(e)=>{
        e.preventDefault();
        const username = $('#username').value;
        const email = $('#email').value;
        const password = $('#password').value;
    
        const data = {username, email, password};
        
        // Send the data to the backend
        fetch('/signup',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if(data){
                console.log(data);
                if(data.redirect){
                    window.location.href = data.redirect;
                }                
                // Do something with the response data
            } else {
                console.log('No data returned from the backend');
                // Handle the case where no data is returned
            }
        })
        .catch(error => {
            console.log('error fecthing signup');
        });
    
    });
}

const confirm_appointment = $('#confirm_appointment');
if(confirm_appointment){
    confirm_appointment.addEventListener('click',(e)=>{
        e.preventDefault();
        
        const schedule_id = $('#boxID').innerHTML;
        const date = $('#dateInput').value;
        const fname = $('#firstname').value;
        const lname = $('#lastname').value;
        const childname = $('#childname').value;
        const contact = $('#contact').value;

        const data = {schedule_id,date,fname,lname,childname,contact};

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
            fetch('/dashboard/appointments',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                    },
                body:JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
    
            }).catch(error =>{
                console.log(error);
            });
            }//end if
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
            console.log('nako');

            fetch(`/dashboard/schedule/${id}/delete`,{
                method: 'PUT'
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = '/dashboard/schedule';
            })
            .catch(error => {
                console.log(error);
            });
    
        });
    })
}
/*
    END  schedule
*/