'use strict'

// Webpack imports
import 'normalize.css'; // npm module, not a file
import './index.css';

import { PriorityEnum, TodoItem} from './todo/todo.js';
import TodoList from './todo-list/todo-list.js';
import ListList from './list-list/list-list.js';
import * as dateFns from 'date-fns';


let item1 = new TodoItem({
    title: 'Hello World',
    deadline: new Date('09-25-1981'),
    priority: PriorityEnum.normal,
    note: 'This is the note. It is kind of long.',
});

let item2 = new TodoItem({
    title: 'Allo World',
    deadline: new Date('09-25-2024'),
    priority: PriorityEnum.high,
    note: 'This is the note. It is kind of long.',
});

let item3 = new TodoItem({
    title: 'Goodbye World',
    deadline: new Date('06-01-2030'),
});

let listA = new TodoList('first', [item1, item2]);
let listB = new TodoList('second', [item3]);

let listOfLists = new ListList([listA, listB]);
listOfLists.remove('first');
console.dir(listOfLists);
