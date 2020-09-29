'use strict';

class TodoItem {

    constructor(text = "", id = 0, done = false, trash = false) {

        this.text = text;
        this.id = id;
        this.done = done;
        this.trash = trash;

        this.toggleDone = this.toggleDone.bind(this);
        this.setTrash = this.setTrash.bind(this);
        this.edit = this.edit.bind(this);

    }


    toggleDone() {

        this.done = (this.done) ? false : true;

    }

    setTrash() {

        this.trash = true;
        
    }

    edit(text) {

        this.text = text;

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

        let checkedState, linethroughState, DONE, LINE;

        const checkedCircleStyle = "todo-list__circle-icon--checked";
        const uncheckedCircleStyle = "todo-list__circle-icon--unchecked"
        const lineThroughStyle = "todo-list__text--linethrough"

        if (item.done) {

            checkedState = checkedCircleStyle;
            linethroughState = lineThroughStyle;
            DONE = CHECK;

        } else {

            checkedState = uncheckedCircleStyle;
            linethroughState = "";
            DONE = UNCHECK;

        }

        const itemComponent = `<li class="todo-list__item">
                        <i class="todo-list__circle-icon ${checkedState} far ${DONE}" data-job="complete" id="${item.id}"></i>
                        <p class="todo-list__text ${linethroughState}">${item.text}</p>
                        <i class="todo-list__trash-icon far fa-trash-alt" data-job="delete" id="${id}"></i>
                    </li>`;
    
        listContainer.insertAdjacentHTML("beforeend", itemComponent);
        
    }

    static renderList(todoList, listContainer) {

        todoList.itemsArray.forEach( (item) => TodoList.renderItem(item, listContainer) );
        
    }

    static renderCompletedItem(element) {

        const checkedCircleIcon = "fa-check-circle";
        const uncheckedCircleIcon = "fa-circle";
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

// Visual elements used to indicate completion of items.
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle";
const LINE_THROUGH = "lineThrough";

// Visual element used to toggle theme settings.
const TOGGLEON = "fa-toggle-on";
const TOGGLEOFF = "fa-toggle-off";

// Variables used for local storage.
let LIST = new TodoList();
let id = 0;

// Retrieve to do list from local storage.
let data = localStorage.getItem("TODO");

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

        const toDo = input.value;

        if (toDo) {

            let item = new TodoItem(toDo, id, false, false);
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
        debugger;
        LIST.itemsArray[element.id].toggleDone();
        TodoList.renderCompletedItem(element);

    } else if (elementJob == "delete") {
    
        LIST.itemsArray[element.id].trash();
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

    element.classList.toggle(TOGGLEON);
    element.classList.toggle(TOGGLEOFF);

    let darkBackgroundColor = "rgba(0, 0, 0, .75)";
    let darkContentColor = "lightgray";
    let darkItemColor = "lightgray";

    let lightBackgroundColor = "rgb(137, 201, 170)";
    let lightContentColor = "white";
    let lightItemColor = "white";

    if (element.classList.contains(TOGGLEON)) {

        document.body.style.background = darkBackgroundColor;
        content.style.background = darkContentColor;
        additem.style.background = darkItemColor;

        header.style.backgroundImage = "url('img2.svg')";
        header.style.backgroundSize = "150%";
        header.style.backgroundPosition = "initial";

        localStorage.setItem("THEME", "dark");
        
        
    } else {

        document.body.style.background = lightBackgroundColor;
        content.style.background = lightContentColor ;
        additem.style.background = lightItemColor;

        header.style.backgroundImage = "url('img1.svg')";
        header.style.backgroundSize = "200%";
        header.style.backgroundPosition = "-100px -175px";

        localStorage.setItem("THEME", "light");

    }
}

function displayTodaysDate(element) {
    const options = {weekday: "long", month: "short", day: "numeric"};
    const today = new Date();
    element.innerHTML = today.toLocaleDateString("en-US", options);
}

function renderCompletedItem(element) {

    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle("todo-list__circle-icon--checked");
    element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle("todo-list__circle-icon--unchecked");
    element.parentNode.querySelector(".todo-list__text").classList.toggle("todo-list__text--linethrough");

}