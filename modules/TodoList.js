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

        element.classList.toggle(CHECK);
        element.classList.toggle(UNCHECK);
        element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle(checkedCircleStyle);
        element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle(uncheckedCircleStyle);
        element.parentNode.querySelector(".todo-list__text").classList.toggle(lineThroughStyle);
    }

    // Renders a TodoItem to the TodoList as a list element to the specified list.
    static renderItem(item, listContainer) {
        if (item.trash) return;

        const lineThroughStyle = "todo-list__text--linethrough"

        const newItem = document.createElement("li");
        newItem.className = "todo-list__item";
        const text = document.createElement("p");
        text.className = `todo-list__text ${item.done ? lineThroughStyle : ""}`
        text.textContent = item.text;
        text.contentEditable = "true";
        text.spellcheck = "false";
        text.autocapitalize = "false";
        newItem.appendChild(text);

        listContainer.appendChild(newItem);
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