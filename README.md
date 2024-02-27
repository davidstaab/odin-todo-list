# Project: To-do List
This is a learning project assigned by [The Odin Project](https://www.theodinproject.com/), which is a self-driven bootcamp for front-end developer skills. The To-do List project (found [here](https://www.theodinproject.com/lessons/node-path-javascript-todo-list)) asks the learner to develop a web app that manages task lists. Several features are specificed, including the ability to manage multiple lists, the ability to sort tasks and lists, and the ability to save and retrieve data using the browser's local storage.

## Learning Objectives
I set out to use this project for improving my software architecture skill in Javascript. As such, I focused on the quality of my JS code more than the quality of my design and CSS code. The app has a simple design with no fancy features or branding.

On the other hand, the JS is designed with scalability, modularity, and testability in mind.

* I organized the application into modules and module libraries, minimizing the "interface surface area" that modules exposed to one another.
* I used ES6 classes to implement clean data interfaces between pieces of code, as well as to encapsulate state and behavior into coherent units of logic.
    * Initially, I worked with factory functions instead of classes because they're "more pure" implementations of JS object oriented programming. But the main benefit of being able to control the public interface of an object using closures was made unnecessary by ES6 modules. The modules were already defining which functions and objects were public (exported) to other modules. Moreover, it wasn't possible to create an enumeration type using factory functions; I had to use an ES6 class for that. So I decided to just go with the flow and use classes everywhere.
* I architected the app using [Model-View-Presenter](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter) architecture. This helped me to avoid tightly coupling the model and view layers. It also helped me to think about how the model and view had to be orchestrated in order to present the app to the user.
    * I didn't develop tests for this very small app, but if I would, testing the model would be much easier with MVP than without. I could also test the presenter by swapping out the view module with one that doesn't rely on browser APIs.

## Missing Features
Because this is a "school project" in the middle of the curriculum, I'm not going to spend too much time polishing it. My main learning objectives have been achieved. Here are features that I might finish implementing someday:

* There's no UI for sorting the to-do items. I implemented the sorting logic in the Model, but I haven't yet rigged it up to the View.
* Input values aren't being validated. It's entirely possible to create situations that throw uncaught exceptions. I should add validation logic to the View/Presenter that protects the Model from pollution, and protects the View from getting into unhappy states.
* The app auto-saves itself on every model data change. I should really use a "debounce" or "timeout" pattern that watches for a series of change callbacks and then takes one save action at the end of them. Some kind of timeout mechanism will have to be used.
* All the deadline dates are bold red text. That should only be true for those within a certain proximity to Date.now(). I should define a CSS class for that style and apply it dynamically when creating the .item-card.
* Despite my best effort at using an enumeration class for priority values, I was forced at various points to reduce it to numbers and strings. This creates tight coupling among all the pieces of code using those string and number values. How can I really decouple them? Maybe the enum just isn't a clean, native part of Javascript...

## Notes to Self
Just some miscellaneous notes and reminders for when I come back to this project later...

* [This](https://gist.github.com/cobyism/4730490) is how I configured the Github Pages site.