var kMainLoopInterval = 10;
var kStageWidth  = 400;
var kStageHeight = 400;
var kStageBorderWidth  = 10;
var kPaddleWidth = 90;
var kPaddleHeight = 20;

var kBlockColumnCount = 12;
var kBlockWidth = (kStageWidth - 2*kStageBorderWidth ) / kBlockColumnCount;
var kBlockHeight = 20 ;

var kBlockColors = new Array("white", "black", "yellow", "lime", "cyan");
var kPaddleColor = "pink";
var kBallColor = "green";

// Drawing Objects
var gCanvasElement = null;
var gCanvasContext = null;

// Game Objects
var gPaddle = null;
var gBall = null;
var gBorders = null;
var gBlocks = null;

var gGameProgress  = 0; // 0:preparing, 1:befor game 2:game play, 3:game over, 4 :game clear
var gGameLoopCount = 0 ;

var gKeyStatus = 0 ; //0:nothing, 1:leftpressed, 2:rightpressed

// start main loop
intervalTimer = setInterval("mainLoop()", kMainLoopInterval);

// game main loop
function mainLoop()
{
    if( gGameProgress == 1 ){
	draw_canvas_starting();
    }else if( gGameProgress == 2 ){
	updateGameStatus();
	draw_canvas_in_gameprogress();    
    }
    gGameLoopCount++;
}

function updateGameStatus()
{
    var movingDelta = 5;
    // check keyStatus
    if(gKeyStatus == 2){
	gPaddle.move(movingDelta, gBall);
    }else if(gKeyStatus == 1){
	gPaddle.move(-movingDelta, gBall);
    }

    var allBlockAry = gBorders.concat( [gPaddle] );
    allBlockAry = allBlockAry.concat( gBlocks );

    gBall.move(allBlockAry);
}

function getKeyCode(event)
{
    return event.keyCode
}

// event callback
function onKeyDown(nsEvent)
{
    var keyCode = getKeyCode(nsEvent);
    if(gGameProgress == 1){
	if(keyCode == 32){ //space
	    newGame();
	}
    }
    if(gGameProgress == 2){
	if( keyCode == 39 ){ // right
	    gKeyStatus = 2;	
	}else if( keyCode == 37){ // left
	    gKeyStatus = 1;
	}else if( keyCode == 32 && gGameLoopCount > 100){ // space
	    if( gBall.isStopped() == true){
		gBall.start();
	    }
	} 
    }
}

function onKeyUp(nsEvent)
{
    var keyCode = getKeyCode(nsEvent);
    if(keyCode == 39 || keyCode == 37)
    {
	gKeyStatus = 0;
    }
}

var Block = function(init_x, init_y, init_width, init_height, init_strength){
    this.rect = new Rectangle(init_x, init_y, init_width, init_height);
    this.strength = init_strength; // -1:never broken

    this.move = function(delta_x, attachedBall){
	if( this.strength != -2 ) return ; 

	this.rect.x += delta_x;
	var min_x = kStageBorderWidth;
	var max_x = kStageWidth - kStageBorderWidth - this.rect.width;
	this.rect.x = Math.max( min_x, this.rect.x);
	this.rect.x = Math.min( max_x, this.rect.x);
	if(attachedBall.isStopped()){
	    attachedBall.center.x = this.rect.center().x;
	}
    }

    this.draw = function(context)
    {
	if(this.strength == 0) return ;

	block_color = kBlockColors[0];
	if(this.strength == -2){
	    block_color = kPaddleColor;
	}else if(this.strength == -1){
	   block_color = kBlockColors[1];
	}else if(this.strength == 1){
	    block_color = kBlockColors[2];
	}else if(this.strength == 2){
	    block_color = kBlockColors[3];
	}else if(this.strength == 3){
	    block_color = kBlockColors[4];
	}
	gCanvasContext.fillStyle = block_color;
	gCanvasContext.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
	
	if( this.strength > 0 ){
	    gCanvasContext.strokeStyle = "black";
	    gCanvasContext.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
	}
    }
    this.ballhit = function(){
	if(this.strength > 0){
	    this.strength -= 1;
	}
    }
}

var Ball = function(init_x_center, init_y_center){
    this.radius = 8;
    this.center = new Point(init_x_center, init_y_center) ; 
    this.x_velocity = 0;
    this.y_velocity = 0;

    this.isStopped = function(){
	if( this.x_velocity == 0 && this.y_velocity == 0 ){
	    return true;
	}
	return false;
    }
    this.start = function(){
	var initVelocityLength = 2;
	this.x_velocity = -initVelocityLength*Math.sin(Math.PI/4.0);
	this.y_velocity = -initVelocityLength*Math.cos(Math.PI/4.0);
    }
    this.draw = function(context){
	context.fillStyle = kBallColor;
	context.beginPath();
	context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2.0, true);
	context.fill();
    }
    this.checkCollision = function( block )
    {
	if( block.strength == 0 ) return -1 ;

	var new_center = new Point();
	new_center.x = this.center.x + this.x_velocity;
	new_center.y = this.center.y + this.y_velocity;
	// return -1:noCollision, 0:top, 1:right, 2:bottom, 3:left
	return block.rect.collisionCheck(this.center, new_center);
    }
    this.move = function(blockAry){
	if( this.isStopped() ) return ;
	// collision
	for(var i = 0 ; i < blockAry.length; i++){
	    var collision_status = this.checkCollision( blockAry[i] );
	    if( collision_status != -1 ){
		if( collision_status == 0 || collision_status == 2 ){
		    this.y_velocity *= -1.0;
		}else if( collision_status == 1 || collision_status == 3 ){
		    this.x_velocity *= -1.0;
		}
		blockAry[i].ballhit();
		break;
	    }
	}
	// new position 
	this.center.x += this.x_velocity;
	this.center.y += this.y_velocity;
    }
}

// drawing
function clear_canvas(){
    gCanvasElement.width = gCanvasElement.width;
}

function draw_background(){
    var gradient = gCanvasContext.createLinearGradient(0,0,kStageWidth,kStageHeight);
    gradient.addColorStop(0,"lightgray");
    gradient.addColorStop(1,"dimgray");
    gCanvasContext.fillStyle = gradient;
    gCanvasContext.fillRect(0,0,kStageWidth,kStageHeight);
}

var gShowText = true;
function draw_canvas_starting(){
    clear_canvas();
    draw_background();
    /*
    if(gGameLoopCount%60 == 0){
	gShowText = !gShowText;
    }
    */
    if(gShowText){
	gCanvasContext.font = "bold 12px sans-serif";
	//	gCanvasContext.textAlign = "center";	
	//	gCanvasContext.fillText("Press Space-Key to start game", kStageWidth*0.5, kStageHeight*0.5);
	gCanvasContext.fillText("Press Space-Key to start game", 50, 50);
    }
}

function draw_canvas_in_gameprogress(){
    clear_canvas();
    draw_background();
    for( var i = 0; i < gBorders.length; i++){
	gBorders[i].draw(gCanvasContext);
    }
    for( var i = 0; i < gBlocks.length; i++){
	gBlocks[i].draw(gCanvasContext);
    }
    gPaddle.draw(gCanvasContext);
    gBall.draw(gCanvasContext);
}

// initializing
function newGame(){
    gGameProgress = 0 ;
    
    init_x = (kStageWidth * 0.5 - kPaddleWidth*0.5);
    init_y = (kStageHeight - 2 * kPaddleHeight);
    gPaddle = new Block(init_x, init_y, kPaddleWidth, kPaddleHeight, -2);

    gBall = new Ball(kStageWidth *0.5, gPaddle.rect.y - 8);

    gBorders = new Array();
    gBorders[0] = new Block(0, 0, kStageWidth, kStageBorderWidth, -1);
    gBorders[1] = new Block(0, 0, kStageBorderWidth, kStageHeight, -1);
    gBorders[2] = new Block(kStageWidth - kStageBorderWidth , 0, kStageBorderWidth, kStageHeight, -1);

    var blockOrigine = new Point( kStageBorderWidth, kStageBorderWidth );
    var blockAlignment = [[0,0,0,0,0,0,0,0,0,0,0,0],
			  [0,1,2,1,1,2,2,1,1,2,1,0],
			  [0,1,1,1,2,2,2,2,1,1,1,0],
			  [0,1,1,2,2,2,2,2,2,1,1,0],
			  [0,1,2,2,2,2,2,2,2,2,1,0],
			  [0,1,1,1,1,1,1,1,1,1,1,0],
			  [0,0,0,0,0,0,0,0,0,0,0,0]];

    gBlocks = new Array();
    for( var rowIdx = 0 ; rowIdx < blockAlignment.length ; rowIdx++ ){
	for( var colIdx = 0 ; colIdx < kBlockColumnCount ; colIdx++ ){
	    var value = blockAlignment[rowIdx][colIdx];
	    if( value > 0){
		var x = kStageBorderWidth + colIdx * kBlockWidth ;
		var y = kStageBorderWidth + rowIdx * kBlockHeight ;
		var addingIdx = gBlocks.length;
		gBlocks[addingIdx] = new Block( x,y, kBlockWidth, kBlockHeight, value ) ;
	    }
	}
    }
    
    gGameProgress = 2;
    gGameLoopCount = 0;
}

function initGame()
{
    gGameProgress = 0;

    gCanvasElement = document.createElement("canvas");
    gCanvasElement.id = "stage_canvas";
    document.body.appendChild(gCanvasElement);
    
    gCanvasElement.width = kStageWidth;
    gCanvasElement.height = kStageHeight;
    gCanvasContext = gCanvasElement.getContext("2d");

    window.onkeydown = onKeyDown;
    window.onkeyup   = onKeyUp;

    gGameProgress = 1;
 }
