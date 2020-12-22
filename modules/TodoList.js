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

    // Toggles between the styles of a compelted and uncompleted TodoItem
    toggleCompletedItemStyles(element) {

        const CHECK = "fa-check-circle";
        const UNCHECK = "fa-circle";
        const checkedCircleStyle = "todo-list__circle-icon--checked";
        const uncheckedCircleStyle = "todo-list__circle-icon--unchecked"
        const lineThroughStyle = "todo-list__text--linethrough"

        // element.parentNode.style.background = (this.itemsArray[element.id].done) ? "lightgreen" : "lightblue";
        // element.parentNode.style.borderBottom = (this.itemsArray[element.id].done) ? "1px solid green" : "1px solid blue";

        element.classList.toggle(CHECK);
        element.classList.toggle(UNCHECK);
        element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle(checkedCircleStyle);
        element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle(uncheckedCircleStyle);
        element.parentNode.querySelector(".todo-list__text").classList.toggle(lineThroughStyle);
    }

    // Renders a TodoItem to the TodoList as a list element to the specified list.
    static renderItem(item, listContainer) {
    
        if (item.trash) return;

        const CHECK = "fa-check-circle";
        const UNCHECK = "fa-circle";
        const checkedCircleStyle = "todo-list__circle-icon--checked";
        const uncheckedCircleStyle = "todo-list__circle-icon--unchecked"
        const lineThroughStyle = "todo-list__text--linethrough"

        // TODO: Refactor this as a method of the TodoItem.js module that creates and returns an HTML element.
        const newItem = document.createElement("li");
        newItem.className = "todo-list__item";
        // newItem.style.borderBottom = "1px solid #cdcdcd";

        // const circleIcon = document.createElement("i");
        // circleIcon.className = `todo-list__circle-icon ${item.done ? checkedCircleStyle : uncheckedCircleStyle} far ${item.done ? CHECK : UNCHECK}`;
        // circleIcon.dataset.state = "complete";
        // circleIcon.id = item.id;
        // newItem.appendChild(circleIcon);

        const text = document.createElement("p");
        text.className = `todo-list__text ${item.done ? lineThroughStyle : ""}`
        text.textContent = item.text;
        text.contentEditable = "true";
        text.spellcheck = "false";
        text.autocapitalize = "false";
        newItem.appendChild(text);

        // const postedDate
        
        const trashIcon = document.createElement("i");
        trashIcon.className = `todo-list__trash-icon far fa-trash-alt`;
        trashIcon.dataset.state = "delete";
        trashIcon.id = item.id;
        newItem.appendChild(trashIcon);

        newItem.addEventListener("mouseover", handleMouseOver);
        newItem.addEventListener("mouseout", handleMouseOut);

        listContainer.appendChild(newItem);

        randomizeBackgroundColor(newItem);

        // ---------- Private helper functions for static render method ---------- //


        // Sets the styles for the the text editor element.
        function handleMouseOver(event, trashIconDisplay = "inline-block") {

            trashIcon.style.display = trashIconDisplay;

            // newItem.style.borderBottom = (item.done) ? "1px solid green" : "1px solid blue";  

        }

        // Removes the styles from the text editor element.
        function handleMouseOut(event) {

            trashIcon.style.display = "none";

        }

        function randomizeBackgroundColor(element) {

            const colorsArray = ["#023e8a", "#0077b6", "#0096c7"];

            if (element.previousElementSibling) {
            
                const prevItemColor = element.previousElementSibling.style.background;
                let newItemColor = newItem.style.background;

                do {

                    element.style.background = colorsArray[Math.floor(Math.random() * colorsArray.length)];
                    newItemColor = element.style.background;
                    
        
                } while (newItemColor === prevItemColor);

            } else {

                element.style.background = colorsArray[Math.floor(Math.random() * 5)];

            }
        }

    }

    // Renders a list of TodoItems as list items in the specified list.
    static renderList(todoList, listContainer) {

        todoList.itemsArray.forEach( (item) => TodoList.renderItem(item, listContainer) );
        
    }

    // Parses a JSON string describing a TodoList object.
    static parseData(dataArray) {

        return new TodoList(JSON.parse(dataArray).map(item => new TodoItem(item.text, item.id, item.done, item.trash)));

    }

}

export default TodoList