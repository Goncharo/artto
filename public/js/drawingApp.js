var lc = LC.init(
    document.getElementsByClassName('my-drawing')[0],
    {
        imageURLPrefix: '/literallycanvas/img',
        imageSize: {width: 1024, height: 576},
        backgroundColor: 'white',
        zoomMin: 0.2,
        zoomMax: 4
    }
);

var count = 60;
var display;

window.onload = function () {
    $("#submitButton").click(submitArt);
    display = document.querySelector('#time');
    display.textContent = count; 
    setInterval(timer, 1000);
};


function submitArt()
{
    
    var form = document.querySelector('#imageForm');
    var imgText = document.querySelector('#img');
    console.log(lc.getImage().toDataURL());
    imgText.value = lc.getImage().toDataURL();
    form.submit();
}

function timer() {
  if (count>0)
  {
    count--;
  }
  display.textContent = count; 
  if (count <= 0)
  {
    submitArt();
  }
}
