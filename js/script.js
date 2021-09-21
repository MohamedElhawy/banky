// activate strict mode
"use strict";



// capturing dom elements
const transactionLog = document.getElementById("transactionLog");
const balanceValue = document.getElementById("balanceValue");
const transIn = document.getElementById("transIn");
const transOut = document.getElementById("transOut");
const transInterest = document.getElementById("transInterest");
const logInName = document.getElementById("logInName");
const logInPass = document.getElementById("logInPass");
const logInBtn = document.getElementById("logInBtn");
const headerText = document.getElementById("headerText");
const main = document.getElementById("main");
const transferTo = document.getElementById("transferTo");
const transferAmount = document.getElementById("transferAmount");
const transferBtn = document.getElementById("transferBtn");
const confirmUser = document.getElementById("confirmUser");
const confirmPIN = document.getElementById("confirmPIN");
const confirmBtn = document.getElementById("confirmBtn");
const loadAmount = document.getElementById("loadAmount");
const loanBtn = document.getElementById("loanBtn");
const sortBtn = document.getElementById("sortBtn");
const sortArrow = document.getElementById("sortArrow");


// Global variables
let activeAccount;
let sortIndex = true;



// Data
const account1 = 
{
    owner : "Mohamed Elhawy",
    Movement : [200 , 450 , -400 , 3000 , -650 , -130 , 70 , 1300],
    interestRate : 1.2,
    pin : 1111
};

const account2 = 
{
    owner : "Sara Elhawy",
    Movement : [5000 , 3400 , -150 , -790 , -3210 , -1000 , 8500 , -30],
    interestRate : 1.5,
    pin : 2222
};

const account3 = 
{
    owner : "Ahmed Elhawy",
    Movement : [200 , -200 , 340 , -300 , -20 , 50 , 400 , -460],
    interestRate : 0.7,
    pin : 3333
};

const account4 = 
{
    owner : "naruto uzumaki",
    Movement : [430 , 1000 , 700 , 50 , 90],
    interestRate : 1,
    pin : 4444
};

const accounts = [account1, account2, account3, account4];  




//  -------------------     app     ---------------------------  //




// movements (transaction log) inserting

function insertingLogData (movements , sort=false)
{

    // clean the container first
    transactionLog.innerHTML = "";

    let movs = [...movements];
    // sorting direction
    if ( sort )
    {
        movs = movs.sort( (a , b) => a - b);
        sortIndex = false;
    }
    else
    {
        movs = movements;
        sortIndex = true;
    }


    for ( let i = 0 ; i < movs.length ; i++)
    {
        // to control the color of the state
        let checkStatus = movs[i] > 0 ? "" : "withdrawal";

        // log element
        const logEl = 
        `
        <div class="transactionLog-entry">
            <div class="entry-head">
                <div class="entry-states ${checkStatus}">${i+1} ${movs[i] > 0 ? "DEPOSIT" : "WITHDRAWAL"}</div>
                <div class="entry-date">TODAY</div>
            </div>
            <div class="entry-amount">${movs[i] + "€"}</div>
        </div>
        `;

        // insert log elements to DOM
        transactionLog.insertAdjacentHTML("afterbegin" , logEl);

    }

}


// creating a new propertie for users object

function createUserNameProp (users)
{

    users.forEach( generateUserName );
        
        
    function generateUserName (el)
    {
        let user = el;

        let hisName = user.owner;
    
        let userName = hisName.toLowerCase().split(" ").map( function (el) { return el[0]}).join("");

        user.userName = userName;
    }

}

createUserNameProp(accounts);



// calculate balance

function calculateBalance (account)
{

    let totalBalance = account.Movement.reduce( function (value , item) { return value + item} , 0);

    activeAccount.balance = totalBalance;

    balanceValue.textContent = totalBalance + "€";
}



// calculate transaction status

function calculateTransInOutInterest (trans)
{
    // in
    let transInput = trans.Movement.filter( el => el > 0 ).reduce( (acc,el) => acc + el , 0);
    transIn.textContent = transInput + "€";

    // out
    let transOutput = trans.Movement.filter( el => el < 0 ).reduce( (acc,el) => acc + el , 0);
    transOutput = Math.abs(transOutput);
    transOut.textContent = transOutput + "€";

    // interest
    let transInt = trans.Movement.filter( el => el > 0 ).map( el => (el * trans.interestRate) / 100 ).filter( el => el >= 1 ).reduce( (acc,el) => acc + el , 0);
    transInterest.textContent = transInt + "€";

}



// loggin in 
function signingIn (e)
{
    // prevent default event of form submittion
    e.preventDefault();

    // getting the activeAccount 
    let account = accounts.find( el => (el.userName === logInName.value.trim() && el.pin === Math.trunc(Number(logInPass.value)) ));



    if (account)
    {

        // assign active account
        activeAccount = account;


        // clear the input fields

        logInName.value = "";
        logInPass.value = "";

        // make the button loses focus after signing in

        logInPass.blur();     // from signing in by enter key
        logInBtn.blur();      // from signing in by a mouse click


        // change the header text to a welcoming text for specific user

        headerText.textContent = "Welcome back, " + activeAccount.owner.split(" ")[0];


        // update UI
        updateUI(activeAccount);



        // show the main (bank account panela fter it was fully loaded with user data)
        main.style.opacity = "1";

    }
    else
    {
        alert("⛔ Wrong password or User name, Please try again! ⛔");
    }

}


logInBtn.addEventListener("click" , signingIn);


// transfer money
function transferingMoney (e)
{
    // prevent default event
    e.preventDefault();

    // getting input values
    let reciever = transferTo.value;

    let transmittedAmount = Number(transferAmount.value);

    let recieverObject;

    if ( accounts.find( el => el.userName === reciever ) )
    {
        recieverObject = accounts.find( el => el.userName === reciever );
    }
    else 
    {
        alert("⚠ account not found 404 ⚠");
    }


    // validate inputs values
    if ( transmittedAmount > 0 && transmittedAmount <= activeAccount.balance && recieverObject && activeAccount.userName != recieverObject.userName)
    {
        activeAccount.Movement.push(-transmittedAmount);
        recieverObject.Movement.push(transmittedAmount);
        transferTo.value = "";
        transferAmount.value = "";
    }
    else
    {
        alert("⛔ transfer invalied! ⛔");
    }

    // update UI
    updateUI(activeAccount);

}


transferBtn.addEventListener("click" , transferingMoney);






// update UI

function updateUI (account)
{
    insertingLogData(account.Movement);

    calculateBalance(account);

    calculateTransInOutInterest(account);
}



// close an account

function closingAccount (e)
{

    // prevent default event
    e.preventDefault();

    // validate input 
    let accountName = confirmUser.value;
    let accountPin = Number(confirmPIN.value);

    if ( accountName === activeAccount.userName && accountPin === activeAccount.pin )
    {
        // find the index of the account to be deleted (active account)
        let accountIndex = accounts.findIndex( el => el.userName === activeAccount.userName );

        // delete the account
        accounts.splice(accountIndex , 1);

        // hide the app body (main)
        main.style.opacity = "0";

        // cleaning 
        confirmUser.value = confirmPIN.value = "";
        headerText.textContent = "Log in to get started";

    }
    else
    {
        alert("⚠ Wrong user name or Password! ⚠");
    }


}


confirmBtn.addEventListener("click" , closingAccount );






// getting a load

function requistingLoad (e)
{
    e.preventDefault();

    let amount = Number(loadAmount.value);

    if ( amount > 0  && activeAccount.Movement.some( el => el >= amount * 0.1 ) )
    {
        activeAccount.Movement.push(amount);

        // update UI
        updateUI(activeAccount);

        // clean
        loadAmount.value = "";
    }
    else
    {
        alert("☹ Unfortionatly, we cannot loan you the amount requisted, since you didn't deposite enough income. ☹");
    }


}


loanBtn.addEventListener("click" , requistingLoad);






// sort button
function sortingLog ()
{
    insertingLogData(activeAccount.Movement , sortIndex);
    if ( !sortArrow.classList.contains("sortRotate") )
    {
        sortArrow.classList.add("sortRotate");
    }
    else
    {
        sortArrow.classList.remove("sortRotate");
    }

}



sortBtn.addEventListener ("click" , sortingLog);



// test

const dogs = [
    {weight: 22 , curFood: 250,owners: ['Alice' , 'Bob']},
    {weight: 8 , curFood: 200,owners: ['Matilda']},
    {weight: 13 , curFood: 275,owners: ['Sarah' , 'John']},
    {weight: 32 , curFood: 340,owners: ['Michael']}
];


// 1

dogs.forEach(

    function (el)
    {
        el.recommendedFood = el.weight ** 0.75 * 28;
    }

);

console.log(dogs);



// 2

let sarahDog = dogs.find( 
    function (e)
    {
        return e.owners.includes("Sarah");
    }
);

if ( sarahDog.recommendedFood < (sarahDog.curFood) )
{
    console.log("Too Much");
}
else if ( sarahDog.recommendedFood > (sarahDog.curFood) )
{
    console.log("Too little");
}



// 3

let ownersEatTooMuch = [];
let ownersEatTooLittle = [];

let dogsEatTooMuch = dogs.filter( (el) => { return el.curFood > el.recommendedFood } );
let dogsEatTooLittle = dogs.filter( (el) => { return el.curFood < el.recommendedFood } );


ownersEatTooMuch = dogsEatTooMuch.map( (el) => { return el.owners} ).flat();
ownersEatTooLittle = dogsEatTooLittle.map( (el) => { return el.owners} ).flat();

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 4

let stringOwnserEatTooMuch = ownersEatTooMuch.join(" and ");
console.log(`${stringOwnserEatTooMuch}'s dogs eat too much!`);

let stringOwnserEatTooLittle = ownersEatTooLittle.join(" and ");
console.log(`${stringOwnserEatTooLittle}'s dogs eat too Little!`);


// 5


let dogOkayAmount = dogs.some( (dog) => {return dog.curFood === dog.recommendedFood } );

console.log(dogOkayAmount);



// 6

let dogExactAmount = dogs.some( (dog) => {return dog.curFood >= (dog.recommendedFood * 0.9) && dog.curFood <= (dog.recommendedFood * 1.1) } );

console.log(dogExactAmount);



// 7

let dogsEatingOkayAmount = dogs.filter( (dog) => { return ( dog.curFood >= (dog.recommendedFood * 0.9) && dog.curFood <= (dog.recommendedFood * 1.1) )  } );
console.log(dogsEatingOkayAmount);

// 8

let dogs2_0 = [...dogs].sort( (a , b) => {return a.recommendedFood - b.recommendedFood } );
console.log(dogs2_0);