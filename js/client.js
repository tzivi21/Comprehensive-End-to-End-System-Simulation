console.log("conect");
function Person(name, unfinished, finished) {
    this.name = name;
    this.unfinished = unfinished;
    this.finished = finished;
};
function Task(title, description, number) {
    this.title = title;
    this.description = description;
    this.number = number;
};
let url = "../html/html.html";
let person = new Person();
let currentUser;
let countTask = 1;
let flagEnterPageList = false;
let users;
let currentTask;
let currentUserData;
let flagFound = false;


const toDoList = {
    pages: [],
    init: function () {
        let main = document.querySelector("main");
        let page = document.getElementById('login');//לשנות ללוג איננ
        var clon = page.content.cloneNode(true);
        main.appendChild(clon);
        let currentPage = 'login';
        history.pushState({}, currentPage, `#${currentPage}`);
        toDoList.pages = document.querySelectorAll('.page');
        document.querySelectorAll('.link').forEach((link) => {
            link.addEventListener('click', toDoList.nav);
        })
        history.replaceState({}, 'login', '#login');
        window.addEventListener('popstate', toDoList.poppin);

    },
    nav: function (ev) {
        ev.preventDefault();
        let hash = `${window.location.hash.substring(1)}1`;
        console.log(hash);
        let currentPage = ev.target.getAttribute('data-target');
        if (hash === "sighin1" && currentPage == "toDoList") {
            let user = {//אובייקט של המשתמש
                name: "",
                mail: "",
                password: ""
            }
            user.name = document.getElementById("name1").value;
            user.mail = document.getElementById("email1").value;
            user.password = document.getElementById("password1").value;
            if (user.name === "" || user.password === "" || user.mail === "") {
                throw new Error("one of the fields are empty");
            }

            let req = new FXMLHttpRequest();
            req.open("GET", "../html/html.html/users");
            req.onload = function () {
                if (req.status == 200 && req.readyState == 4) {
                    users = req.responseText;
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].name == user.name) {
                            document.getElementById("exist").style.display = "block";
                            throw new Error("the user name is already in the system");
                        }
                    }
                    currentUser = user.name;
                    const req2 = new FXMLHttpRequest();
                    req2.open('POST', "../html/html.html/users");
                    req2.setRequestHeader('Content-Type', 'application/json');
                    req2.onload = function () {
                        if (req2.status != 200 && req2.readyState != 4) {
                            throw new Error("can't find the data to change");

                        }
                    }
                    req2.send(JSON.stringify(user));
                    let req3 = new FXMLHttpRequest();
                    req3.open("POST", `../html/html.html/${user.name}`);
                    req3.setRequestHeader('Content-Type', 'application/json');
                    req3.onload = function () {
                        if (req3.status != 200 && req3.readyState != 4) {
                            throw new Error("the user name or password is not correct");
                        }
                        else {
                            currentUserData = new Person(currentUser, [], []);
                            toDoList.buildPage(currentPage);
                        }
                    }
                    req3.send();
                }
            }
            req.send();
        }
        else {
            if (hash === "login1" && currentPage == "toDoList") {
                let user = {//אובייקט של המשתמש
                    name: "",
                    mail: "",
                    password: ""
                }
                user.name = document.getElementById("name2").value;
                user.password = document.getElementById("password2").value;
                if (user.name == "" || user.password == "") {
                    throw new Error("one of the fields is empty");
                }
                let req = new FXMLHttpRequest();
                req.open("GET", "../html/html.html/users");
                req.onload = function () {
                    if (req.status == 200 && req.readyState == 4) {
                        users = req.responseText;
                        for (let i = 0; i < users.length; i++) {
                            if (users[i].name == user.name && users[i].password == user.password) {
                                flagFound = true;
                                break;
                            }
                        }
                        if (flagFound == false) {
                            document.getElementById("wrongAccount").style.display = "block";
                            throw new Error("the user name or password is not correct");

                        }
                        currentUser = user.name;
                        let req2 = new FXMLHttpRequest();
                        req2.open("GET", `../html/html.html/${user.name}`);
                        req2.onload = function () {
                            if (req2.status == 200 && req2.readyState == 4) {
                                currentUserData = req2.responseText;
                                toDoList.buildPage(currentPage);
                            }
                        }
                        req2.send();
                    }
                }
                req.send();
            }
            else {
                toDoList.buildPage(currentPage);
            }

        }
    },
    buildPage: function (currentPage) {
        let main = document.querySelector("main");
        main.innerHTML = "";
        let page = document.getElementById(currentPage);
        let clon = page.content.cloneNode(true);
        main.appendChild(clon);
        console.log(currentPage)
        history.pushState({}, currentPage, `#${currentPage}`);
        document.querySelectorAll('.link').forEach((link) => {
            link.addEventListener('click', toDoList.nav);
        })

        if (currentPage == "toDoList") {
            document.getElementById("current-user").innerHTML = `Hello ${currentUser}`;
            tasksPage();
        }
    },
    poppin: function (ev) {
        let main = document.querySelector("main");
        main.innerHTML = "";
        console.log(location.hash, 'popstate event');
        let hash = location.hash.replace('#', '');
        let page = document.getElementById(hash);
        let clon = page.content.cloneNode(true);
        main.appendChild(clon);
        console.log(hash);
        console.log('אחורה');
    }
}
document.addEventListener('DOMContentLoaded', toDoList.init);
function tasksPage() {
    countTask = 0;
    let taskNumbers = [];
    for (let i = 0; i < currentUserData.unfinished.length; i++) {
        let task = `<div id="${currentUserData.unfinished[i].number}" class="task">
        <div id="task${currentUserData.unfinished[i].number}"><p id="p${currentUserData.unfinished[i].number}">
        ${currentUserData.unfinished[i].title}</p></div>
        <div class="icons"><i id="edit${currentUserData.unfinished[i].number}" class="fas fa-pen-alt"></i>
        <i id="done${currentUserData.unfinished[i].number}" class="fas fa-calendar-check">
        </i><i id="trash${currentUserData.unfinished[i].number}" class="fas fa-trash"></i></div></div>
        <div class="description" id="showdescription${currentUserData.unfinished[i].number}">
        <p><span id="descriptionText${currentUserData.unfinished[i].number}">${currentUserData.unfinished[i].description}</span>
        <i id="closeDescription${currentUserData.unfinished[i].number}" class="fa-solid fa-arrow-up-right-from-square"></i></p></div>`
        document.getElementById("Unfinished-Tasks").insertAdjacentHTML("beforeend", task);
        let hideDecsription = document.getElementById(`showdescription${currentUserData.unfinished[i].number}`);
        hideDecsription.style.display = "none";
        document.getElementById(`task${currentUserData.unfinished[i].number}`).addEventListener("click", showTask);
        document.getElementById(`done${currentUserData.unfinished[i].number}`).addEventListener("click", finishTask);
        document.getElementById(`trash${currentUserData.unfinished[i].number}`).addEventListener("click", deleteTask);
        document.getElementById(`edit${currentUserData.unfinished[i].number}`).addEventListener("click", editTask);
        taskNumbers.push(currentUserData.unfinished[i].number);
    }
    for (let i = 0; i < currentUserData.finished.length; i++) {
        let task = `<div id="${currentUserData.finished[i].number}" class="task"><div id="task${currentUserData.finished[i].number}"><p id="p${currentUserData.finished[i].number}">${currentUserData.finished[i].title}</p></div>
        <div class="icons">
        </i><i id="trash${currentUserData.finished[i].number}" class="fas fa-trash"></i></div></div>`;
        document.getElementById("Finished").insertAdjacentHTML("beforeend", task);
        document.getElementById(`trash${currentUserData.finished[i].number}`).addEventListener("click", deleteTask);
        taskNumbers.push(currentUserData.finished[i].number);
    }
    let max = 0;
    for (let i = 0; i < taskNumbers.length; i++) {
        if (taskNumbers[i] > max) {
            max = taskNumbers[i];
        }

    }
    countTask = max + 1;
    document.getElementById("addTask").addEventListener("click", addTask);
    document.getElementById("buttonAdd").addEventListener("click", addTaskToBoard);
    document.getElementById("buttonSaveChange").addEventListener("click", saveChanges);

}
function addTask() {
    let formAddTask = document.getElementById("formAddTask");
    formAddTask.style.display = "block";
    document.getElementById("opacity").style.opacity = "0.1";
}
function addTaskToBoard() {
    let taskTitle = document.getElementById("taskTitle").value;
    let description = document.getElementById("Description").value;
    let taskData = new Task(taskTitle, description, countTask);
    let req = new FXMLHttpRequest();
    req.open("POST", `../html/html.html/${currentUser}/unfinished/${countTask}`);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function () {
        if (req.status != 200 && req.readyState != 4) {
            throw new Error("the request failed");
        }
        else {
            let task = `<div id="${countTask}" class="task">
            <div id="task${countTask}"><p id="p${countTask}">${taskTitle}</p></div>
            <div class="icons">
            <i id="edit${countTask}" class="fas fa-pen-alt"></i>
            <i id="done${countTask}" class="fas fa-calendar-check"></i><i id="trash${countTask}" class="fas fa-trash"></i></div></div>
            <div class="description" id="showdescription${countTask}">
            <p><span id="descriptionText${countTask}">${description}</span>
            <i id="closeDescription${countTask}" class="fa-solid fa-arrow-up-right-from-square"></i></p></div>`
            let formAddTask = document.getElementById("formAddTask");
            formAddTask.style.display = "none";
            document.getElementById("Unfinished-Tasks").insertAdjacentHTML("beforeend", task);
            let hideDecsription = document.getElementById(`showdescription${countTask}`);
            hideDecsription.style.display = "none";
            document.getElementById(`task${countTask}`).addEventListener("click", showTask);
            document.getElementById(`done${countTask}`).addEventListener("click", finishTask);
            document.getElementById(`trash${countTask}`).addEventListener("click", deleteTask);
            document.getElementById(`edit${countTask}`).addEventListener("click", editTask);
            countTask++;
            document.getElementById("opacity").style.opacity = "1";
            document.getElementById("form1").reset();

        }
    }
    req.send(JSON.stringify(taskData));

}
function showTask(e) {
    let myId = e.currentTarget.parentElement.id;
    document.getElementById(`showdescription${myId}`).style.display = "block";
    document.getElementById(`closeDescription${myId}`).addEventListener("click", closeDescription);
}
function closeDescription(e) {
    e.currentTarget.parentElement.parentElement.style.display = "none";
}
function finishTask(e) {
    let task = `<div id="${e.currentTarget.parentElement.parentElement.id}" class="task">${e.currentTarget.parentElement.parentElement.innerHTML}</div>`;
    let postTask = new Task(e.currentTarget.parentElement.parentElement.textContent, "", e.currentTarget.parentElement.parentElement.id);
    let currentId = e.currentTarget.parentElement.parentElement.id;
    let taskToRemove = e.currentTarget.parentElement.parentElement;
    let req = new FXMLHttpRequest();
    req.open("DELETE", `../html/html.html/${currentUser}/unfinished/${e.currentTarget.parentElement.parentElement.id}`);
    req.onload = function () {
        if (req.status != 200 && req.readyState != 4) {
            throw new Error("the request failed");
        }
        else {
            taskToRemove.remove();
        }
    }
    req.send();
    let req2 = new FXMLHttpRequest();
    req2.open("POST", `../html/html.html/${currentUser}/finished/${e.currentTarget.parentElement.parentElement.id}`);
    req2.onload = function () {
        if (req2.status != 200 && req2.readyState != 4) {
            throw new Error("the request failed");
        }
        else {
            document.getElementById("Finished").insertAdjacentHTML("beforeend", task);
            document.getElementById(`trash${currentId}`).addEventListener("click", deleteTask);
            let check = document.getElementById(`done${currentId}`);
            let edit = document.getElementById(`edit${currentId}`);
            check.remove();
            edit.remove();
        }
    }
    req2.send(JSON.stringify(postTask));
}
function deleteTask(e) {
    let taskCategory = e.currentTarget.parentElement.parentElement.parentElement.id;
    let taskToRemove = e.currentTarget.parentElement.parentElement;
    if (taskCategory == "Unfinished-Tasks") {
        let req = new FXMLHttpRequest();
        req.open("DELETE", `../html/html.html/${currentUser}/unfinished/${e.currentTarget.parentElement.parentElement.id}`);
        req.onload = function () {
            if (req.status != 200 && req.readyState != 4) {
                throw new Error("the request failed");
            }
            else {
                taskToRemove.remove();
            }
        }
        req.send();
    }
    if (taskCategory == "Finished") {
        let req = new FXMLHttpRequest();
        req.open("DELETE", `../html/html.html/${currentUser}/finished/${e.currentTarget.parentElement.parentElement.id}`);
        req.onload = function () {
            if (req.status != 200 && req.readyState != 4) {
                throw new Error("the request failed");
            }
            else {
                taskToRemove.remove();
            }
        }
        req.send();
    }


}
function editTask(e) {
    document.getElementById("opacity").style.opacity = "0.1";
    let formChangeTask = document.getElementById("form-change-task");
    formChangeTask.style.display = "block";
    let currentId = e.currentTarget.parentElement.parentElement.id;
    let title = document.getElementById(`task${currentId}`).textContent;
    let description = document.getElementById(`descriptionText${currentId}`).textContent;
    document.getElementById("newTitle").value = title;
    document.getElementById("newDescription").value = description;
    currentTask = e.currentTarget.parentElement.parentElement;
}
function saveChanges() {
    let newTitle = document.getElementById("newTitle").value;
    let newDescription = document.getElementById("newDescription").value;
    currentId = currentTask.id;
    let newTask = new Task(newTitle, newDescription, currentId);
    let req = new FXMLHttpRequest();
    req.open("PUT", `../html/html.html/${currentUser}/unfinished/${currentId}`)
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function () {
        if (req.status != 200 && req.readyState != 4) {
            throw new Error("the request failed");
        }
        else {
            document.getElementById(`p${currentId}`).textContent = newTitle;
            document.getElementById(`descriptionText${currentId}`).textContent = newDescription;
            let formChangeTask = document.getElementById("form-change-task");
            formChangeTask.style.display = "none";
            document.getElementById("opacity").style.opacity = "1";

        }
    }
    req.send(JSON.stringify(newTask));
}



