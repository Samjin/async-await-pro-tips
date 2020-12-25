const tick = Date.now();
export const log = (v) => console.log(`${v} \n Elapsed: ${Date.now() - tick}ms`);

const fruits = ['peach', 'pineapple', 'strawberry'];

// Basic
export const getFruit = async name => {
  const fruits = {
    pineapple: '🍍',
    peach: '🍑',
    strawberry: '🍓'
  };
  await new Promise(resolve => setTimeout(resolve, 1000));
  return fruits[name];
};


(async () => {
  
  // fetch all the fruits IN PARALLEL
  const textPromises = await fruits.map(name => {
    return getFruit(name);
  });

  let res = await Promise.all(textPromises)
  console.info(res);
  
  // log them IN SEQUENCE
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }

})()


const makeConcurrentWithMap = async () => {
  const request = users.map(async(user) => {
    return fetch(user.name); //concurrent, don't need AWAIT since we want to return promise, also we don't have anything after fetch() for processing.
  });
  let all = await Promise.all(request);
  return all
}

const makeSmoothieFaster = async() => {
  const a = getFruit('pineapple');
  const b = getFruit('strawberry'); //don't need await a, b since they are both promises
  const smoothie = await Promise.all([a, b])
  return smoothie;
}


// const fruitRace = async() => {
//   const a = getFruit('pineapple');
//   const b = getFruit('strawberry');
  
//   const winner = await Promise.race([a, b])
  
//   return winner;
// }

fruitRace().then(log)
fruitRace().then(log)
fruitRace().then(log)
fruitRace().then(log)
fruitRace().then(log)
