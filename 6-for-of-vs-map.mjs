import { getFruit } from './3-async-await';

const fruits = ['peach', 'pineapple', 'strawberry'];

/* for of vs map
-------------------------------------------------------- */
//sequential requests
const fruitLoop = async () => {
  for (const f of fruits) {
    const emoji = await getFruit(f);
    log(emoji);
  }
};

//concurrent
const fruitLoop = async () => {
  for await (const key of fruits) {
    const emoji = await getFruit(f);
    log(emoji);
  }
};

//concurrent
const smoothie = fruits.map(async (el) => getFruit(el));
await Promise.all(smoothie);

