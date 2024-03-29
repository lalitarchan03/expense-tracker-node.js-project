const form = document.getElementById('signup-form');
form.addEventListener('submit', addUser);

function addUser(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const email= e.target.email.value;
    const password = e.target.password.value;
    const cnfPassword = e.target.cnfpassword.value;
    // console.log(name, email, password, cnfPassword);

    if (password === cnfPassword) {
        const userDetail = {
            name,
            email,
            password
        }
        console.log(userDetail);

        axios.post("http://localhost:3000/user/add-user", userDetail)
        .then(res => {
            form.reset();
            // console.log(res.data);
            alert(res.data.msg);
            window.location.href = '../login/login.html'
        })
        .catch(err => {
            form.reset();
            alert(err.response.data.msg);
            console.log(err)
        })
    }
    else{
        console.log('Error: password is wrong')
    }
    // form.reset();
}
