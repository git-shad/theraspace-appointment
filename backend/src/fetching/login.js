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
