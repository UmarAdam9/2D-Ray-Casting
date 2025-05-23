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
let vertex_arr = [new Vertex(new Vec2d(74,62))   , new Vertex(new Vec2d(1814,71))  , new Vertex(new Vec2d(1829,851)) , new Vertex(new Vec2d(75,847)) ]; //the boundary
let vertex_arr2 = [new Vertex(new Vec2d(450,251)) , new Vertex(new Vec2d(400,351)) , new Vertex(new Vec2d(500,351))  ]; //add triangle

polygon_arr.push(vertex_arr);
polygon_arr.push(vertex_arr2);



let enable_rays = false;

//eventlistener to toggle enable_rays
document.addEventListener('keypress', (e) => {
  
      if (e.key === 'Enter') 
        enable_rays = !enable_rays;
});


let closestHit = Number.MAX_VALUE;
let closestPoint = null;

let intersection_arr =[];

 


//eventlistener to delete the most recent shape in the array
document.addEventListener('keypress', (e) => {
  
      if (e.key === 'z') 
        polygon_arr.pop();
});





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
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,canvas.width ,canvas.height);



            
       
                  

       
            
    


            

        //for every vertex
          //draw a line to the vertex
          //check if this line intersects with any another line in the scene
            //if yes then add the intersection point to the array
            //else add the vertex itself to the array
            //finally draw line from mousepoint to the vertices in the array




            //Aukayyy so its working
            if(enable_rays){
              

              //populate the intersection array
              for(let j =0 ; j<polygon_arr.length;j++){
                for(let i=0; i<polygon_arr[j].length;i++)
                  {
                        //mousePoint
                        //polygon_arr[j][i].position

                      //for every line in the scene (so essentially 2 more for loops lol) do 3 tests

                      let BaseVertex = new Vec2d(polygon_arr[j][i].position.x , polygon_arr[j][i].position.y);
                      let Baseangle = Math.atan2(BaseVertex.y - mousePoint.y, BaseVertex.x - mousePoint.x);
                      
                      let vertexA = null;
                      let Angle_A=null;

                      for(let x=0; x<3 ;x++)
                      {
                        if(x == 0)
                          Angle_A = Baseangle;

                        if(x == 1)
                          Angle_A = Baseangle + 0.01;

                        if(x == 2)
                          Angle_A = Baseangle - 0.01;


                           vertexA = new Vec2d(Math.cos(Angle_A) , Math.sin(Angle_A));
                           vertexA = vec_normalise(vertexA);
                           vertexA = vec_multiply(vertexA,10000);
                           vertexA = vec_add(mousePoint,vertexA);
                          for(let k =0 ; k<polygon_arr.length;k++)
                            {
                              for(let m=0 ; m<polygon_arr[k].length;m++)
                              {

                                //get the next vertex 
                                let p1 = polygon_arr[k][m].position;
                                let p2 = polygon_arr[k][(m+1) % polygon_arr[k].length].position;
                                

                                let intersection = Line_Intersection_finite(mousePoint,vec_sub(vertexA,mousePoint) ,p1,vec_sub(p2,p1));
                                if(intersection)
                                  {
                            
                                    //check if its the closest intersection
                                      if(vec_mag(vec_sub(intersection,mousePoint)) < closestHit)
                                      {
                                        closestHit = vec_mag(vec_sub(intersection,mousePoint));
                                        closestPoint = new Vec2d(intersection.x,intersection.y);
                                      }
                                        
                                    
                                  }
                              }
                          }
                          if (closestPoint)
                          intersection_arr.push(closestPoint);
                        

                          closestHit = Number.MAX_VALUE;
                          closestPoint = null;
                        
                      }

                }
            }



             //Draw lines to the points in the array
             if(intersection_arr.length)
             {

             //sort the array of intersection points based on the angle it makes together with the mousepoint
             intersection_arr.sort((a,b)=>{
                 const angleA = Math.atan2(a.y - mousePoint.y, a.x - mousePoint.x);
                // Calculate the angle for point 'b'
                const angleB = Math.atan2(b.y - mousePoint.y, b.x - mousePoint.x);
                // Compare the angles
                return angleA - angleB;
             })




                for(let i=0; i< intersection_arr.length;i++)
                {

                  FillTriangle(mousePoint,intersection_arr[i] , intersection_arr[(i+1)%intersection_arr.length] , "yellow ","yellow");
                 
                }
             }

    
            }















            //draw them vertex
              for(let j =0 ; j<polygon_arr.length;j++){
                for(let i=0; i<polygon_arr[j].length;i++)
                  {
                    FillCircle(polygon_arr[j][i].position,1,"red");
                    DrawCircle(polygon_arr[j][i].position,polygon_arr[j][i].radius,point_checker_circle(mousePoint,polygon_arr[j][i].position,polygon_arr[j][i].radius)?"yellow":"red");
                    point_line_checker(polygon_arr[j][i].position, polygon_arr[j][(i+1)%polygon_arr[j].length].position, mousePoint)? DrawLine(polygon_arr[j][i].position,polygon_arr[j][(i+1)%polygon_arr[j].length].position,"red") 
                    : DrawLine(polygon_arr[j][i].position,polygon_arr[j][(i+1)%polygon_arr[j].length].position,"white") ;
                  }
                }


                
                
              //clear the intersection arr every frame
               intersection_arr.length=0;


                console.log(polygon_arr);
                


    }

    
    Loop();
    