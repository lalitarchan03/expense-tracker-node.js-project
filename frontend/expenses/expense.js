
const token = localStorage.getItem('token');

const form = document.getElementById('my-form');
form.addEventListener('submit', addExpense);

const buyPremiumBtn = document.getElementById('rzr-buyPremium');

buyPremiumBtn.onclick = async function (e) {
    const response = await axios.get('http://localhost:3000/purchase/premium-membership', {headers: {Authorization: token}});
    console.log(response);

    var options = {
        "key": response.data.key_id,
        "orderId": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post('http://localhost:3000/purchase/update-transaction-status', {
                        orderId: options.orderId,
                        paymentId: response.razorpay_payment_id
                        }, {headers: {Authorization: token}} )

            alert('Congratulations! You are a Premium Member Now');
            buyPremiumBtn.disabled = true;
            buyPremiumBtn.textContent = 'Premium Member';

            const navbar = document.getElementById('navbar');
            const leaderboardBtn = document.createElement('button');
            leaderboardBtn.textContent = 'Leaderboard';
            leaderboardBtn.classList.add('leaderboardBtn');
            navbar.appendChild(leaderboardBtn);
            leaderboardBtn.addEventListener('click', getLeaderboard)

            console.log('token changed', res.data.token);
            localStorage.setItem('token', res.data.token);
        } 
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response);
        alert("Something went wrong")
    });
};

function getLeaderboard(e) {
    e.preventDefault();
    axios.get("http://localhost:3000/premium/showLeaderboard", {headers: {Authorization: token}})
        .then(res => {
            console.log(res.data);
            for (let i=0; i < res.data.length; i++) {
                // console.log('GET', res.data.allUserDetail[i]);
                showLeaderboard(res.data[i]);
            }
        })
        .catch(err => {
            console.log(err)
        })
}

// function to run on submitting the form
function addExpense(e) {

    e.preventDefault();

    const amount = e.target.amount.value;
    const description = e.target.disc.value;
    const category = e.target.categ.value;
    // console.log(token);

    const expenseDetails = {
        amount,
        description,
        category,
    };

    axios.post("http://localhost:3000/expense/add-expense", expenseDetails, {headers: {Authorization: token}})
        .then(res => {
            form.reset();
            showDetailsOnScreen(res.data.newExpenseDetail)

        })
        .catch(err => {
            console.log(err)
        })
    
};


// showing data on screen 
function showDetailsOnScreen(newExpenseDetail) {
    
    // console.log("RESPONSE" ,newExpenseDetail);
    const parentList = document.getElementById('items');
    const newListItem = document.createElement('li');
    newListItem.appendChild(document.createTextNode('Amount: ' + newExpenseDetail.amount + ', ' + 'Description: ' + newExpenseDetail.description + ', ' + 'Category: ' + newExpenseDetail.category ))
    parentList.appendChild(newListItem);

    // delete button 
    const delbtn = document.createElement('button');
    delbtn.className = 'delete';
    delbtn.innerText = 'X'

    delbtn.onclick = () => {

        let expenseId = newExpenseDetail.id;
        let expenseAmount = newExpenseDetail.amount;
        console.log(expenseAmount);
        axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}/${expenseAmount}`, {headers: {Authorization: token}})
        .then(res => {
            // console.log("NODETODELETE", newListItem);
            parentList.removeChild(newListItem);
            // console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        });
        
    };

    newListItem.appendChild(delbtn);
};

function showLeaderboard(leaderboardDetails) {
    const parentList = document.getElementById('top');
    const newListItem = document.createElement('li');
    newListItem.appendChild(document.createTextNode(`Name: ${leaderboardDetails.name}, Total Expense: ${leaderboardDetails.total_expense_amount}`));
    parentList.appendChild(newListItem);
}

function showIfpremiumUser() {
    buyPremiumBtn.disabled = true;
    buyPremiumBtn.textContent = 'Premium Member';

    const navbar = document.getElementById('navbar');
    const leaderboardBtn = document.createElement('button');
    leaderboardBtn.textContent = 'Leaderboard';
    leaderboardBtn.classList.add('leaderboardBtn');
    navbar.appendChild(leaderboardBtn);
    leaderboardBtn.addEventListener('click', getLeaderboard)
}

function parseJwt (token) {
    return JSON.parse(atob(token.split('.')[1]));
}


const getAllExpenses = () => {

    const token = localStorage.getItem('token');
    const jwtPayload = parseJwt(token);
    console.log(jwtPayload);
    const isPremiumUser = jwtPayload.isPremiumUser;
    if (isPremiumUser) {
        showIfpremiumUser();
    };

    axios.get("http://localhost:3000/expense/get-expense", {headers: {Authorization: token}} )
        .then((res) => {
            for (let i=0; i < res.data.allExpenseDetail.length; i++) {
                // console.log('GET', res.data.allUserDetail[i]);
                showDetailsOnScreen(res.data.allExpenseDetail[i]);
            }
        })
        .catch((err) => {
            console.log(err);
        })
};
getAllExpenses();
