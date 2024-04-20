const updatePasswordForm = document.getElementById("reset-password-form");

updatePasswordForm.addEventListener('submit', updatePasswordReq);

console.log("In reset password form" );

function updatePasswordReq(e) {
    e.preventDefault();
    const password1 = e.target.new_password1.value;
    const password2 = e.target.new_password2.value;

    const urlParams = new URLSearchParams(window.location.search);

    // Retrieve reset password request id
    const id = urlParams.get('id');
    console.log(id);

    const responseMsg = document.getElementById("msg");

    if (password1 === password2 && id) {

        const updateData = {password1 , id};
        console.log(updateData);

        axios.post('http://localhost:3000/password/updatepassword', updateData)

        // if(sendingNewPassword) {
        //     console.log(sendingNewPassword.response.data);
        //     responseMsg.innerHTML = sendingNewPassword;
        //     return;
        // }
        // responseMsg.innerHTML = res.data.message;
        // return;
        .then(res => {
            if(res.data.success) {
                console.log(res.data);
                responseMsg.innerHTML = res.data.msg;
                updatePasswordForm.reset();
                return;
            }
            responseMsg.innerHTML = res.data.message;
            updatePasswordForm.reset();
            return;
        })
        .catch(err => {
            // console.log(err);
            responseMsg.innerHTML = err.response.data.message;
            console.log(err);
        })
    }
    else{
        responseMsg.innerHTML = "Passwords do not match";
        setTimeout(() => {
            responseMsg.innerHTML = "";
        }, 2000);
        return;
        
        // console.log('please write same password in both input')
    }
}