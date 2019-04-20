(function(){
    Dropzone.options.myDropzone = {
        paramName: "file",
        maxFilesize: 50,
        maxFiles: 5,
        chunking: true,
        dictDefaultMessage: "Drop Files Here to Upload<br>Maximum Size: <b>50 MB</b>",
        accept: (file, done) => {
            console.log("Accept here: ", file);
            done();
        },
        fallback: () => alert("Your browser does not support dropzone..."),
        init() {
            // this.on("addedfile", f => console.log("Added File: ", f));
            // this.on("error", e => console.error("Error: ", e));
            // this.on("processing", p => console.log("Processing: ", p));
            this.on("success", (file, res) => {
                if(res.error == null){
                    alert(`${res.name} Uploaded.\nHash: ${res.hash}`);
                }else{
                    alert(`Error: ${res.error}`);
                }
            })
        }
    };
})()