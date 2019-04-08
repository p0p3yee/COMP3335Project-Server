(function() {
    $("#loginForm").submit(function() {
        $("#loginPassword").val(hit($("#loginPassword").val()));
    });
})()