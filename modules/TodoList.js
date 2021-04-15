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

    // Renders a TodoItem to the TodoList as a list element to the specified list.
    static renderItem(item, listContainer) {
        const newItem = document.createElement("li");
        newItem.className = "todo-list__item";

        const text = document.createElement("p");
        text.className = "todo-list__text"
        text.textContent = item.text;
        text.contentEditable = "true";
        text.spellcheck = "false";
        text.autocapitalize = "false";

        const removeNoteContainer = document.createElement("div");
        removeNoteContainer.className = "remove-note-container";

        const removeNoteLeft = document.createElement("div");
        removeNoteLeft.className = "remove-note-left"

        const removeNoteRight = document.createElement("div");
        removeNoteRight.className = "remove-note-right"

        removeNoteContainer.appendChild(removeNoteLeft);
        removeNoteContainer.appendChild(removeNoteRight);

        removeNoteContainer.addEventListener("mouseover", () => {
            removeNoteLeft.style.width = "1.75px";
            removeNoteRight.style.width = "1.75px";
        })

        removeNoteContainer.addEventListener("mouseout", () => {
            removeNoteLeft.style.width = "1px";
            removeNoteRight.style.width = "1px";
        })

        newItem.addEventListener("mouseover", () => {
            removeNoteLeft.style.opacity = "75%";
            removeNoteRight.style.opacity = "75%";
        })

        newItem.addEventListener("mouseout", () => {
            removeNoteLeft.style.opacity = "0";
            removeNoteRight.style.opacity = "0";
        })

        removeNoteContainer.addEventListener("click", () => {
            listContainer.removeChild(newItem);
        })

        newItem.appendChild(removeNoteContainer);
        newItem.appendChild(text);
        listContainer.appendChild(newItem);
    }

    // Renders a list of TodoItems as list items in the specified list.
    static renderList(todoList, listContainer) {
        todoList.itemsArray.forEach(item => TodoList.renderItem(item, listContainer) );
    }

    // Parses a JSON string describing a TodoList object.
    static parseData(dataArray) {
        return new TodoList(JSON.parse(dataArray).map(item => new TodoItem(item.text, item.id, item.done, item.trash)));
    }

}

export default TodoList