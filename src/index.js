// Webpack imports
import 'normalize.css'; // npm module, not a file
import './index.css';

import * as todo from './todo/todo.js';
import * as dateFns from 'date-fns';


let item = new todo.TodoItem({
    title: 'Hello World',
    deadline: Date('09-25-1981'),
    priority: todo.Priority.normal,
    note: 'This is the note. It is kind of long.',
});

console.dir(item);
console.log(item.formatDeadline());