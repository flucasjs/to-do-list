import TodoList from './TodoList.js'
import TodoItem from './TodoItem.js'

'use strict';

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

// Retrieve TodoList.itemsArray from local storage.
let data = localStorage.getItem("TODO");

// Data loader. Creates new local storage list if data is empty.
if (data) {

    LIST = TodoList.parseData(data);
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

        if (todoText) {

            LIST.push(new TodoItem(todoText, LIST.length, false, false), list)
            localStorage.setItem("TODO", JSON.stringify(LIST.itemsArray));

        }

        input.value = "";

    }

});

// Complete or delete an item depending on which icon the user clicks.
list.addEventListener("click", (event) => {

    const element = event.target;
    const elementState = element.dataset.state;

    if (elementState == "complete") {

        LIST.itemsArray[element.id].toggleDone();
        TodoList.renderCompletedItem(element);

    } else if (elementState == "delete") {
    
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
