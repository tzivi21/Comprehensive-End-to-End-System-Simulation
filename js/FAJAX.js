console.log("servsr conect");

let FXMLHttpRequest = class {
    constructor() {
        this.url = "";
        this.method = "";
        this.status = 0;
        this.readyState;
        this.responseText = "";
        this.headers = [];
        this.onload;
    }
    setRequestHeader(contentType, string) {
        let header = {
            name: contentType,
            content: string
        }
        this.headers.push(header);
    }
    open(method, url) {
        this.method = method;
        this.url = url;
    }
    send(data) {
        setTimeout(() => {
            network(this, data);
            try {
                this.onload();
            }
            catch (error) {
                console.log(error);
            }
        }, 0);
    }
}
