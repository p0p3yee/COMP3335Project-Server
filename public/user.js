
(function() {

    function hit(v){
        var salt = decodeIO.bcrypt.genSaltSync(10);
        var hash = decodeIO.bcrypt.hashSync(v, salt);
        console.log(hash);
        return hash;
    }
    

    $("#loginForm").submit(function() {
        $("#loginPassword").val(hit($("#loginPassword").val()));
    });
    
})()