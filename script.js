'use strict';

class TodoItem {

    constructor(text = "", id = 0, done = false, trash = false) {

        this.text = text;
        this.id = id;
        this.done = done;
        this.trash = trash;

    }

    toggleDone() {

        this.done = (this.done) ? false : true;

    }

    trash() {

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

    remove(id) {

        this.itemsArray.splice(id, 1)

    }

    static renderItem(item, listContainer) {

        let checkedState, linethroughState, DONE, LINE;
    
        if (item.trash) return;

        if (item.done) {

            checkedState = "todo-list__circle-icon--checked";
            linethroughState = "todo-list__text--linethrough";
            DONE = CHECK;
            LINE = LINE_THROUGH;

        } else {

            checkedState = "todo-list__circle-icon--unchecked";
            linethroughState = "";
            DONE = UNCHECK;
            LINE = "";

        }

        const itemComponent = `<li class="todo-list__item">
                        <i class="todo-list__circle-icon ${checkedState} far ${DONE}" data-job="complete" id="${id}"></i>
                        <p class="todo-list__text ${linethroughState} ${LINE}">${item.text}</p>
                        <i class="todo-list__trash-icon far fa-trash-alt" data-job="delete" id="${id}"></i>
                    </li>`;
    
        listContainer.insertAdjacentHTML("beforeend", itemComponent);
        
    }

    static renderList(todoList, listContainer) {

        todoList.itemsArray.forEach( (item) => TodoList.renderItem(item, listContainer) );
        
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

// Arguements for date text.
const options = {weekday: "long", month: "short", day: "numeric"};
const today = new Date();

// Todays date.
dateText.innerHTML = today.toLocaleDateString("en-US", options);

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
    
    loadList(data);

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
document.addEventListener("keyup", (event) => {

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

        completeToDo(element);

    } else if (elementJob == "delete") {

        removeToDo(element);

    }


    localStorage.setItem("TODO", JSON.stringify(LIST.itemsArray));

});

// Dark and light theme toggle
theme.addEventListener("click", (event) => {

    const element = event.target;
    setTheme(element);

});

// Apply visual elements when a user has finished or restarted an item in the list.
// Update the list item to reflect the state of the item.
function completeToDo(element) {

    element.classList.toggle(CHECK);
    element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle("todo-list__circle-icon--checked");
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle("todo-list__circle-icon--unchecked");
    element.parentNode.querySelector(".todo-list__text").classList.toggle("todo-list__text--linethrough");
    LIST.itemsArray[element.id].done = LIST.itemsArray[element.id].done ? false : true;

}


// Delete an item when the user hits the trash icon.
// Update the list item to reflect the state of the item.
function removeToDo(element) {

    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST.itemsArray[element.id].trash = true;

}

// Load list retrieved from local storage.
function loadList(listData) {

    LIST.itemsArray = JSON.parse(listData);
    id = LIST.length;
    TodoList.renderList(LIST, list);

}

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