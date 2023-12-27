function UrlFields(myUrl, name, numberOFtask, typeOfTask) {
    this.myUrl = myUrl;
    this.name = name;
    this.numberOFtask = numberOFtask;
    this.typeOfTask = typeOfTask;
};
function traetRequest(thisObj, data) {
    if (thisObj.method == "POST") {
        post(thisObj, data);
    }
    if (thisObj.method == "GET") {
        get(thisObj);
    }
    if (thisObj.method == "PUT") {
        put(thisObj, data);
    }
    if (thisObj.method == "DELETE") {
        Delete(thisObj);
    }
}
function analyzeUrl(urlFields1, thisObj) {
    urlFields1.myUrl = urlFields1.myUrl.slice(url.length, thisObj.url.length);
    let data1 = urlFields1.myUrl.substr(urlFields1.myUrl.lastIndexOf("/") + 1);
    urlFields1.myUrl = urlFields1.myUrl.slice(0, urlFields1.myUrl.lastIndexOf("/"));
    if (urlFields1.myUrl == "") {
        urlFields1.name = data1;
    }
    else {
        let data2 = urlFields1.myUrl.substr(urlFields1.myUrl.lastIndexOf("/") + 1);
        urlFields1.myUrl = urlFields1.myUrl.slice(0, urlFields1.myUrl.lastIndexOf("/"));
        if (urlFields1.myUrl == "") {
            urlFields1.typeOfTask = data1;
            urlFields1.name = data2;
        }
        else {
            let data3 = urlFields1.myUrl.substr(urlFields1.myUrl.lastIndexOf("/") + 1);
            urlFields1.myUrl = urlFields1.myUrl.slice(0, urlFields1.myUrl.lastIndexOf("/"));
            if (urlFields1.myUrl == "") {
                urlFields1.name = data3;
                urlFields1.typeOfTask = data2;
                urlFields1.numberOFtask = data1;
            }
        }
    }
}
function post(thisObj, data) {
    let myUrlFields = new UrlFields(thisObj.url);
    analyzeUrl(myUrlFields, thisObj);
    if (myUrlFields.name == "users") {
        putUsers(thisObj, data);
        return;
    }
    if (!myUrlFields.typeOfTask && !myUrlFields.name && !myUrlFields.numberOFtask) {
        errorRequest(thisObj);
        return;
    }
    if (myUrlFields.name && !myUrlFields.typeOfTask && !myUrlFields.numberOFtask) {
        addPerson(thisObj, myUrlFields);
        return;
    }
    else {
        addNewTask(thisObj, myUrlFields, data);
    }
}
function put(thisObj, data) {
    let myUrlFields = new UrlFields(thisObj.url);
    analyzeUrl(myUrlFields, thisObj);
    if (!myUrlFields.typeOfTask || !myUrlFields.name || !myUrlFields.numberOFtask) {
        errorRequest(thisObj);
        return;
    }
    if (myUrlFields.typeOfTask == "finished") {
        errorRequest(thisObj);
        return;
    }
    updatingTask(thisObj, data, myUrlFields);
}
function get(thisObj) {
    let myUrlFields = new UrlFields(thisObj.url);
    analyzeUrl(myUrlFields, thisObj);
    if (myUrlFields.name == "users") {
        getAllUsers(thisObj);
        return;
    }
    if (myUrlFields.name && myUrlFields.typeOfTask && !myUrlFields.numberOFtask) {
        getSpecificTypeOfTasks(thisObj, myUrlFields);
        return;
    }
    if (myUrlFields.name && !myUrlFields.typeOfTask && !myUrlFields.numberOFtask) {
        getAllUserData(thisObj, myUrlFields);
        return;
    }
    if (myUrlFields.name && myUrlFields.typeOfTask && myUrlFields.numberOFtask) {
        getSpecificTask(thisObj, myUrlFields);
        return;
    }
    if (!myUrlFields.name && !myUrlFields.typeOfTask && !myUrlFields.numberOFtask) {
        getAllUsersData(thisObj);
        return;
    }
}
function Delete(thisObj) {
    let myUrlFields = new UrlFields(thisObj.url);
    analyzeUrl(myUrlFields, thisObj);
    if (!myUrlFields.typeOfTask || !myUrlFields.name || !myUrlFields.numberOFtask) {
        errorRequest(thisObj);
        return;
    }
    deleteSpecificTask(thisObj, myUrlFields);
}
function successRequest(thisObj) {
    thisObj.readyState = 4;
    thisObj.status = 200;
}
function errorRequest(thisObj) {
    thisObj.readyState = 5;
    thisObj.status = 300;
    throw "error processing the request";
}