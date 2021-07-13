var video = document.querySelector('#bgVideo video');
// console.log(video);
video.play();
setInterval(function(){
    video.play();
}, 1000);

var filterButton = document.querySelectorAll('.search-filter');
for(var i=0;i<filterButton.length;i++)
{
    filterButton[i].addEventListener('click',function(){
        this.classList.toggle('selected');
    });

    filterButton[i].addEventListener('mousedown',function(){
        this.classList.add('scale-down');
    });

    filterButton[i].addEventListener('mouseup',function(){
        this.classList.remove('scale-down');
    });

}