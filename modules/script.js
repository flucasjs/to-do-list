import TodoList from './TodoList.js'
import TodoItem from './TodoItem.js'

// Selector constants.
const dateText = document.querySelector(".date__text");
const list = document.querySelector(".todo-list");
const input = document.querySelector(".item-adder__input");
const itemAdderIcon = document.querySelector(".item-adder__plus-circle-icon");

// Todays date.
displayTodaysDate(dateText);

// Variables used for local storage.
let LIST = new TodoList(document.getElementsByClassName("todo-list__item"));

// Retrieve TodoList.itemsArray from local storage.
let data = localStorage.getItem("TODO");

// Data loader. Creates new local storage list if data is empty.
if (data) {
    LIST = TodoList.parseData(data);
    TodoList.renderList(LIST, list);
}

// Add a new item to the list when the user hits the enter key.
// Update the list in local storage.
// Reset the input field.
document.addEventListener("keydown", (event) => {
    if (event.code == "Enter" || event.code == "NumpadEnter") {
        addItem(input.value)
    }
});

// Complete or delete an item depending on which icon the user clicks.
list.addEventListener("click", (event) => {
    const element = event.target;
    const elementState = element.dataset.state;

    if (elementState == "complete") {

        LIST.itemsArray[element.id].toggleDone();
        LIST.toggleCompletedItemStyles(element);

    } else if (elementState == "delete") {
    
        LIST.itemsArray[element.id].setTrash();
        element.parentNode.parentNode.removeChild(element.parentNode);

    }

    localStorage.setItem("TODO", JSON.stringify(LIST.itemsArray));
});

function displayTodaysDate(element) {
    const options = {weekday: "long", month: "short", day: "numeric"};
    const today = new Date();
    element.innerHTML = today.toLocaleDateString("en-US", options);
}

itemAdderIcon.addEventListener("click", (event) => {
    addItem(input.value)
})



function addItem(inputValue) {
    if (inputValue) {
        LIST.push(new TodoItem(inputValue, LIST.length, false, false), list)
        localStorage.setItem("TODO", JSON.stringify(LIST.itemsArray));
    }

    input.value = "";
}