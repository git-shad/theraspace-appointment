const signup = $('#signup');
if (signup) {
    signup.addEventListener('click', (e) => {
        e.preventDefault();
        const username = $('#username').value;
        const email = $('#email').value;
        const password = $('#password').value;

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
                if (data.redirect) {
                    Swal.fire({
                        title: 'Signup Successful!',
                        text: 'You will be redirected shortly.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = data.redirect;
                    });
                } else {
                    Swal.fire({
                        title: 'Signup Successful!',
                        text: 'Your account has been created.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                console.log('No data returned from the backend');
            }
        })
        .catch(error => {
            console.log('error fetching signup');
            Swal.fire({
                title: 'Error!',
                text: 'There was an issue with the signup process.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    });
}
