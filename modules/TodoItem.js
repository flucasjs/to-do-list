class TodoItem {

    constructor(text = "", id = 0, done = false, deleted = false) {
        this.text = text;
        this.id = id;
        this.done = done;
        this.deleted = deleted;

        this.toggleDone = this.toggleDone.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    toggleDone() {
        this.done = (this.done) ? false : true;
    }

    deleteItem() {
        this.deleted = true;
    }

}

export default TodoItem