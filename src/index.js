'use strict'

// Webpack imports
import 'normalize.css'; // npm module, not a file
import './index.css';

import { PriorityEnum, TodoItem} from './todo/todo.js';
import { TodoList } from './todo-list/todo-list.js';
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

let list = new TodoList([item1, item2]);

list.sortTitleAsc();
console.dir(list);
console.dir(list.sortDeadlineAsc().items);
console.dir(list.sortPriorityAsc().items);
console.dir(list.sortPriorityDesc().items);