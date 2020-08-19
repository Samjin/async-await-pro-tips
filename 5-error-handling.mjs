import { getFruit, log } from './3-async-await.mjs';



/* throw vs reject (try in browser)
-------------------------------------------------------- */
// Will catch trigger?
new Promise(function (resolve, reject) {
    setTimeout(() => {
        throw new Error("Whoops!"); //cannot caught in .catch() or try/catch since resolve or reject were not used.
        // reject(new Error("Whoops!")) //Should use reject() if it's in new Promise()
    }, 1000);
}).catch(console.info); // doesn't catch error since setTimeout is execute later and catch() triggers before that.

// Async allow exception to be captured in caller
async function thisThrows() {
    throw new Error("Thrown from thisThrows()");
}
thisThrows()
    .catch(console.error) // works
    .then(() => console.log('We do cleanup here')); // then is more like .finally()


/* Return vs Throw err
-------------------------------------------------------- */
const badSmoothie = async () => {
    try {
        const a = getFruit('pineapple')
        const b = getFruit('strawberry');
        return await Promise.all([a, b])
    } catch (err) {
        throw err; //.catch() and try/catch WILL get error in parent caller, because this is EXCEPTION
        return err; //.catch() and try/catch CAN'T get it in parent caller.
    }
}

// .catch() can get "throw exception", but not "return err".
badSmoothie().catch(err => err);

// For "return err" scenarios we should do following
let resp = badSmoothie();
if (resp) { //or status code !== 200 etc
    //do sth about it.
}


// /* Return await vs without
// https://javascript.info/async-await#:~:text=Async%20functions&text=The%20word%20%E2%80%9Casync%E2%80%9D%20before%20a,in%20a%20resolved%20promise%20automatically.&text=So%2C%20async%20ensures%20that%20the,wraps%20non%2Dpromises%20in%20it.
// -------------------------------------------------------- */
async function loadJson(name) { // (1)
    let response = await getFruit(name); // (2)
    if (response.status == 200) {
        // We can return response.json() instead of awaiting for it, like this:
        // return response.json(); // (3) parent function of loadJson don't need await keyword since here returns data than promise

        let json = await response.json(); // (3)
        return json;
    }
    throw new Error(response.status);
}

loadJson('no-such-user.json').catch(console.info); // Error: 404 (4) . catch() works here because .catch() can get async errors. 

try {
    loadJson('no-such-user.json')
} catch (error) {
    console.info(error);
}


Promise.all([
    new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
    new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
    new Promise(resolve => setTimeout(() => resolve(3), 1000))  // 3
]).then(alert); // 1,2,3 when promises are ready: each promise contributes an array member

// All or Nothing
// Promise.all rejects as a whole if any promise rejects. 
Promise.all([
    new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
    new Promise((resolve, reject) => setTimeout(() => reject(new Error("ALL or NOTHING")), 2000)),
    new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
])
    .then('only called if all are promises resolved successful')
    .catch(console.info); // Error: new error!

// However, Promise.all has no 'cancellation' to cancel rest of calls if one failed. 
// therefore, with AWAIT and ES6 destructing assignment, we can achieve something similar to Promise.allSettle() where one fails, but others still continue
(async () => {
    const [a, b] = await Promise.all([
        new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
        new Promise((resolve, reject) => setTimeout(() => reject(new Error("Async and await to achieve Promise.allSettled() result.")), 2000)).catch(console.info),
        new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
    ]);
    console.info([a, b]); // return 1 and undefined
})()


// Promise.allSettled just waits for all promises to settle, regardless of the result. The resulting array has:
// {status:"fulfilled", value:result} for successful responses,
// {status:"rejected", reason:error} for errors.
Promise.allSettled(
    new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
    new Promise((resolve, reject) => setTimeout(() => reject(new Error("ALLSETTLED TEST")), 2000)).catch(console.info),
    new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
)
.then((data) => {
    data.forEach((el, i) => {
        if (result.status == "fulfilled") {
            alert(`${urls[num]}: ${result.value.status}`);
        }
        if (result.status == "rejected") {
            alert(`${urls[num]}: ${result.reason}`);
        }
    })
})

/* Complete error handling for JS
https://www.valentinog.com/blog/error/
-------------------------------------------------------- */