console.log("db conect");
function setData(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}
function getData(name) {
    let data = JSON.parse(localStorage.getItem(name));
    return data;
}
function putUsers(thisObj, data) {
    let users = getData("users");
    if (users === null) {
        users = [];
    }
    users.push(JSON.parse(data));
    setData("users", users);
    successRequest(thisObj);
    return;
}
function addPerson(thisObj, myUrlFields) {
    let person = new Person(myUrlFields.name, [], []);
    setData(myUrlFields.name, person);
    successRequest(thisObj);
    return;
}
function addNewTask(thisObj, myUrlFields, data) {
    data = JSON.parse(data);
    let userData = getData(myUrlFields.name);
    if (myUrlFields.typeOfTask == "unfinished") {
        userData.unfinished.push(data);
    }
    if (myUrlFields.typeOfTask == "finished") {
        userData.finished.push(data);
    }
    setData(myUrlFields.name, userData);
    successRequest(thisObj)
}
function getAllUsers(thisObj) {
    let users = getData("users");
    if (users == null) {
        setData("users", []);
        thisObj.responseText = [];
        successRequest(thisObj);
        return;
    }
    thisObj.responseText = users;
    successRequest(thisObj);
    return;
}
function deleteSpecificTask(thisObj,myUrlFields){
    let userData = getData(myUrlFields.name);
    if (myUrlFields.typeOfTask == "unfinished") {
        let flagFound = false;
        for (let i = 0; i < userData.unfinished.length; i++) {
            if (userData.unfinished[i].number == myUrlFields.numberOFtask) {
                userData.unfinished.splice(i, 1);
                successRequest(thisObj);
                flagFound = true;
                setData(myUrlFields.name,userData);
                return;
            }
        }
        if (!flagFound) {
           errorRequest(thisObj);
            return;
        }
    }
    if (myUrlFields.typeOfTask == "finished") {
        let flagFound = false;
        for (let i = 0; i < userData.finished.length; i++) {
            if (userData.finished[i].number == myUrlFields.numberOFtask) {
                userData.finished.splice(i, 1);
                successRequest(thisObj);
                flagFound = true;
                setData(myUrlFields.name,userData);
                return;
            }
        }
        if (!flagFound) {
            errorRequest(thisObj);
            return;
        }
    }
}
function getAllUsersData(thisObj) {
    thisObj.responseText = [];
    for (let i = 0; i < localStorage.length; i++) {
        thisObj.responseText.push(JSON.parse(getData(localStorage.key(i))))
    }
}
function getSpecificTask(thisObj, myUrlFields) {
    let data = getData(myUrlFields.name);
    if (myUrlFields.typeOfTask == "unfinished") {
        data = data.unfinished;
        let flagFound = false;
        for (let i = 0; i < data.length; i++) {
            if (data[i].number == myUrlFields.numberOFtask) {
                thisObj.responseText = data[i];
                successRequest(thisObj);
                flagFound = true;
                return;
            }
        }
        if (!flagFound) {
            errorRequest(thisObj);
        }
    }
    if (myUrlFields.typeOfTask == "finished") {
        data = data.finished;
        let flagFound = false;
        for (let i = 0; i < data.length; i++) {
            if (data[i].number == myUrlFields.numberOFtask) {
                thisObj.responseText = data[i];
                successRequest(thisObj);
                flagFound = true;
                return;
            }
        }
        if (!flagFound) {
            errorRequest(thisObj);
        }
    }
}
function getAllUserData(thisObj, myUrlFields) {
    let data = getData(myUrlFields.name);
    if (data == null) {
        let user = new Person();
        user.name = myUrlFields.name;
        user.finished = [];
        user.unfinished = [];
        setData(myUrlFields.name, user);
        thisObj.responseText = user;
        successRequest(thisObj);
        return;
    }
    successRequest(thisObj);
    thisObj.responseText = data;
}
function getSpecificTypeOfTasks(thisObj, myUrlFields) {
    let data = getData(myUrlFields.name);
    if (data == null) {
        errorRequest(thisObj);
        return;
    }
    if (myUrlFields.typeOfTask == "unfinished") {
        thisObj.responseText = data.unfinished;
    }
    if (myUrlFields.typeOfTask == "finished") {
        thisObj.responseText = data.finished;
    }
    successRequest(thisObj);
}
function updatingTask(thisObj, data, myUrlFields) {
    data = JSON.parse(data);
    let person = getData(myUrlFields.name);
    let flagFound = false;
    for (let i = 0; i < person.unfinished.length; i++) {
        if (person.unfinished[i].number == myUrlFields.numberOFtask) {
            person.unfinished[i].title = data.title;
            person.unfinished[i].description = data.description;
            successRequest(thisObj);
            flagFound = true;
            setData(myUrlFields.name, person);
            return;
        }
    }
    if (!flagFound) {
        errorRequest(thisObj);
    }
}