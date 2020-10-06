class TodoItem {

    constructor(text = "", id = 0, done = false, trash = false) {

        this.text = text;
        this.id = id;
        this.done = done;
        this.trash = trash;

        this.toggleDone = this.toggleDone.bind(this);
        this.setTrash = this.setTrash.bind(this);

    }

    toggleDone() {

        this.done = (this.done) ? false : true;

    }

    setTrash() {

        this.trash = true;
        
    }

}

export default TodoItem