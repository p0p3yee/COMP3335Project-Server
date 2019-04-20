(function(){
    Dropzone.options.myDropzone = {
        paramName: "file",
        maxFilesize: 50,
        maxFiles: 5,
        dictDefaultMessage: "Drop Files Here to Upload<br>Maximum Size: <b>50 MB</b>",
        accept: (file, done) => {
            if(file.name.length >= 250){
                return done("File Name too long.")
            }
            done();
        },
        fallback: () => alert("Your browser does not support dropzone..."),
        init() {
            // this.on("addedfile", f => console.log("Added File: ", f));
            // this.on("error", e => console.error("Error: ", e));
            // this.on("processing", p => console.log("Processing: ", p));
            this.on("success", (file, res) => {
                if(res.error == null){
                    alert(`${res.name} Uploaded.\nID: ${res.id}`);
                }else{
                    alert(`Error: ${res.error}`);
                }
            })
        }
    };
})()