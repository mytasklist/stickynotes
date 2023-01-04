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
        this.Completed = false; 
    }
}

var TaskList = [];

function Load() {
   
    const existingTodos = JSON.parse(localStorage.getItem(DB_NAME)) || [];
    var id = 0;
    existingTodos.forEach(todo => {
        AddToTable(todo);
    });
    TaskList = existingTodos;
}

function Editable(btn)
{
    btn.contentEditable = true;
    console.log(btn.id);
}
function MrkDone(t){ debugger;
    t.parentElement.parentElement.style.background = "#fff";
    var Id = t.id;
    var bool = t.checked;

    for(var i=0;i<TaskList.length;i++)
    {
        if(TaskList[i].taskid == Id)
        TaskList[i].Completed = bool;
    }

    localStorage.setItem(DB_NAME, JSON.stringify(TaskList));//sync

}
function changed(btn)
{
    debugger;
    var content = btn.innerHTML;
    var tsk = new Task(btn.id, content);

    var newList = TaskList.filter(t => tsk.taskid == btn.id);

    for(var i=0;i<TaskList.length;i++)
    {
        if(TaskList[i].taskid == btn.id)
        TaskList[i].value = content;
    }

    localStorage.setItem(DB_NAME, JSON.stringify(TaskList));//sync
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

    //var cols = ["c1","c2","c3","c4","c5","c6","c7","c8"];
    //var rrr = cols[Math.round(Math.random()*7)]//`rgb(${Math.round(Math.random()*100)+155} ,${Math.round(Math.random()*100)+155},${Math.round(Math.random()*100)+155})`;
    var hcolor= `hsl(${Math.random() * 360 }, 100%, 90%)`;// hsl(" "+ Math.random() * 360 + ", 100%, 75%)"";
    let bgColor = `style="background-color:${hcolor}"`;
    var cell1 = row.insertCell(0);
    cell1.setAttribute('colspan', 2);
    var status = "";
    if(tsk.Completed == true)
    {
        status = "checked";   
    }    
    

    var innerHTML = `<div id="task${tsk.taskid}" class="task" ${bgColor}>
    <input type='button' name="${tsk.taskid}" onclick= "Rem(this)" class='closeButtonStyle' value='&#10006;'>
    <div id="${tsk.taskid}" onclick="Editable(this)" onfocusout="changed(this)" class="entry">
    ${tsk.value} 
    </div>
    <span class="dtnow"><b>#${tsk.taskid}</b>  [${dateStr}] <input id="${tsk.taskid}" type='checkbox' onclick= "MrkDone(this)" ${status}></span>
    </div>`;
    cell1.innerHTML = innerHTML;

    var tasker = document.getElementById("tasker");
    tasker.innerHTML = "<b>killercodes</b>";
    var taskText = document.getElementById('task-text');
    taskText.value = ''
}

//Load
Load();
