
$(document).ready(function(){
    updateSystemStateHome();
    window.setInterval(updateSystemStateHome, 500);
});

function updateSystemStateHome(){
    $.get("/state/home", function(data, status){
        var result = JSON.parse(data);
        if(result.error)
        {
            console.log(result.error);
        }
        else
        {
            $("#subs").text(result.subCount);
            $("#curState").text(result.curState);
            $("#prevState").text(result.prevState);
            $("#time").text(result.timeState);
        }
    });
}
