const form = document.getElementById('login-form');

form.addEventListener('submit', userLogin);

function userLogin(e) {
    e.preventDefault();
    const email= e.target.email.value;
    const password = e.target.password.value;
    const userDetail = {
        email,
        password
    }
    // console.log(userDetail);

    axios.post("http://localhost:3000/user/login", userDetail)
        .then(res => {
            form.reset();
            alert(res.data.msg);
            localStorage.setItem('token', res.data.token);
            window.location.href = '../expenses/expense.html'
            console.log(res.data)
        })
        .catch(err => {
            form.reset();
            console.log(err);
        });
};

