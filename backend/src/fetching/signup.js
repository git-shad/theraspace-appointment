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
        
            }
        })
        .catch(error => {
            console.log('error fecthing signup');
        });
    
    });
}