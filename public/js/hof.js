var page = 2;

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

$(document).ready(function() {
    
    //Options for spinner plugin
    var opts = {
          lines: 13 // The number of lines to draw
        , length: 28 // The length of each line
        , width: 5 // The line thickness
        , radius: 42 // The radius of the inner circle
        , scale: 0.5 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#000' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1.2 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '80%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: true // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'relative' // Element positioning
    }
    
    var target = document.getElementById('submissions');

    $(window).scroll(function () { 
        
       if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
            
            var spinner = new Spinner(opts).spin();
            target.appendChild(spinner.el);

            
            $.get("/hofPage?page=" + page, function(data, status){
                spinner.stop();
                var result = JSON.parse(data);
                if(result.error)
                {
                    console.log(result.error);
                    spinner.stop();
                }
                else
                {
                    result.docs.forEach(submission =>{
                        $("#submissions").append(`

                            <div class="col-md-12">
                                <div class="thumbnail">
                                    <div class="caption-full">
                                        <h2 style="text-align: center;">${submission.title}</h2>
                                        
                                    </div>
                                    <img class="img-responsive img-thumbnail" src="/hof/${submission._id}.png" alt="submission">
                                    <div class="caption-full">
                                        
                                        <h4 style="text-align: center;">Estimated value: $${submission.value.value / 100}</h4>
                                        <p style="text-align: center;">
                                            <em>Submitted by: ${submission.artist.username} on ${submission.dateSubmitted.toLocaleString()}</em>
                                        </p>
                                    </div>
                                        
                                </div>
                            </div>
                            
                        `);
                    });

                    page++;
                    spinner.stop();
                    
                }
                
            });
          
       }
       
    });

});
