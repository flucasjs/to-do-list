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
                        <i class="todo-list__options-icon fas fa-ellipsis-h"> 
                        </i>
                    </li>`;

                    // <i class="todo-list__edit-icon far fa-edit"></i>
                    // <i class="todo-list__trash-icon far fa-trash-alt" data-state="delete" id="${item.id}"></i>                    
    
        listContainer.insertAdjacentHTML("beforeend", itemComponent);

        let testItemChild = document.querySelector(`[id="${item.id}"]`)
        let testItem = testItemChild.parentElement;
        let testObj = testItem.getBoundingClientRect();

        let testTab = document.createElement('div');
        testTab.style.height = `${testObj.height}px`;
        testTab.style.width = `50px`;
        testTab.style.borderRight = "5px solid black";
        testTab.style.position = "absolute";
        testTab.style.background = "yellow";
        testTab.style.left = `${testObj.right - 20}px`
        testTab.style.top = `${testObj.top}px`
        testTab.style.zIndex = `-1`;
        document.body.append(testTab);

        console.log(testObj);

        // select the options icon
        // select the parent to use its position info
        // add an event listener (EL) to the options icon
        // in this EL, add a handler that does the following:
        // a. check the state of the tab element (active)
            // 1. select the associated tab element
            // 2. set the visibility
            // 3. move the position of the element into view
            // 4. change the state of the tab element to active
        // b. else (inactive)
            // 1. select the associated tab element
            // 2. move the position of the element out of view
            // 3. hide
            // 4. change the state of the tab element to inactive
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