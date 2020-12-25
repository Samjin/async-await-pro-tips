import { getFruit } from './3-async-await';

const fruits = ['peach', 'pineapple', 'strawberry'];

/* for of vs map
-------------------------------------------------------- */
//SEQUENTIAL
const fruitLoop = async () => {
  for (const f of fruits) {
    const emoji = await getFruit(f);
    log(emoji);
  }
};

//CONCURRENT 1
const fruitLoop = async () => {
  for await (const key of fruits) {
    const emoji = await getFruit(f);
    log(emoji);
  }
};

//CONCURRENT 2
const smoothie = fruits.map(async (el) => getFruit(el));
await Promise.all(smoothie);

