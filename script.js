// Selector constants.
const clear = document.getElementById("clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const content = document.querySelector(".content");
const additem = document.querySelector(".add-item");

// Visual elements used to indicate completion of items.
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle";
const LINE_THROUGH = "lineThrough";

// Visual element used to toggle theme settings.
const TOGGLEON = "fa-toggle-on";
const TOGGLEOFF = "fa-toggle-off";

// Variables used for local storage.
let LIST, id;

// Retrieve to do list from local storage.
let data = localStorage.getItem("TODO");

// Data loader. Creates new local storage list if data is empty.
if (data) {
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
} else {
    LIST = [];
    id = 0;
}

// Load list retrieved from local storage.
function loadList(array) {
    array.forEach( (item) => addToDo(item.name, item.id, item.done, item.trash) );
}

// Clear and reload the page when the user clicks the clear icon in the header area.
clear.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
})

// Arguements for date text.
const options = {weekday: "long", month: "short", day: "numeric"};
const today = new Date();

// Todays date.
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

// Appends a to do item to the list located in the content area.
function addToDo(toDo, id, done, trash) {
    if (trash) {
        return;
    }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `<li class="item">
                    <i class="far ${DONE}" data-job="complete" id="${id}"></i>
                    <p class="text ${LINE}">${toDo}</p>
                    <i class="far fa-trash-alt" data-job="delete" id="${id}"></i>
                  </li>`;

    const position = "beforeend";
    
    list.insertAdjacentHTML(position, item);
}

// Add a new item to the list when the user hits the enter key.
// Update the list in local storage.
// Reset the input field.
document.addEventListener("keyup", (event) => {
    if (event.keyCode == 13) {
        const toDo = input.value;

        if (toDo) {
            addToDo(toDo, id, false, false);

            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false,
            });

            localStorage.setItem("TODO", JSON.stringify(LIST));

            id++;
        }
        input.value = "";
    }
});

// Apply visual elements when a user has finished or restarted an item in the list.
// Update the list item to reflect the state of the item.
function completeToDo(element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

// Delete an item when the user hits the trash icon.
// Update the list item to reflect the state of the item.
function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
}

// Complete or delete an item depending on which icon the user clicks.
list.addEventListener("click", (event) => {
    const element = event.target;
    const elementJob = element.dataset.job;

    if (elementJob == "complete") {
        completeToDo(element);
    } else if (elementJob == "delete") {
        removeToDo(element);
    }

    localStorage.setItem("TODO", JSON.stringify(LIST));
});

function changeBodyColor(color) {
    document.body.style.background = yellow;
}

theme.addEventListener("click", (event) => {
    const element = event.target;
    
    element.classList.toggle(TOGGLEON);
    element.classList.toggle(TOGGLEOFF);

    if (element.classList.contains(TOGGLEON)) {
        document.body.style.background = "rgba(0, 0, 0, 0.75)";
        content.style.background = "lightgray";
        additem.style.background = "lightgray";
    } else {
        document.body.style.background = "rgba(0,0,0,0.1)";
        content.style.background = "white";
        additem.style.background = "white";
    }
});