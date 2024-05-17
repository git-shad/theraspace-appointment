function $($){
    return document.querySelector($);
}

function changeID(id){
    document.querySelector('#boxID').innerHTML = id;
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

const appointment = $('#confirm_appointment');
if(appointment){
    console.log('confirm_appointment hayss')
    appointment.addEventListener('click',(e)=>{
        e.preventDefault();
        const schedule_id = $('#boxID').innerHTML;
        const date = $('#dateInput').value;
        const fname = $('#firstname').value;
        const lname = $('#lastname').value;
        const select = $('#selectedChild').value;
        const contact = $('#contact').value;

        const data = {schedule_id,date,fname,lname,select,contact};
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
        })
    });
}