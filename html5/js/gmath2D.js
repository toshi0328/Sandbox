/////////////////////////////////////////////////////
/* Point                                           */
/*                                                 */
/////////////////////////////////////////////////////
var Point = function(init_x, init_y){
    this.x = init_x;
    this.y = init_y;
    this.distance = function(rhs){
	return Math.sqrt( (this.x - rhs.x)*(this.x - rhs.x) + (this.y - rhs.y)*(this.y - rhs.y) );
    }
}

/////////////////////////////////////////////////////
/* Vector                                          */
/*                                                 */
/////////////////////////////////////////////////////
 var Vector = function(init_arg1, init_arg2){
     if( init_arg1 instanceof Point && init_arg2 instanceof Point ){
	 this.x = init_arg2.x - init_arg1.x;
	 this.y = init_arg2.y - init_arg1.y;
     }
     else{
	 this.x = init_x;
	 this.y = init_y;
     }

     this.length = function(){
	 return Math.sqrt( this.x*this.x + this.y*this.y );
     }

     this.dot = function(rhs){
	 return this.x * rhs.x + this.y * rhs.y;
     }
 }

/////////////////////////////////////////////////////
/* FiniteLine                                      */
/*                                                 */
/////////////////////////////////////////////////////
var FiniteLine = function(init_point1, init_point2){
    this.point1 = init_point1;
    this.point2 = init_point2;
    this.length = function(){
	return this.point1.distance( this.point2 );
    }
    this.intersect = function(target, intersectInfo){
	intersectInfo[0] = null;
	intersectInfo[1] = null;
	intersectInfo[2] = null;
	
	var vec_da = new Vector( this.point1, this.point2);
	var vec_db = new Vector( target.point1, target.point2);
	var vec_ab = new Vector( this.point1, target.point1);

	var absVec_db = vec_db.length()*vec_db.length();
	var absVec_da = vec_da.length()*vec_da.length();
	
	var delta = (absVec_da*absVec_db - vec_da.dot(vec_db)*vec_da.dot(vec_db));
	if( delta < 0.0001){
	    //parallel
	    return false;
	}
	var parameterOnMyself = (absVec_db*vec_ab.dot(vec_da) - vec_da.dot( vec_db )*vec_ab.dot(vec_db)) / delta;
	var parameterOnTarget = (vec_da.dot( vec_db )*vec_ab.dot( vec_da ) - absVec_da*vec_ab.dot( vec_db )) / delta;
	
	if(parameterOnMyself < 0 || 1 < parameterOnMyself ||
	   parameterOnTarget < 0 || 1 < parameterOnTarget){

	    return false;
	}

	// task intersectPoint
	//	intersectInfo[0] = intersectPoint;
	intersectInfo[1] = parameterOnMyself;
	intersectInfo[2] = parameterOnTarget;
	return true;
    }
}

/////////////////////////////////////////////////////
/* Rectangle                                       */
/*                                                 */
/////////////////////////////////////////////////////
var Rectangle = function(init_x, init_y, init_width, init_height){
    this.x = init_x;
    this.y = init_y;
    this.width = init_width;
    this.height = init_height;
    this.center = function(){
	return new Point(this.x + this.width*0.5, this.y + this.height*0.5);
    }
    this.getVertices = function(){
	return new Array( new Point( this.x, this.y),
			  new Point( this.x + this.width, this.y ),
			  new Point( this.x + this.width, this.y + this.height),
			  new Point( this.x, this.y + this.height) );
    }

    this.getFiniteLineAry = function(){
	var vertices = this.getVertices();
	var top = new FiniteLine( vertices[0], vertices[1]);
	var right = new FiniteLine( vertices[1], vertices[2]);
	var bottom = new FiniteLine( vertices[2], vertices[3]);
	var left = new FiniteLine( vertices[3], vertices[0]);
	return new Array( top, right, bottom, left );
    }

    this.collisionCheck = function(currentPoint, newPoint){
    	// return -1:noCollision, 0:top, 1:right, 2:bottom, 3:left
	var checkLine = new FiniteLine(currentPoint, newPoint);
	var rectLineAry = this.getFiniteLineAry();
	var parameterAry = new Array();
	for( var i = 0 ; i < rectLineAry.length ; i++ ){
	    var intersectInfo = new Array();
	    checkLine.intersect(rectLineAry[i], intersectInfo);
	    parameterAry[i] = intersectInfo[1];
	}
	
	// minimum parameter value is collision
	var intersectIndex = -1;
	var minimumParameter = 1.0;
	for( var i = 0 ; i < rectLineAry.length ; i++ ){
	    if( parameterAry[i] != null && minimumParameter > parameterAry[i] ){
		minimumParameter = parameterAry[i];
		intersectIndex = i;		
	    }
	}
	return intersectIndex;
    }
}
