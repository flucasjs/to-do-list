class TodoItem {

    constructor(text = "", id = 0, completed = false, deleted = false) {
        this.text = text;
        this.id = id;
        this.completed = completed;
        this.deleted = deleted;

        this.toggleCompleted = this.toggleCompleted.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    toggleCompleted() {
        this.completed = (this.completed) ? false : true;
    }

    deleteItem() {
        this.deleted = true;
    }

}

export default TodoItem