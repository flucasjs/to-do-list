import TodoItem from './TodoItem.js';

class TodoList {

    constructor(listElements, itemsArray = []) {

        this.itemsArray = itemsArray;
        this.listElements = listElements;

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

    push(item, listElement = null) {

        this.itemsArray.push(item);
        if (listElement && listElement.nodeName == 'UL') {

            this.constructor.renderItem(item, listElement)

        } else {

            throw TypeError('listElement must be of type HTMLUListElement')

        }

    }

    pop() {

        this.itemsArray.pop(item);

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

        let newItem = document.createElement("li");
        newItem.className = "todo-list__item";
        newItem.style.borderBottom = "1px solid #cdcdcd";

        let circleIcon = document.createElement("i");
        circleIcon.className = `todo-list__circle-icon ${item.done ? checkedCircleStyle : uncheckedCircleStyle} far ${item.done ? CHECK : UNCHECK}`;
        circleIcon.dataset.state = "complete";
        circleIcon.id = item.id;
        newItem.appendChild(circleIcon);

        let text = document.createElement("p");
        text.className = `todo-list__text ${item.done ? lineThroughStyle : ""}`
        text.textContent = item.text;
        newItem.appendChild(text);

        let trashIcon = document.createElement("i");
        trashIcon.className = `todo-list__trash-icon far fa-trash-alt`;
        trashIcon.dataset.state = "delete";
        trashIcon.id = item.id;
        newItem.appendChild(trashIcon);

        newItem.addEventListener("dblclick", createTextEditor);
        newItem.addEventListener("mouseover", setHoveredItemStyles);
        newItem.addEventListener("mouseout", removeHoveredItemStyles);
        
        listContainer.appendChild(newItem);

        // ---------- Private helper functions for static render method ---------- //

        // Creates a "text editor" from an input element and replaces the to do item on which an event is called.
        function createTextEditor(event) {

            // Prevent mulitple dblclick events from being called at the same time on a single to do item.
            if (event.target.classList.contains("edit") || event.target.classList.contains("edit-container")) return;

            // Prevent dblclick events on icons from creating edit elements.
            if (event.target.classList.contains("todo-list__circle-icon") || event.target.classList.contains("todo-list__trash-icon")) return;

            setEditStyles();

            let edit = document.createElement("input");
            let text = newItem.querySelector(".todo-list__text");

            edit.type = "text";
            edit.placeholder = "Edit...";
            edit.value = text.textContent;
            edit.classList.add("todo-list__text");
            edit.classList.add("edit");
            newItem.classList.add("edit-container");
            
            text.insertAdjacentElement("afterend", edit);
            text.style.display = "none";

            edit.select();

            edit.addEventListener("keydown", (event) => {

                if (event.key === "Enter") {

                    text.textContent = edit.value;
                    text.style.display = "block";
                    newItem.removeChild(edit);

                }

            });

            // If the user clicks anywhere besided the edit input element, remove it.
            document.body.addEventListener("click", removePrevTextEditor)

        }

        // Event handler that prevents multiple "text editor" input elements from existing any given time.
        function removePrevTextEditor(event) {

            let clickedElement = event.target;

                // An text editor element has a class of "edit" and a parent container wth a class of "edit-container".
                let editElementClicked = clickedElement.classList.contains("edit-container") || clickedElement.classList.contains("edit");

                // If the user did not click on the existing text editor element, then remove it.
                if (!(editElementClicked)) {

                    let prevEditContainer = document.querySelector(".edit-container");
                    if (prevEditContainer) {

                        let text = prevEditContainer.querySelector(".todo-list__text");
                        let prevEditInput = prevEditContainer.querySelector(".edit");

                        text.style.display = "block";
                        prevEditContainer.removeChild(prevEditInput);
                        prevEditContainer.classList.remove("edit-container");

                    }

                    // Remove the event listener after it's handler has been called so it doesn't trigger everytime the user clicks something on the page.
                    document.body.removeEventListener("click", removePrevTextEditor);
                }

        }

        function setHoveredItemStyles(event) {

            trashIcon.style.display = "inline-block";

            if (event.target.classList.contains("edit-container") || event.target.classList.contains("edit")) {

                setEditStyles();

            } else {

                newItem.classList.add((item.done) ? "todo-list__item--greenBorder" : "todo-list__item--blackBorder");
                newItem.style.borderBottom = (item.done) ? "1px solid green" : "1px solid blue";
                newItem.style.background = (item.done) ? "lightgreen" : "lightblue";

            }

        }

        function removeHoveredItemStyles(event) {

            trashIcon.style.display = "none";
            newItem.style.borderColor = "#cdcdcd";
            newItem.style.background = "white";

        }

        function setEditStyles(event) {

            newItem.style.background = "orange";
            newItem.style.borderBottom = "1px solid darkorange";

        }

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
        let greenBorder = "todo-list__item--greenBorder";
        let blackBorder = "todo-list__item--blackBorder"

        element.classList.toggle(CHECK);
        element.classList.toggle(UNCHECK);
        element.parentNode.classList.toggle(greenBorder);
        element.parentNode.classList.toggle(blackBorder);
        element.parentNode.style.borderBottom = (element.classList.contains(CHECK)) ? "1px solid green" : "1px solid blue";
        element.parentNode.style.background = (element.classList.contains(CHECK)) ? "lightgreen" : "lightblue";
        element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle(checkedCircleStyle);
        element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle(uncheckedCircleStyle);
        element.parentNode.querySelector(".todo-list__text").classList.toggle(lineThroughStyle);
    }

    static parseData(dataArray) {

        return new TodoList(JSON.parse(dataArray).map(item => new TodoItem(item.text, item.id, item.done, item.trash)));

    }

}

export default TodoList