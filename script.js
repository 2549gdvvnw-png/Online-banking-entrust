'use strict';
const account1 = {
  owner: 'McKay Joan',
  address: '120-38 Nashville Blvd, Saint Albans, NY 11412',
  email: 'LIONSCLUBFOUNDATIONS@GMAIL.COM',
  movements: [1500000, 350000],
  movementsDates: ['2026-09-08T10:15:00.000Z','2026-09-22T14:30:00.000Z'],
  movementsFrom: ['Grant - Global Hope Foundation','Grant - Unity Empowerment Company'],
  interestRate: 1.2, username: 'mckayjoan', password: 'Entrust2026', currency: 'USD', locale: 'en-US',
};
const account2 = {
  owner: 'Jessica Davis', movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5, username: 'jessicad', password: 'password2',
  movementsDates: ['2019-11-01T13:15:33.035Z','2019-11-30T09:48:16.867Z','2019-12-25T06:04:23.907Z','2020-01-25T14:18:46.235Z','2020-02-05T16:33:06.386Z','2020-04-10T14:43:26.374Z','2020-06-25T18:49:59.371Z','2020-07-26T12:01:20.894Z'],
  movementsFrom: [], currency: 'USD', locale: 'en-US',
};
const account3 = {
  owner: 'Steven Thomas Williams', movements: [200, -200, 340, -300, -20, 50, 400, 8063.21],
  interestRate: 0.7, username: 'stevenw', password: 'password3',
  movementsDates: ['2019-11-18T21:31:17.178Z','2019-12-23T07:42:02.383Z','2020-01-28T09:15:04.904Z','2020-04-01T10:17:24.185Z','2020-05-08T14:11:59.604Z','2020-05-27T17:01:17.194Z','2020-07-11T23:36:17.929Z','2020-07-12T10:51:36.790Z'],
  movementsFrom: [], currency: 'INR', locale: 'hi-IN',
};
const account4 = {
  owner: 'Sarah Smith', movements: [430, 1000, 700, 50, 90, -2000, 94732],
  interestRate: 1, username: 'sarahs', password: 'password4',
  movementsDates: ['2019-11-30T09:48:16.867Z','2019-12-25T06:04:23.907Z','2020-01-25T14:18:46.235Z','2020-02-05T16:33:06.386Z','2020-04-10T14:43:26.374Z','2020-06-25T18:49:59.371Z','2020-07-26T12:01:20.894Z'],
  movementsFrom: [], currency: 'JPY', locale: 'ja-JP',
};
const accounts = [account1, account2, account3, account4];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalances = document.querySelectorAll('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelProfileNames = document.querySelectorAll('.profile__name');
const labelProfileAddresses = document.querySelectorAll('.profile__address');
const labelProfileEmails = document.querySelectorAll('.profile__email');
const labelProfileUsers = document.querySelectorAll('.profile__user');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const loginSection = document.querySelector('#login-section');
const btnLogout = document.querySelector('.btn--logout');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPassword = document.querySelector('.login__input--password');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePassword = document.querySelector('.form__input--pin');

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};
const formatCurren = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(Number(value).toFixed(2));
};
const getExtTransfers = function () {
  try { return JSON.parse(localStorage.getItem('extTransfers') || '[]'); } catch { return []; }
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const ext = getExtTransfers();
  const extMovs = ext.map(t => ({ mov: t.amount, date: t.date, from: t.from }));
  let movs = [...acc.movements.map((mov, i) => ({ mov, date: acc.movementsDates[i], from: acc.movementsFrom?.[i] || '' })), ...extMovs];
  movs = movs.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sort) movs = movs.slice().sort((a, b) => a.mov - b.mov);
  movs.forEach(function (obj, i) {
    const type = obj.mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(obj.date);
    const displayDate = formatMovementDate(date, acc.locale);
    const sender = obj.from ? `<div style="font-size:1.1rem;color:#555;">${obj.from}</div>` : '';
    const html = `<div class="movements__row"><div class="movements__type movements__type--${type}">${i + 1} ${type}</div><div><div class="movements__date">${displayDate}</div>${sender}</div><div class="movements__value">${formatCurren(obj.mov, acc.locale, acc.currency)}</div></div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const displayBalance = function (acc) {
  const extTotal = getExtTransfers().reduce((sum, t) => sum + t.amount, 0);
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0) + extTotal;
  const formatted = formatCurren(acc.balance, acc.locale, acc.currency);
  labelBalances.forEach(el => (el.textContent = formatted));
};
const displayProfile = function (acc) {
  labelProfileNames.forEach(el => (el.textContent = acc.owner));
  labelProfileAddresses.forEach(el => (el.textContent = acc.address || '—'));
  labelProfileEmails.forEach(el => (el.textContent = acc.email || '—'));
  labelProfileUsers.forEach(el => (el.textContent = `@${acc.username}`));
};
const updateUI = function (acc) { displayMovements(acc); displayBalance(acc); calcDisplaySummary(acc); displayProfile(acc); };
const calcDisplaySummary = function (acc) {
  const ext = getExtTransfers();
  const allMovs = [...acc.movements, ...ext.map(t => t.amount)];
  const incomes = allMovs.filter(mov => mov > 0).reduce((a, m) => a + m, 0);
  labelSumIn.textContent = formatCurren(incomes, acc.locale, acc.currency);
  const outcomes = allMovs.filter(mov => mov < 0).reduce((a, m) => a + m, 0);
  labelSumOut.textContent = formatCurren(Math.abs(outcomes), acc.locale, acc.currency);
  const interest = acc.movements.filter(mov => mov > 0).map(mov => (mov * acc.interestRate) / 100).filter(int => int >= 1).reduce((a, int) => a + int, 0);
  labelSumInterest.textContent = formatCurren(interest, acc.locale, acc.currency);
};
const logOut = function (message = 'Log in to get started') {
  containerApp.style.opacity = 0; containerApp.style.pointerEvents = 'none';
  if (loginSection) loginSection.style.display = loginSection.classList.contains('bofa-hero') ? 'block' : 'flex';
  if (btnLogout) btnLogout.style.display = 'none';
  labelWelcome.textContent = message; labelWelcome.style.color = '';
  if (timer) clearInterval(timer); currAccount = undefined;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('.tab-btn[data-tab="accounts"]')?.classList.add('active');
  document.getElementById('tab-accounts')?.classList.add('active');
};
const startLogOutTim = function () {
  const tick = () => {
    const min = `${Math.floor(time / 60)}`.padStart(2, '0');
    const sec = `${time % 60}`.padStart(2, '0');
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) { clearInterval(timer); logOut('Session closed due to inactivity'); }
    time--;
  };
  let time = 300; tick(); const timer = setInterval(tick, 1000); return timer;
};
let currAccount, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const enteredUser = inputLoginUsername.value.toLowerCase().trim();
  const enteredPass = inputLoginPassword.value.trim();
  if (enteredUser.length < 5) { labelWelcome.textContent = 'Username must be at least 5 characters'; labelWelcome.style.color = 'red'; return; }
  if (enteredPass.length < 6) { labelWelcome.textContent = 'Password must be at least 6 characters'; labelWelcome.style.color = 'red'; return; }
  currAccount = accounts.find(acc => acc.username === enteredUser);
  const savedPass = localStorage.getItem(`${currAccount?.username}_newPassword`);
  if (currAccount && (currAccount.password === enteredPass || savedPass === enteredPass)) {
    labelWelcome.textContent = `Welcome back, ${currAccount.owner.split(' ')[0]}`; labelWelcome.style.color = '';
    if (loginSection) loginSection.style.display = 'none';
    containerApp.style.opacity = 1; containerApp.style.pointerEvents = 'auto';
    if (btnLogout) btnLogout.style.display = 'block';
    if (timer) clearInterval(timer); timer = startLogOutTim();
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'short' };
    labelDate.textContent = new Intl.DateTimeFormat(currAccount.locale, options).format(now);
    inputLoginUsername.value = inputLoginPassword.value = ''; inputLoginPassword.blur();
    updateUI(currAccount);
  } else {
    labelWelcome.textContent = 'Wrong username or password. Try mckayjoan / Entrust2026'; labelWelcome.style.color = 'red';
  }
});
btnLogout?.addEventListener('click', function () { logOut('Log in to get started'); });
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value.trim().toLowerCase());
  inputTransferAmount.value = inputTransferTo.value = '';
  if (amount > 0 && currAccount.balance >= amount && receiverAcc?.username !== currAccount.username && receiverAcc?.username) {
    currAccount.movements.push(-amount); receiverAcc.movements.push(amount);
    currAccount.movementsDates.push(new Date().toISOString()); receiverAcc.movementsDates.push(new Date().toISOString());
    currAccount.movementsFrom.push('Transfer'); receiverAcc.movementsFrom.push(`Transfer from ${currAccount.owner}`);
    updateUI(currAccount); clearInterval(timer); timer = startLogOutTim();
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && currAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () { currAccount.movements.push(amount); currAccount.movementsDates.push(new Date().toISOString()); currAccount.movementsFrom.push('Loan'); updateUI(currAccount); }, 700);
  }
  inputLoanAmount.value = ''; clearInterval(timer); timer = startLogOutTim();
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currAccount.username && inputClosePassword.value === currAccount.password) {
    const index = accounts.findIndex(acc => acc.username === currAccount.username);
    accounts.splice(index, 1); logOut('Account closed');
  }
  inputClosePassword.value = inputCloseUsername.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) { e.preventDefault(); displayMovements(currAccount, !sorted); sorted = !sorted; });
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
tabBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    tabBtns.forEach(b => b.classList.remove('active')); tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active'); document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
  });
});