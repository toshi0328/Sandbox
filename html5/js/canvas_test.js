// canvas objects
var gMainCanvas = null;
var gMainContext = null;

// display condition
var gImage = null;
var gDisplayCondition = null;

onload = function(){
    initCanvas();
    loadImage("pics/sample1.jpg");
    initDisplayContidition();
    draw();
};

///////////////////
// call back




///////////////////
// function
function initCanvas(){
    gMainCanvas = document.getElementById('main_canvas');
    if( !gMainCanvas || !gMainCanvas.getContext ){
	return false;
    }
    gMainCanvas.width = 300;
    gMainCanvas.height = 300;
    gMainContext = gMainCanvas.getContext('2d');

    gImage = new Image();
}

function loadImage(imagePath){
    gImage.src = imagePath;
}

function initDisplayContidition(){
    gDisplayCondition = new DisplayCondition(gImage);    
}

function draw(){
    gDisplayCondition.draw( gMainContext, gImage );
}

///////////////////////////
// objects
var DisplayCondition = function(targetImage){
    var init_center = new Point(0,0);
    if( targetImage != null ){
	init_center.x = targetImage.width * 0.5;
	init_center.y = targetImage.height * 0.5;
    }
    this.center = init_center;
    this.zoom = 1.0;
    
    this.draw = function(context, img){
	

	//	context.drawImage(img, 0, 0, gMainCanvas.width, gMainCanvas.height);
    }
}