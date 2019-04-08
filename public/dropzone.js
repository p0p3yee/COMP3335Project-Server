(function(){
    Dropzone.options.myDropzone = {
        maxFilesize: 50,
        fallback: () => alert("Your browser does not support dropzone..."),
        init() {
            this.on("addedfile", f => console.log("Added File: ", f));
            this.on("error", e => console.error("Error: ", e));
            this.on("processing", p => console.log("Processing: ", p));
            this.on("success", (file, res) => {
                if(res.error != null){
                    alert(res.hash);
                }else{
                    alert(`Error: ${res.error}`);
                }
            })
        }
    };
})()