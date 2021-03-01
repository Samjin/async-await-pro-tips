import fetch from 'node-fetch';

const promise = fetch('https://jsonplaceholder.typicode.com/todoss/1');

promise
  .then(res => res.json()) //must json it
  .then(todo => {
    throw new Error('uh oh');
    return todo; //won't run
  })
  .then(todo => console.log('😛', todo.title))
  .catch(err => console.error('😭', err));

console.log('🥪 Synchronous'); //this runs first

