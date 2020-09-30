'use strict';

class TodoItem {

    constructor(text = "", id = 0, done = false, trash = false) {

        this.text = text;
        this.id = id;
        this.done = done;
        this.trash = trash;

        this.toggleDone = this.toggleDone.bind(this);
        this.setTrash = this.setTrash.bind(this);

    }

    toggleDone() {

        this.done = (this.done) ? false : true;

    }

    setTrash() {

        this.trash = true;
        
    }

}

class TodoList {

    constructor(itemsArray = []) {

        this.itemsArray = itemsArray;

    }

    get itemsArray() {

        return this._itemsArray;

    }

    set itemsArray(todoItemsArray) {

        this._itemsArray = todoItemsArray;
    }

    get length() {

        return this._itemsArray.length;

    }

    set length(value) {

        throw new Error('length property is read only');

    }

    push(item) {

        this.itemsArray.push(item);

    }

    pop() {

        this.itemsArray.pop(item);

    }

    insert(item, id) {

        this.itemsArray[id].id++;
        this.itemsArray.splice(id, 0, item);
 
    }

    toggleItemDone(id) {

        this.itemsArray[id].done = this.itemsArray[element.id].done ? false : true;

    }

    static renderItem(item, listContainer) {
    
        if (item.trash) return;

        const CHECK = "fa-check-circle";
        const UNCHECK = "fa-circle";
        const checkedCircleStyle = "todo-list__circle-icon--checked";
        const uncheckedCircleStyle = "todo-list__circle-icon--unchecked"
        const lineThroughStyle = "todo-list__text--linethrough"

        const itemComponent = `<li class="todo-list__item">
                        <i class="todo-list__circle-icon ${item.done ? checkedCircleStyle : uncheckedCircleStyle} far ${item.done ? CHECK : UNCHECK}" data-job="complete" id="${item.id}"></i>
                        <p class="todo-list__text ${item.done ? lineThroughStyle : ""}">${item.text}</p>
                        <i class="todo-list__trash-icon far fa-trash-alt" data-job="delete" id="${item.id}"></i>
                    </li>`;
    
        listContainer.insertAdjacentHTML("beforeend", itemComponent);
        
    }

    static renderList(todoList, listContainer) {

        todoList.itemsArray.forEach( (item) => TodoList.renderItem(item, listContainer) );
        
    }

    static renderCompletedItem(element) {

        const CHECK = "fa-check-circle";
        const UNCHECK = "fa-circle";
        const checkedCircleStyle = "todo-list__circle-icon--checked";
        const uncheckedCircleStyle = "todo-list__circle-icon--unchecked"
        const lineThroughStyle = "todo-list__text--linethrough"

        element.classList.toggle(CHECK);
        element.classList.toggle(UNCHECK);
        element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle(checkedCircleStyle);
        element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle(uncheckedCircleStyle);
        element.parentNode.querySelector(".todo-list__text").classList.toggle(lineThroughStyle);

    }

}

// Selector constants.
const clear = document.querySelector(".todo-list-refresher");
const dateText = document.querySelector(".date__text");
const list = document.querySelector(".todo-list");
const input = document.querySelector(".item-adder__input");
const content = document.querySelector(".main-content");
const additem = document.querySelector(".item-adder");
const header = document.querySelector(".header");
const theme = document.querySelector(".theme-selector__toggle-icon");

// Todays date.
displayTodaysDate(dateText);

// Visual element used to toggle theme settings.
const darkTheme = "fa-toggle-on";
const lightTheme = "fa-toggle-off";

// Variables used for local storage.
let LIST = new TodoList();
let id = 0;

// Retrieve TodoList.itemsArray from local storage.
let data = localStorage.getItem("TODO");
debugger;
// Data loader. Creates new local storage list if data is empty.
if (data) {

    LIST.itemsArray = JSON.parse(data).map(item => new TodoItem(item.text, item.id, item.done, item.trash));
    id = LIST.length;
    TodoList.renderList(LIST, list);

}

// Retrieve theme setting from local storage.
let style = localStorage.getItem("THEME");

// Theme Loader. Preserves the state of the theme using local storage.
if (style == "dark") {

    setTheme(theme);

}

// Clear and reload the page when the user clicks the clear icon in the header area.
clear.addEventListener("click", () => {

    localStorage.setItem("TODO", "");
    location.reload();

});

// Add a new item to the list when the user hits the enter key.
// Update the list in local storage.
// Reset the input field.
document.addEventListener("keydown", (event) => {

    if (event.code == "Enter" || event.code == "NumpadEnter") {

        const todoText = input.value;
        debugger;
        if (todoText) {

            let item = new TodoItem(todoText, id, false, false);
            LIST.push(item);
            TodoList.renderItem(item, list);
            localStorage.setItem("TODO", JSON.stringify(LIST.itemsArray));

            id++;

        }

        input.value = "";

    }

});

// Complete or delete an item depending on which icon the user clicks.
list.addEventListener("click", (event) => {

    const element = event.target;
    const elementJob = element.dataset.job;

    if (elementJob == "complete") {

        LIST.itemsArray[element.id].toggleDone();
        TodoList.renderCompletedItem(element);

    } else if (elementJob == "delete") {
        debugger;
    
        LIST.itemsArray[element.id].setTrash();
        element.parentNode.parentNode.removeChild(element.parentNode);

    }

    localStorage.setItem("TODO", JSON.stringify(LIST.itemsArray));

});

// Dark and light theme toggle
theme.addEventListener("click", (event) => {

    const element = event.target;
    setTheme(element);

});

// Toggle between light and dark themes.
function setTheme(element) {

    element.classList.toggle(darkTheme);
    element.classList.toggle(lightTheme);

    document.body.style.background = element.classList.contains(lightTheme) ? "rgb(137, 201, 170)" : "#003d47";
    header.style.backgroundSize = element.classList.contains(lightTheme) ? "200%" : "150%";
    header.style.backgroundImage = element.classList.contains(lightTheme) ? "url('lightTheme.svg')" : "url('darkTheme.svg')";
    header.style.backgroundPosition = element.classList.contains(lightTheme) ? "-100px -175px": "initial" ;
    content.style.background = element.classList.contains(lightTheme) ? "white" : "lightgray";
    additem.style.background = element.classList.contains(lightTheme) ? "white" : "lightgray";
    localStorage.setItem("THEME", element.classList.contains(lightTheme) ? 'light' : 'dark');

}

function displayTodaysDate(element) {
    const options = {weekday: "long", month: "short", day: "numeric"};
    const today = new Date();
    element.innerHTML = today.toLocaleDateString("en-US", options);
}
