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
                if (data.error) {
                    // Handle specific error message for email already used
                    if (data.error === 'Email already in use') {
                        Swal.fire({
                            title: 'Error!',
                            text: 'The email address is already used. Please use a different email.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        // Handle other errors
                        Swal.fire({
                            title: 'Error!',
                            text: data.error,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                } else if (data.redirect) {
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
                        text: 'Your account has been created. You will be redirected to the login page.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = '/login'; // Assuming '/login' is the login page URL
                    });
                }
            } else {
                console.log('No data returned from the backend');
            }
        })
        .catch(error => {
            console.log('Error fetching signup');
            Swal.fire({
                title: 'Error!',
                text: 'There was an issue with the signup process.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    });
}
