"use strict";

//const DB_NAME = "stickyNote";
//const TASKBOX = "task-text";

//task class
class Task {
    constructor(idvalue, data) {
        this.taskid = idvalue;
        this.value = data;
        this.CreatedOn = Date.now();
        this.Completed = false;
        this.Color = `hsl(${Math.random() * 360 }, 100%, 90%)`;
        this.ReadOnly = false;
    }

    
}//cls

class StickyNotes {

    #TASKBOX = "task-text";
    TaskList = [];

    constructor(dbName){
        this.DB_NAME = dbName;
    }

    LoadRecords(Each) {
        const existingRecords = JSON.parse(localStorage.getItem(this.DB_NAME)) || [];        
        this.TaskList = existingRecords;
        existingRecords.forEach(todo => {
            if(Each != undefined) 
                Each(todo);
        });
    }

    get NumRecords(){
        return this.TaskList.length;
    }

    get NewId(){
        var i = this.TaskList.length;
        
        if(i==0)
            return i;
        else
            i = i-1;
        
        return this.TaskList[i].taskid +1;
    }

    UpdateRecord(id,content){

        for(var i=0;i<this.NumRecords;i++)
        {
            if(this.TaskList[i].taskid == id)
                this.TaskList[i].value = content;
        }
    
        localStorage.setItem(this.DB_NAME, JSON.stringify(this.TaskList));//sync
    }

    #IndexRecords(){
        for(var i=0;i<this.NumRecords;i++)
            this.TaskList[i].taskid = i;
    }

    RemoveRecord(Id) {
        var newList = this.TaskList.filter(t => t.taskid != Id && t.ReadOnly == false);
        this.#IndexRecords();

        localStorage.setItem(this.DB_NAME, JSON.stringify(newList));
    }
    
    SyncRecord() {
        localStorage.setItem(this.DB_NAME, JSON.stringify(this.TaskList));
        this.TaskList = JSON.parse(localStorage.getItem(this.DB_NAME)) || [];
    }
    
    AddRecord(todoText,Added) {
        debugger;
        var tsk = new Task(this.NewId, todoText);
        this.TaskList.push(tsk);

        this.#IndexRecords();
        localStorage.setItem(this.DB_NAME, JSON.stringify(this.TaskList));
    
        if(Added != undefined )
            Added(tsk);
    }

    MarkDone(Id,bool){ debugger;

        for(var i=0;i<this.TaskList.length;i++)
        {
            if(this.TaskList[i].taskid == Id)
            {
                this.TaskList[i].Completed = bool;
                this.TaskList[i].ReadOnly = bool;
            }
        }
    
        localStorage.setItem(this.DB_NAME, JSON.stringify(this.TaskList));//sync
    
    }

    DateString(myDate){
        myDate = new Date(myDate);
        var string = `${myDate.getFullYear()}-${(myDate.getMonth() + 1)}-${myDate.getDate()} ${myDate.getHours()}: ${myDate.getMinutes()}:${myDate.getSeconds()}`;
        return string;
    }
//    <div id="tasker" ondrop="drop(event)" ondragover="allowDrop(event)></div>
    TaskAsHtml(task){
        var status = "";
        if(task.Completed == true) status = "checked";

        var tag = 
       `<div id="task${task.taskid}" class="task" style="background-color:${task.Color}" ondrop="drop(event)" ondragover="allowDrop(event)" draggable="true" ondragstart="drag(event)" >
            <input type='button' name="${task.taskid}" onclick= "HandleRemove(this)" class='closeButtonStyle' value='o'>
            <div id="${task.taskid}" onclick="HandleEditable(this)" onfocusout="HandleChanged(this)" class="entry">
            ${task.value} 
            </div>
        <span class="dtnow">
            <b>#${task.taskid}</b>  [${this.DateString(task.CreatedOn)}] <input id="${task.taskid}" type='checkbox' onclick= "HandleMarkDone(this)" ${status}>
        </span>
        </div>`;
        return tag;
    }

}//cls

//
let sn = new StickyNotes("sn01");

function Load() { 
    debugger;
    //sn = new StickyNotes("sn01");
    sn.LoadRecords((r)=>{
        AddToTable(r);
    });
}//load


function addtask() {
    debugger;
    //sn = new StickyNotes("sn01");
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
}//


function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

//event handler
function HandleEditable(btn){
    btn.contentEditable = true;
}

//event handler
function HandleMarkDone(t){ debugger;
    t.parentElement.parentElement.style.background = "#fff";
    var Id = t.id;
    var bool = t.checked;

    sn.MarkDone(Id,bool);
}

//event handler
function HandleChanged(btn){
    debugger;
    var content = btn.innerHTML;
    var tsk = new Task(btn.id, content);

    sn.UpdateRecord(btn.id,content);
}

//event handler
function handleEnter(e)
{
    if(e.keyCode === 13){
        e.preventDefault(); // Ensure it is only this code that runs

        addtask();
    }
}

//event handler
function HandleRemove(btn) {
    debugger;
    var row = btn.parentNode;
    row.parentNode.removeChild(row);
    //TaskList.pop(parseInt(btn.name));
    //var newList = TaskList.filter(t => t.taskid != btn.name);
    //Sync(newList);
    sn.RemoveRecord(btn.name);
}


function addToTaskList(todoText) {
debugger;
    //var tsk = new Task(sn.NumRecords(), todoText);
    sn.AddRecord(todoText,tsk=>{
        AddToTable(tsk);
    });        
}

function AddToTable(tsk) {
    var innerHTML = sn.TaskAsHtml(tsk);
   //cell1.innerHTML = innerHTML;

    var tasker = document.getElementById("tasker");
    tasker.innerHTML += innerHTML;  //"<center><b>killercodes</b></center>";

    var taskText = document.getElementById('task-text');
    taskText.value = ''
}

//Load
Load();

