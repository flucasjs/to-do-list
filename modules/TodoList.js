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

    // Appends a TodoItem to a TodoList as a list element to the specified list.
    static renderItem(todoItem, todoList) {
        const newItem = document.createElement("li");
        newItem.className = "todo-list__item";

        const text = document.createElement("p");
        text.className = "todo-list__text"
        text.textContent = todoItem.text;
        text.contentEditable = "true";
        text.spellcheck = "false";
        text.autocapitalize = "false";

        // function createDeleteIcon() {

        // }

        const deleteIconContainer = document.createElement("div");
        deleteIconContainer.className = "delete-icon-container";

        const forwardSlash = document.createElement("div");
        forwardSlash.className = "forward-slash"

        const backSlash = document.createElement("div");
        backSlash.className = "back-slash"

        deleteIconContainer.appendChild(forwardSlash);
        deleteIconContainer.appendChild(backSlash);

        deleteIconContainer.addEventListener("mouseover", () => {
            forwardSlash.style.backgroundColor = "red";
            forwardSlash.style.width = "1.75px";
            backSlash.style.width = "1.75px";
        })

        deleteIconContainer.addEventListener("mouseout", () => {
            forwardSlash.style.backgroundColor = "pink";
            forwardSlash.style.width = "1px";
            backSlash.style.width = "1px";
        })

        deleteIconContainer.addEventListener("click", () => {
            todoList.removeChild(newItem);
            todoItem.deleted = true;
        })

        newItem.addEventListener("mouseover", () => {
            forwardSlash.style.opacity = "75%";
            backSlash.style.opacity = "75%";
        })

        newItem.addEventListener("mouseout", () => {
            forwardSlash.style.opacity = "0";
            backSlash.style.opacity = "0";
        })

        newItem.appendChild(deleteIconContainer);
        newItem.appendChild(text);
        todoList.appendChild(newItem);
    }

    // Renders a list of TodoItems in a todoList.
    static renderList(todoList) {
        todoList.itemsArray.forEach(item => TodoList.renderItem(item, todoList) );
    }

    // Parses a JSON string describing a TodoList object.
    static parseData(dataArray) {
        return new TodoList(JSON.parse(dataArray).map(item => new TodoItem(item.text, item.id, item.done, item.deleted)));
    }
}

export default TodoList