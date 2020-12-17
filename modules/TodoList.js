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
        element.parentNode.style.borderBottom = (this.itemsArray[element.id].done) ? "1px solid green" : "1px solid blue";

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
        newItem.style.borderBottom = "1px solid #cdcdcd";

        const circleIcon = document.createElement("i");
        circleIcon.className = `todo-list__circle-icon ${item.done ? checkedCircleStyle : uncheckedCircleStyle} far ${item.done ? CHECK : UNCHECK}`;
        circleIcon.dataset.state = "complete";
        circleIcon.id = item.id;
        newItem.appendChild(circleIcon);

        const text = document.createElement("p");
        text.className = `todo-list__text ${item.done ? lineThroughStyle : ""}`
        text.textContent = item.text;
        newItem.appendChild(text);

        const trashIcon = document.createElement("i");
        trashIcon.className = `todo-list__trash-icon far fa-trash-alt`;
        trashIcon.dataset.state = "delete";
        trashIcon.id = item.id;
        newItem.appendChild(trashIcon);

        newItem.addEventListener("dblclick", createTextEditor);
        setHoverListeners(newItem, setEditorStyles, removeEditorStyles);

        listContainer.appendChild(newItem);

        randomizeBackgroundColor(newItem);

        // ---------- Private helper functions for static render method ---------- //

        // Creates a "text editor" from an input element and replaces the to do item on which an event is called.
        function createTextEditor(event) {

            // Prevent mulitple dblclick events from being called at the same time on a single to do item.
            if (event.target.classList.contains("edit") || event.target.classList.contains("edit-container")) return;

            // Prevent dblclick events on icons from creating edit elements.
            if (event.target.classList.contains("todo-list__circle-icon") || event.target.classList.contains("todo-list__trash-icon")) return;

            let edit = document.createElement("input");
            let text = newItem.querySelector(".todo-list__text")

            edit.type = "text";
            edit.placeholder = "Edit...";
            edit.value = text.textContent;
            edit.classList.add("todo-list__text");
            edit.classList.add("edit");
            newItem.classList.add("edit-container");

            let confirmButton = document.createElement("div");
            confirmButton.textContent = "Confirm"
            confirmButton.classList.add("edit__confirm");
            newItem.append(confirmButton);

            let cancelButton = document.createElement("div");
            cancelButton.textContent = "Cancel"
            cancelButton.classList.add("edit__cancel");
            newItem.append(cancelButton);

            setEditorStyles(null, "none");
            
            text.insertAdjacentElement("afterend", edit);
            text.style.display = "none";

            edit.setSelectionRange(edit.value.length, edit.value.length);
            edit.focus();

            edit.addEventListener("keydown", handleEditorInput);

            confirmButton.addEventListener("click", handleEditorInput)

            cancelButton.addEventListener("click", handleEditorInput)

            // If the user clicks anywhere besided the edit input element, remove it.
            document.body.addEventListener("click", preventMulitpleEditors)

        }

        // Event handler that prevents multiple "text editor" input elements from existing at any given time.
        function preventMulitpleEditors(event) {

            let clickedElement = event.target;

                // A text editor element has a class of "edit" and a parent container wth a class of "edit-container".
                let editElementClicked = clickedElement.classList.contains("edit-container") || clickedElement.classList.contains("edit");

                // If the user did not click on the existing text editor element, then remove it.
                // We can also forcibly remove the editor by setting forceRemove to true.
                if (!editElementClicked) {

                    removeEditor(event);

                    // Remove the event listener after it's handler has been called so it doesn't trigger everytime the user clicks something on the body.
                    document.body.removeEventListener("click", preventMulitpleEditors);
                }

        }

        function removeEditor(event) {

            let prevEditContainer = document.querySelector(".edit-container");
            if (prevEditContainer) {

                let text = prevEditContainer.querySelector(".todo-list__text");
                let prevEditInput = prevEditContainer.querySelector(".edit");
                let prevConfimButton = prevEditContainer.querySelector(".edit__confirm");
                let prevCancelButton = prevEditContainer.querySelector(".edit__cancel");

                // Remove existing mouseover and mouseout event listeners to avoid stacking.
                removeHoverListeners(prevEditContainer, setEditorStyles, removeEditorStyles);

                // Reset default mouseover and mouseout event listeners.
                setHoverListeners(prevEditContainer, setEditorStyles, removeEditorStyles);

                // TODO: This shouldnt be handled in this function.
                // prevEditContainer.style.borderColor = (item.done) ? "green" : "#cdcdcd";
                prevEditContainer.style.background = (item.done) ? "lightgreen" : "var(--primary-color-light)";
                text.style.display = "block";

                prevEditContainer.removeChild(prevConfimButton);
                prevEditContainer.removeChild(prevCancelButton);
                prevEditContainer.removeChild(prevEditInput);

                prevEditContainer.classList.remove("edit-container");

            }
            
        }

        function updateItemText(elementToUpdate, inputElement) {

            elementToUpdate.textContent = inputElement.value;

        }

        function renderUpdatedItem(event) {

            let editorContainer = document.querySelector(".edit-container");
            let editor = editorContainer.querySelector(".edit");
            let todoText = editorContainer.querySelector(".todo-list__text");

            updateItemText(todoText, editor);
            removeEditor(event);

        }

        function handleEditorInput(event) {
            
            if (event.type === "keydown") {
 
                if (event.key === "Escape") {

                    removeEditor(event);

                } else if (event.key === "Enter") {

                    renderUpdatedItem(event)

                }

            } else if (event.type === "click") {
                
                let editorButtonClicked = event.target.classList.contains("edit__confirm") || event.target.classList.contains("edit__cancel");

                if (!editorButtonClicked) {

                    return;

                }

                renderUpdatedItem(event)

            }
            
        }

        // Sets the styles for the the text editor element.
        function setEditorStyles(event, trashIconDisplay = "inline-block") {

            trashIcon.style.display = trashIconDisplay;

            if (newItem.classList.contains("edit-container")) {

                // Do not alter the editor styles when the user hovers over or out of the item being edited.
                // Maintain focus on the editor until the user finishes editing.
                removeHoverListeners(newItem, setEditorStyles, removeEditorStyles);

                newItem.style.borderBottom = "1px solid darkorange";
                // newItem.style.background = "lightyellow";
                

            } else {

                newItem.style.borderBottom = (item.done) ? "1px solid green" : "1px solid blue";
                // newItem.style.background = (item.done) ? "lightgreen" : "lightblue";

            }       

        }

        // Removes the styles from the text editor element.
        function removeEditorStyles(event) {

            trashIcon.style.display = "none";
            newItem.style.borderColor = "#cdcdcd";
            // newItem.style.background = "var(--primary-color-light)";
        }

        // Set the mouseover and mouseout event listeners with the specified handlers on the referenced element.
        function setHoverListeners(element, mouseOverHandler, mouseOutHandler) {
            
            element.addEventListener("mouseover", mouseOverHandler);
            element.addEventListener("mouseout", mouseOutHandler);

        }

        // Removes the mouseover and mouseout event listeners with the specified handlers from the referenced element.
        function removeHoverListeners(element, mouseOverHandler, mouseOutHandler) {
            
            element.removeEventListener("mouseover", mouseOverHandler);
            element.removeEventListener("mouseout", mouseOutHandler);

        }

        function randomizeBackgroundColor(element) {

            const colorsArray = ["#e6fd91", "#f8c5fe", "#fd8781", "#fffd61", "#fd9f4b"];

            if (element.previousElementSibling) {
            
                const prevItemColor = element.previousElementSibling.style.background;
                let newItemColor = newItem.style.background;

                do {

                    element.style.background = colorsArray[Math.floor(Math.random() * 5)];
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