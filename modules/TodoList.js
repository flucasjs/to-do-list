import TodoItem from './TodoItem.js';

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

        const itemComponent = `<li class="todo-list__item">
                        <i class="todo-list__circle-icon ${item.done ? checkedCircleStyle : uncheckedCircleStyle} far ${item.done ? CHECK : UNCHECK}" data-state="complete" id="${item.id}"></i>
                        <p class="todo-list__text ${item.done ? lineThroughStyle : ""}">${item.text}</p>
                        <i class="todo-list__edit-icon far fa-edit"></i>
                        <i class="todo-list__trash-icon far fa-trash-alt" data-state="delete" id="${item.id}"></i>
                    </li>`;
    
        listContainer.insertAdjacentHTML("beforeend", itemComponent);
        
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

        element.classList.toggle(CHECK);
        element.classList.toggle(UNCHECK);
        element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle(checkedCircleStyle);
        element.parentNode.querySelector(".todo-list__circle-icon").classList.toggle(uncheckedCircleStyle);
        element.parentNode.querySelector(".todo-list__text").classList.toggle(lineThroughStyle);

    }

    static parseData(dataArray) {

        return new TodoList(JSON.parse(dataArray).map(item => new TodoItem(item.text, item.id, item.done, item.trash)));

    }

}

export default TodoList