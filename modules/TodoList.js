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

        newItem.addEventListener("mouseover", (event) => {

            trashIcon.style.display = "inline-block";

            newItem.classList.add((item.done) ? "todo-list__item--greenBorder" : "todo-list__item--blackBorder");
            newItem.style.borderBottom = (item.done) ? "1px solid green" : "1px solid blue";
            newItem.style.background = (item.done) ? "lightgreen" : "lightblue";

        });

        newItem.addEventListener("mouseout", (event) => {

            trashIcon.style.display = "none";
            newItem.style.borderColor = "#cdcdcd";
            newItem.style.background = "white";

        });

        listContainer.appendChild(newItem);
        
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

        console.log(element);

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