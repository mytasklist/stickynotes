const DB_NAME = "stickyNote";
const TASKBOX = "task-text";

function addtask() {
    debugger;
    var taskText = document.getElementById('task-text');
    //var taskTime = document.getElementById('task-time');
    var table = document.getElementById('list');

    if (taskText.value.length == 0 ) {

        alert('plz add some task with > 0 chars');
        taskText.value = null;
        return;
    }
    else {
        addToTaskList(taskText.value);
    }
}


class Task {
    constructor(idvalue, data) {
        this.taskid = idvalue;
        this.value = data;
        this.taskdate = Date.now();
    }
}

var TaskList = [];

function Load() {
    debugger;

    const existingTodos = JSON.parse(localStorage.getItem(DB_NAME)) || [];
    var id = 0;
    existingTodos.forEach(todo => {
        AddToTable(todo);
    });
    TaskList = existingTodos;
}



function Rem(btn) {
    var j1 = btn;
    debugger;
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    //TaskList.pop(parseInt(btn.name));
    var newList = TaskList.filter(t => t.taskid != btn.name);
    Sync(newList);
}

function Sync(mylist) {
    if (mylist == null) {
        localStorage.setItem(DB_NAME, JSON.stringify(TaskList));
    }
    else {
        localStorage.setItem(DB_NAME, JSON.stringify(mylist));
    }
    //TaskList = [];
    //Load();
}

function addToTaskList(todoText, id) {

    debugger;
    var tsk = new Task(TaskList.length, todoText);
    TaskList.push(tsk);
    localStorage.setItem(DB_NAME, JSON.stringify(TaskList));

    var taskText = document.getElementById('task-text');
    taskText.value = '';

    AddToTable(tsk);
}

function AddToTable(tsk) {
    var table = document.getElementById('list');
    var rowId = table.rows.length;
    let myDate = new Date(tsk.taskdate);
    let dateStr = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();

    var row = table.insertRow(1);

    var cols = ["c1","c2","c3","c4"];
    var rrr = cols[Math.round(Math.random()*3)]//`rgb(${Math.round(Math.random()*100)+155} ,${Math.round(Math.random()*100)+155},${Math.round(Math.random()*100)+155})`;

    var cell1 = row.insertCell(0);
    cell1.setAttribute('colspan', 2);
    var innerHTML = `<div id="task" class="task ${rrr}">
    <input type='button' name="${tsk.taskid}" onclick= "Rem(this)" class='closeButtonStyle' value='&#10006;'>
    <div id="${rowId}" class="entry">    <b>#${tsk.taskid}</b> ${tsk.value} 
        <span class="toolbox">
        </span>
    </div><span class="dtnow"> [${dateStr}] </span></div>`;
    cell1.innerHTML = innerHTML;

    var tasker = document.getElementById("tasker");
    tasker.innerHTML = "<b>killercodes</b>";
    var taskText = document.getElementById('task-text');
    taskText.value = ''
}

//Load
Load();
