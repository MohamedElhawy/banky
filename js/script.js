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
const currentBalanceDate = document.getElementById("currentBalanceDate");
const logOutTimer = document.getElementById("logOutTimer");



// Data
const account1 = 
{
    owner : "Mohamed Elhawy",
    Movement : [200 , 450 , -400 , 3000 , -650 , -130 , 70 , 1300],
    interestRate : 1.2,
    pin : 1111,
    movementsDates : [
        '2021-01-18T21:31:19.178Z',
        '2021-02-23T07:31:37.178Z',
        '2021-03-28T09:31:17.178Z',
        '2021-04-01T10:31:12.178Z',
        '2021-05-08T14:31:17.178Z',
        '2021-09-16T17:31:57.178Z',
        '2021-09-20T08:31:40.178Z',
        '2021-09-21T10:31:08.178Z'
    ],
    local: 'en-US',
    currency: "USD"
};

const account2 = 
{
    owner : "Sara Elhawy",
    Movement : [5000 , 3400 , -150 , -790 , -3210 , -1000 , 8500 , -30],
    interestRate : 1.5,
    pin : 2222,
    movementsDates : [
        '2019-11-01T13:15:33.178Z',
        '2019-11-30T09:48:12.448Z',
        '2019-12-25T06:04:17.178Z',
        '2020-01-25T14:31:16.178Z',
        '2020-02-05T16:34:35.178Z',
        '2020-03-10T14:22:17.178Z',
        '2020-06-25T18:54:43.178Z',
        '2020-07-26T12:43:45.178Z'
    ],
    local: 'ar-BH',
    currency: "BHD"
};

const account3 = 
{
    owner : "Ahmed Elhawy",
    Movement : [200 , -200 , 340 , -300 , -20 , 50 , 400 , -460],
    interestRate : 0.7,
    pin : 3333,
    movementsDates : [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:31:17.178Z',
        '2020-01-28T09:31:17.178Z',
        '2020-04-01T10:31:17.178Z',
        '2020-05-08T14:31:17.178Z',
        '2020-05-27T17:31:17.178Z',
        '2020-07-11T23:31:17.178Z',
        '2020-07-12T10:31:17.178Z'
    ],
    local: 'ru-RU',
    currency: "RUB"
};

const account4 = 
{
    owner : "naruto uzumaki",
    Movement : [430 , 1000 , 700 , 50 , 90],
    interestRate : 1,
    pin : 4444,
    movementsDates : [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:31:17.178Z',
        '2020-01-28T09:31:17.178Z',
        '2020-04-01T10:31:17.178Z',
        '2020-05-08T14:31:17.178Z',
        '2020-05-27T17:31:17.178Z',
        '2020-07-11T23:31:17.178Z',
        '2020-07-12T10:31:17.178Z'
    ],
    local: 'ja-JP',
    currency: "JPY"
};

const accounts = [account1, account2, account3, account4];  




//  -------------------     app     ---------------------------  //




// Global variables
let activeAccount;
let sortIndex = true;
let CurrentDate = new Date(Date.now());
let timer;






// localizing the time
function localizeTime (account , date)
{
    let local = account.local;
    let localOption = {
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric"
    };

    let IntlCurrentDate = new Intl.DateTimeFormat(local , localOption ).format(date);
    return IntlCurrentDate;
}


// localize the currency
function localizeCurrency (account , number)
{
    let currency = account.currency;

    let moneyOption = {
        style: "currency",
        currency: account.currency
    };

    let localizeMoney = new Intl.NumberFormat(account.local , moneyOption).format(number);

    return localizeMoney;
}




// movements (transaction log) inserting

function insertingLogData (account , sort=false)
{

    // clean the container first
    transactionLog.innerHTML = "";


    // sorting 
    let movs = [...account.Movement];

    if ( sort )
    {
        movs = movs.sort( (a , b) => a - b);
        sortIndex = false;
    }
    else
    {
        movs = account.Movement;
        sortIndex = true;
    }



    // inserting logs
    for ( let i = 0 ; i < movs.length ; i++)
    {

        // to control the color of the state
        let checkStatus = movs[i] > 0 ? "" : "withdrawal";


        // setting date
        let date = new Date(account.movementsDates[i]);

        let formatedLogDate = localizeTime(account , date) ;


        
        // display offset of the dates
        let todayDateInMS = Number(CurrentDate);
        let logDateInMS = Number(date);

        let timeDifferenceInDays = Math.trunc( (todayDateInMS - logDateInMS) / (1000 * 60 * 60 * 24)  ) ;
        // console.log(timeDifferenceInDays);
        
        let offsetDays;

        if ( timeDifferenceInDays === 0 )
        {
            offsetDays = "TODAY";
        }
        else if ( timeDifferenceInDays === 1 )
        {
            offsetDays = "YESTERDAY";
        }
        else if ( timeDifferenceInDays <= 7 )
        {
            offsetDays = `${timeDifferenceInDays} Days ago`;
        }
        else
        {
            offsetDays = "";
        }


        // localize money :D
        let moneyValurToLocal = localizeCurrency( account , movs[i]);


        // log element
        const logEl = 
        `
        <div class="transactionLog-entry">
            <div class="entry-head">
                <div class="entry-states ${checkStatus}">${i+1} ${movs[i] > 0 ? "DEPOSIT" : "WITHDRAWAL"}</div>
                <div class="entry-date">${formatedLogDate}</div>
                <span class="entry-offset">${offsetDays}<span>
            </div>
            <div class="entry-amount">${moneyValurToLocal}</div>
        </div>
        `;

        // insert log elements to DOM
        transactionLog.insertAdjacentHTML("afterbegin" , logEl);


        const entryOffset = document.querySelector(".entry-offset");

        if ( timeDifferenceInDays === 0 )
        {
            entryOffset.classList.add("offset-visible");
        }
        else if ( timeDifferenceInDays === 1 )
        {
            entryOffset.classList.add("offset-visible");
        }
        else if ( timeDifferenceInDays <= 7 )
        {
            entryOffset.classList.add("offset-visible");
        }
      


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

    balanceValue.textContent = localizeCurrency(account , totalBalance);
}



// calculate transaction status

function calculateTransInOutInterest (account)
{
    // in
    let transInput = account.Movement.filter( el => el > 0 ).reduce( (acc,el) => acc + el , 0);
    transIn.textContent = localizeCurrency(account , transInput);

    // out
    let transOutput = account.Movement.filter( el => el < 0 ).reduce( (acc,el) => acc + el , 0);
    transOutput = Math.abs(transOutput);
    transOut.textContent = localizeCurrency(account , transOutput);

    // interest
    let transInt = account.Movement.filter( el => el > 0 ).map( el => (el * account.interestRate) / 100 ).filter( el => el >= 1 ).reduce( (acc,el) => acc + el , 0);
    transInterest.textContent = localizeCurrency(account , transInt);

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

        // localize time
        currentBalanceDate.textContent = localizeTime(activeAccount , CurrentDate);



        // start logging out timer

        // check to prevent a previews timer still running
        if (timer) clearInterval(timer);
        // start timer
        timer = timerLoggingOut();


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
        activeAccount.movementsDates.push(new Date().toISOString());
        recieverObject.movementsDates.push(new Date().toISOString());
        transferTo.value = "";
        transferAmount.value = "";
    }
    else
    {
        alert("⛔ transfer invalied! ⛔");
    }

    // update UI
    updateUI(activeAccount);

    // reset timer
    clearInterval(timer);
    timer = timerLoggingOut();

}


transferBtn.addEventListener("click" , transferingMoney);





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





// getting a loan

function requistingLoad (e)
{
    e.preventDefault();

    let amount = Number(loadAmount.value);

    // validate input (amount)
    if ( amount > 0  && activeAccount.Movement.some( el => el >= amount * 0.1 ) )
    {
        setTimeout( function ()
        {

            activeAccount.Movement.push(amount);

            activeAccount.movementsDates.push(new Date().toISOString());
    
            // update UI
            updateUI(activeAccount);


        } , 2500);


        // clean
        loadAmount.value = "";
    }
    else
    {
        alert("☹ Unfortionatly, we cannot loan you the amount requisted, since you didn't deposite enough income. ☹");
    }

    // reset timer
    clearInterval(timer);
    timer = timerLoggingOut();


}


loanBtn.addEventListener("click" , requistingLoad);






// update UI

function updateUI (account)
{
    insertingLogData(account);

    calculateBalance(account);

    calculateTransInOutInterest(account);

}



// sort button
function sortingLog ()
{
    insertingLogData(activeAccount , sortIndex);
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



// logging user out timer
function timerLoggingOut ()
{

    let time = 5 * 60;  // seconds (5 minutes in seconds)

    let tick = function ()
    {

        let timeMinute = String(Math.trunc(time / 60)).padStart(2,0);
        let timeSecond = String(time % 60).padStart(2,0);

        logOutTimer.textContent = `${timeMinute}:${timeSecond}`;


        if ( time === 0 )
        {
            clearInterval(timer);
            headerText.textContent = "Log in to get started";
            main.style.opacity = "0";
        }


        time--;
    };


    let timer = setInterval(tick , 1000);

    return timer;

}