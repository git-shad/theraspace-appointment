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