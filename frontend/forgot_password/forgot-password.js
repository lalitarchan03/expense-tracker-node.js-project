const forgotPasswordForm = document.getElementById("forgot-password-form");
forgotPasswordForm.addEventListener('submit', getPassword);

function getPassword(e) {
     e.preventDefault();
     const email = e.target.email.value;
     userCredential = {email };
    //  console.log(email);
    axios.post("http://localhost:3000/password/forgotpassword", userCredential)
        .then(res => {
            console.log(res.data);
            forgotPasswordForm.reset();
        })
        .catch(err => {
            console.log(err);
        });
}