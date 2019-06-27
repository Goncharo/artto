
$(document).ready(function(){
    updateSystemStateLanding();
    window.setInterval(updateSystemStateLanding, 500);
});

function updateSystemStateLanding(){
    $.get("/state/landing", function(data, status){
        var result = JSON.parse(data);
        if(result.error)
        {
            console.log(result.error);
        }
        else
        {
            $("#subs").text(result.subCount);
            $("#time").text(result.timeState);
        }
    });
}
