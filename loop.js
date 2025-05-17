let msPrev = window.performance.now();
const fps = 60;
const msPerFrame = 1000 / fps;


class Vertex{
    constructor(pos, r=10){
        this.position = pos;
        this.radius = r;
    }
}


function point_line_checker(lineStart , lineEnd, pointPos)  //https://www.jeffreythompson.org/
{
    //distance b/w point and the two end points of the line
    let dist1 = vec_mag(vec_sub(lineStart,pointPos));
    let dist2 = vec_mag(vec_sub(lineEnd,pointPos));
    let lineLen = vec_mag(vec_sub(lineEnd,lineStart));
    let buffer = 0.2;
    if(dist1+dist2 >= lineLen-buffer && dist1+dist2 <= lineLen+buffer )
    {
      return true;
    }
    return false;
}

/*==================Creating and editing polygons====================

1.start with a Triangle object already placed
2.when the mouse button is clicked,
  i. check if it is intersecting any edge, if yes then insert a point between the the two end vertices and essentially create two new edges
  ii.if its not intersecting any edge, check if a "incomplete" shapes, if yes then add the point to that shape











=======================================================================*/



//array of polygons
let polygon_arr =[];

//starting vertices polygon
let vertex_arr = [new Vertex(new Vec2d(74,62))   , new Vertex(new Vec2d(1814,71))  , new Vertex(new Vec2d(1829,851)) , new Vertex(new Vec2d(75,847)) ];

polygon_arr.push(vertex_arr);

//=========== Dragging Vertex with mouse Logic (to be reused in the future )===========================================================//
let mousePoint = new Vec2d(0,0);
let isDragging = false;
let dragOffset = new Vec2d(0,0);
let selected_vertex = null;



// Mouse down
canvas.addEventListener("mousedown", (e) => {

  //iterate through the points
  for(let j = 0; j<polygon_arr.length;j++){

    for(let i=0; i<polygon_arr[j].length;i++)
      {
          if (point_checker_circle(mousePoint, polygon_arr[j][i].position, polygon_arr[j][i].radius)) 
          {
              isDragging = true;
              dragOffset = vec_sub(mousePoint ,polygon_arr[j][i].position);
              selected_vertex =polygon_arr[j][i];
              console.log("dragging set");
              return;
          }
      }

  }
     //else spawn a new vertex
        //first check if its between any line segment
        for(let j = 0; j<polygon_arr.length;j++){

          for(let i=0;i<polygon_arr[j].length;i++)
          {
            if(point_line_checker(polygon_arr[j][i].position, polygon_arr[j][(i+1)%polygon_arr[j].length].position, mousePoint))
            {
                console.log("can create a point");
                polygon_arr[j].splice((i+1)%polygon_arr[j].length ,0, new Vertex(new Vec2d(mousePoint.x,mousePoint.y)) );
                return; //important because you are modifying the array that you are iterating over
                
            }
          }
        }
          
        //if not then create a new triangle and add it to the polygon list

        polygon_arr.push([
          new Vertex(new Vec2d(mousePoint.x,mousePoint.y-50)),
          new Vertex(new Vec2d(mousePoint.x-50,mousePoint.y+50)),
          new Vertex(new Vec2d(mousePoint.x+50,mousePoint.y+50))
        ])

});
//mousemove (updates the global mousePoint variable as well as handles the dragging logic)
 canvas.addEventListener("mousemove", (e) => {
    mousePoint.x= e.clientX;
    mousePoint.y= e.clientY;
    if (isDragging ) {
     
        //calculate the delta
        let delta = vec_sub(mousePoint , dragOffset);
       // selected_vertex.position = vec_sub(mousePoint,delta); //i think this needs to be integrated but leaving for now  
       //selected_vertex.position = mousePoint; //this passes by reference as both are objects instead see the next line
       selected_vertex.position = new Vec2d(mousePoint.x, mousePoint.y); 
        console.log("currently dragging");
    }
});


// Mouse up
canvas.addEventListener("mouseup", () => {
  isDragging = false;
  selected_vertex= null;
  console.log("dragging finished");
});


//======================================================================================================================================//





function Loop(){

    animationID = requestAnimationFrame(Loop);
    
         //=======handle timing===================//
        let msNow = window.performance.now();
        let dt = msNow - msPrev;
    
        if(dt < msPerFrame) return
        let excessTime = dt % msPerFrame
        msPrev = msNow - excessTime
        msPrev = msNow;
        dt=dt/1000;
       
       //==========================================//
        
       
        //clear screen
            ctx.beginPath();
            ctx.fillStyle = "#e6e6e6";
            ctx.fillRect(0,0,canvas.width ,canvas.height);
                  

       
            
        //draw them vertex
          for(let j =0 ; j<polygon_arr.length;j++){
            for(let i=0; i<polygon_arr[j].length;i++)
              {
                FillCircle(polygon_arr[j][i].position,1,"red");
                DrawCircle(polygon_arr[j][i].position,polygon_arr[j][i].radius,point_checker_circle(mousePoint,polygon_arr[j][i].position,polygon_arr[j][i].radius)?"yellow":"red");
                point_line_checker(polygon_arr[j][i].position, polygon_arr[j][(i+1)%polygon_arr[j].length].position, mousePoint)? DrawLine(polygon_arr[j][i].position,polygon_arr[j][(i+1)%polygon_arr[j].length].position,"red") 
                 : DrawLine(polygon_arr[j][i].position,polygon_arr[j][(i+1)%polygon_arr[j].length].position,"black") ;
              }
            }
          
      console.log(polygon_arr);
      
                
               
               

    }

    
    Loop();
    