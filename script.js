// Ehkalu Moo
//Javascript 
//April 11, 2017
//Assignment# 11
/**
 * Canvas Experiment
 * Based on http://tympanus.net/Development/AnimatedHeaderBackgrounds/index.html
 * Deps: GreenSocks TweenLite
 */

/**
 * Constructor
 */
function Animate(canvas, options) {
  this.canvas = canvas;
  this.options = defaults(options || {}, this.options);
  this.init();
}

/**
 * Default options
 */
Animate.prototype.options = {
  density: 10, // Affects how many poitns are created
  speed: 10, // Time in seconds to shift points
  sync: false, // Should points move in sync
  distance: 100, // Distance to move points
  lineColor: '255, 255, 255',
  circleColor: '255, 255, 255',
  radius: 20,
  lineWidth: 1,
  lines: 3,  // Number of closest lines to draw
  updateClosest : false, // Update closet points each loop
  mouse: true, // Link to mouse or random

};

/**
 * Setup everything
 */
Animate.prototype.init = function(){
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.target = {
    position: {
      x: this.width / 2,
      y: this.height / 2
    }
  };

  // Setup canvas
  this.canvas.width = this.width;
  this.canvas.height = this.height;

  this.ctx = canvas.getContext('2d');

  window.addEventListener('resize', this.resize.bind(this));

  if(this.options.mouse === true && !('ontouchstart' in window) ) {
     window.addEventListener('mousemove', this.mousemove.bind(this));
  }

  this.points = [];
  for(var x = 0; x < this.width; x = x + this.width / this.options.density) {
    for(var y = 0; y < this.height; y = y + this.height/ this.options.density) {
      var point = new Point({
        x: x + Math.random() * this.width/ this.options.density,
        y: y + Math.random() * this.height/this.options.density
      }, this.ctx, this.points.length + 1, this.options);
      this.points.push(point);
    }
  }

  // Setup Circles
  for(var i in this.points) {
    this.points[i].circle = new Circle(this.points[i], this.ctx, this.options);
  }

  this.findClosest(); // Points

  this.animate(); // Start the loop

  this.shiftPoints(); // Start the tween loop

  if(this.options.mouse === false) {
    this.moveTarget(); // Start the random target loop
  }

};

/*
 * Cycles through each Point and finds its neighbors
 */
Animate.prototype.findClosest = function() {
  for(var i = 0; i < this.points.length; i++) {
    // Save the point
    var point = this.points[i];
    // Reset
    point.closest = [];
    // Cycle through the others
    for(var j = 0; j < this.points.length; j++) {
      // Point to test
      var testPoint = this.points[j];
      if(point.id !== testPoint.id) {
        var placed = false, k;
        for (k = 0; k < this.options.lines; k ++) {
          if(!placed) {
            if(typeof point.closest[k] === 'undefined') {
              point.closest[k] = testPoint;
              placed = true;
            }
          }
        }

        for(k = 0; k < this.options.lines; k++){
          if(!placed) {
            if(point.distanceTo(testPoint) < point.distanceTo(point.closest[k])) {
              point.closest[k] = testPoint;
              placed = true;
            }
          }
        }
      }
    }
  }
};

/**
 * Animation Loop
 */
Animate.prototype.animate = function() {
  var i;
  // Should we recalucate closest?
  if(this.options.updateClosest) {
    this.findClosest();
  }

  // Calculate Opacity
  for(i in this.points) {
    if(this.points[i].distanceTo(this.target, true) < 5000) {
       this.points[i].opacity = 0.4;
       this.points[i].circle.opacity = 0.6;
    } else if (this.points[i].distanceTo(this.target, true) < 10000) {
       this.points[i].opacity = 0.2;
       this.points[i].circle.opacity = 0.3;
    } else if (this.points[i].distanceTo(this.target, true) < 30000) {
       this.points[i].opacity = 0.1;
       this.points[i].circle.opacity = 0.2;
    } else {
       this.points[i].opacity = 0.05;
       this.points[i].circle.opacity = 0.05;
    }
  }
   // Clear
  this.ctx.clearRect(0, 0, this.width, this.height);
  for(i in this.points) {

    this.points[i].drawLines();
    this.points[i].circle.draw();
  }
 // Loop
 window.requestAnimationFrame(this.animate.bind(this));
};

/**
 * Starts each point in tween loop
 */
Animate.prototype.shiftPoints = function() {
  for(var i in this.points) {
    this.points[i].shift();
  }
};


/**
 * Make sure the canvas is the right size
 */
Animate.prototype.resize = function() {
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.canvas.width = this.width;
  this.canvas.height = this.height;
};

/**
 * Mouse Move Event - Moves the target with the mouse
 * @param    event   {Object}   Mouse event
 */
Animate.prototype.mousemove = function(event) {
  if(event.pageX || event.pageY) {
    this.target.position.x = event.pageX;
    this.target.position.y = event.pageY;
  } else if(event.clientX || event.clientY) {
    this.target.position.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    this.target.position.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
};

/**
 * Randomly move the target
 */
Animate.prototype.moveTarget = function() {
  var _this = this;
  TweenLite.to(this.target.position, 2, {
    x : (Math.random() * (this.width - 200)) + 100,
    y : (Math.random() * (this.height - 200)) + 100,
    ease: Expo.easeInOut,
    onComplete: function() {
      _this.moveTarget();
    }
  });
};

/**
 * Point Constructor
 * @param    position   {Object}     set of x and u coords
 * @param    ctx        {Object}     Canvas context to draw on
 * @param    options    {Object}     options passed from main function
 */
function Point(position, ctx, id, options) {
  this.options = options || {};
  this.id = id;
  this.ctx = ctx;
  this.position = position || {x: 0, y: 0};
  this.origin = {
    x: this.position.x,
    y: this.position.y
  };
  this.opacity = 0;
  this.closest = [];
}

/**
 * Caluclates the distance to another point
 * @param    point    {Object}    Another Point
 * @param    abs      {Boolean}   Return the absolute value or not
 * @returns  {Number}
 */
Point.prototype.distanceTo = function(point, abs) {
  abs = abs || false;
  var distance = Math.pow(this.position.x - point.position.x, 2) + Math.pow(this.position.y - point.position.y, 2);
  return abs ? Math.abs(distance) : distance;
};

/**
 *  Draws lines to the closet points
 */
Point.prototype.drawLines = function() {
  for(var i in this.closest) {
    if(this.opacity  > 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.position.x, this.position.y);
       var test = i + 1;
      if(!this.closest[test]) {
        test = 0;
      }
      this.ctx.lineCap = 'round';
      this.ctx.strokeStyle = 'rgba(' + this.options.lineColor + ', ' + this.opacity + ')';
       this.ctx.lineWidth = this.options.lineWidth;


      this.ctx.lineTo(this.closest[i].position.x, this.closest[i].position.y);

      this.ctx.stroke();
    }
  }
};

/**
 * Tween loop to move each point around it's origin
 */
Point.prototype.shift = function() {
  var _this = this,
       speed = this.options.speed;

  // Random the time a little
  if(this.options.sync !== true) {
    speed -= this.options.speed * Math.random();
  }
  TweenLite.to(this.position, speed, {
    x : (this.origin.x - (this.options.distance/2) + Math.random() * this.options.distance),
    y : (this.origin.y - (this.options.distance/2) + Math.random() * this.options.distance),
    ease: Expo.easeInOut,
    onComplete: function() {
      _this.shift();
    }
  });
};

/**
 * Circle Constructor
 * @param    point   {Object}    Point object
 * @param    ctx     {Object}    Context to draw on
 * @param    options {Object}    options passed from main function
 */
function Circle(point, ctx, options) {
  this.options = options || {};
  this.point = point || null;
  this.radius = this.options.radius || null;
  this.color = this.options.color || null;
  this.opacity = 0;
  this.ctx = ctx;
}


/**
 * Draws Circle to context
 */
Circle.prototype.draw = function() {
  if(this.opacity > 0) {
    this.ctx.beginPath();
    this.ctx.arc(this.point.position.x, this.point.position.y, this.options.radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'rgba(' + this.options.circleColor + ', ' + this.opacity + ')';
    this.ctx.fill();
  }
};

// Get the balls rolling
new Animate(document.getElementById('canvas'));


/**
 * Utility Function to set default options
 * @param    object    {object}
 * @param    src  {object}
 */
function defaults(object, src) {
  for(var i in src) {
    if(typeof object[i] === 'undefined') {
      object[i] = src[i];
    }
  }
  return object;
}







//v 3.0 Create Objects for Shoppinglist
var MyItems = {
  name:"",
  price:""
};

//v 2.1: change shoppinglist array empty array
var shoppinglist = [];

//v 2.1 Update function addShoppinglist
//v 3.0 Update function addShoppinglist by adding objects
function addShoppinglist(item) {
  //v 3.0 declare variable for groc string
  //push to shoppinglist
  if (item != "")
  {
  shoppinglist.push(item);
  //display shoppinglist
  displayShoppinglists();
//v3.1 display displayShoppingCart() 
  displayShoppingCart(); 
  clearFocus();
  //v 4.0 save cookie
  savecookie();
  }else
  {
  alert("Item Description is Required");
  clearFocus();
  }
}

//v 2.1 add function 'clearFocus'
function clearFocus()
{
  //v 2.1: clear inputbox value out by id
//v 2.1: http://stackoverflow.com/questions/4135818/how-to-clear-a-textbox-using-javascript
  document.getElementById("item").value = "";
//v 3.0 clear cost field
   //document.getElementById("cost").value = "";

//v 2.1: set focus on inputbox after text is cleared
//v 2.1: http://stackoverflow.com/questions/17500704/javascript-set-focus-to-html-form-element
  document.getElementById("item").focus();
}

//v 2.1: update function displayShoppinglists() to display shoppinglists
//v 3.0: update function displayShoppinglists() to display shoppinglists & add remove button
function displayShoppinglists() {
//v 2.1: add and initialize variable 'TheList' with empty string 
var TheList = "";
//v 2.1: add and intitialize variable 'arrayLength' with shoppinglist.length
var arrayLength = shoppinglist.length;
//v 2.1: declare a for loop 
//v 2.1: (var i = 0; i < arrayLength; i++) 
//v 2.1: Concatentate TheList with each array item plus <br> tag

//v 3.0 add remove button using below i index
var button =  ' <input class="button" name="delete" type="button" value="Remove Item" onclick="deleteShoppinglists(' + i + ')" />';

for (var i = 0; i < arrayLength; i++) {
  //v 3.0 adding remove button to end of item
  TheList = TheList + shoppinglist[i] + button + '<br>';
}
//v 2.1: Display 'TheList" to document ID 'MyList'
document.getElementById("MyList").innerHTML = TheList;
}

function deleteShoppinglists(position) {
  shoppinglist.splice(position, 1);
  displayShoppinglists();
}

function changeShoppinglist(position, newValue) {
  shoppinglist[position] = newValue;
  displayShoppinglists();
}





//v 3.1 addtocart empty array
var addtocart = [];

function changeShoppinglist(position) {
  //document.getElementById("MyList").innerHTML = shoppinglist[position];
  var arrays = shoppinglist[position];
  arrays = arrays.split(",");
    var e1 = arrays[0];
   var e2 = arrays[1];
 var ReplacedAmount = e2.replace(/\$/g,'');
  var eitem = prompt("Please enter new item", e1);
  var ecost = prompt("Please enter your name", ReplacedAmount);
  shoppinglist[position] = eitem + "," + '$' + ecost;
  displayShoppinglists();
  displayShoppingCart() 
}

//v3.1
function changeShoppingCart(position) {
  document.getElementById("MyCart").innerHTML = shoppinglist[position];
  var arrays = addtocart[position];
  arrays = arrays.split(",");
    var e1 = arrays[0];
   var e2 = arrays[1];
 var ReplacedAmount = e2.replace(/\$/g,'');
  var eitem = prompt("Please enter new item", e1);
  var ecost = prompt("Please enter your name", ReplacedAmount);
  addtocart[position] = eitem + "," + '$' + ecost;
  displayShoppinglists();
  displayShoppingCart() 
}

//v3.1 
function addbacktoshoppinglist(item,num) {
  //push to deleteShoppingCar
   deleteShoppingCart(num);
  shoppinglist.push(item);
  //display shoppinglist
  displayShoppinglists();
//v3.1 display displayShoppingCart() 
  displayShoppingCart() 
  clearFocus();
}

//v 3.1 Update function addShoppinglist by adding objects
function addtoshopcart(item, num) {
    deleteShoppinglists(num);
    addtocart.push(item);
  //display shoppinglist
  displayShoppinglists();
//v3.1 display displayShoppingCart() 
  displayShoppingCart() 
  //Clear
  clearFocus();
}

function displayShoppinglists() {
var TheList = "";
var arrayLength = shoppinglist.length;
for (var i = 0; i < arrayLength; i++) {
var btndelete =  ' <input class="button1" name="delete" type="button" value="Remove Item" onclick="deleteShoppinglists(' + i + ')" />';
var btnupdate =  ' <input class="button" name="edit" type="button" value="Edit Item" onclick="changeShoppinglist(' + i + ')" />';
var arrays = shoppinglist[i];
arrays = "'"+arrays+"'";
var btnaddcart =  '<label><input name="add" type="checkbox" id="adds" value="Add to Shopping Cart" onclick="addtoshopcart('+arrays+','+ i +')" />Add</label>';
TheRow = '<li>' + shoppinglist[i] + btndelete + ' '  + btnaddcart + '</li>';
TheList += TheRow;
}
//v3.1 add Title
if (arrayLength > 0)
{
  document.getElementById("MyList").innerHTML = '<ul>' + TheList + '</ul>';
}else
{
  document.getElementById("MyList").innerHTML = '';
}
}

function displayShoppingCart() {
var TheList = "";
var arrayLength = addtocart.length;
for (var i = 0; i < arrayLength; i++) {
var btndelete =  ' <input class="button1" name="delete" type="button" value="Remove Item" onclick="deleteShoppingCart(' + i + ')" />';
var btnupdate =  ' <input class="button" name="edit" type="button" value="Edit Item" onclick="changeShoppingCart(' + i + ')" />';
var arrays = addtocart[i];
arrays = "'"+arrays+"'";
var btnaddlist =  '<label><input name="add" type="checkbox" id="adds" value="Add to Shopping List" onclick="addbacktoshoppinglist('+arrays+',' + i + ')" checked="checked"/>Add</label>';
TheRow =  "<li>" + addtocart[i] + btndelete + ' ' +  ' ' + btnaddlist + '<br></li>';
TheList += TheRow;
}
if (arrayLength > 0)
{
  document.getElementById("MyCart").innerHTML = '<img src="https://cdn.pbrd.co/images/OC8rBdiTW.png" alt="https://cdn.pbrd.co/images/OC8rBdiTW.png" style="width:30px;height:30px;">' + '<br><ul>' + TheList + '</ul>';
}else{
  document.getElementById("MyCart").innerHTML = '';
}
}


//v3.1
function deleteShoppinglists(position) {
  shoppinglist.splice(position, 1);
  displayShoppinglists();
  displayShoppingCart() 
}

//v3.1
function deleteShoppingCart(position) {
  addtocart.splice(position, 1);
  displayShoppinglists();
  displayShoppingCart() 
}

function savecookie()
{
  delete_cookie('konkollist');
   var date = new Date();
   //keeps for a year
    date.setTime(date.getTime() + Number(365) * 3600 * 1000);
   document.cookie = 'konkollist' + "=" + escape(shoppinglist.join(',')) + "; path=/;expires = " + date.toGMTString();
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


function delete_cookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function savecookie()
{
  delete_cookie('moo'); //cookie name
   var date = new Date();
   //keeps for a year
    date.setTime(date.getTime() + Number(365) * 3600 * 1000);
  //replace konkol with YOUR last name
   document.cookie = 'moo' + "=" + escape(shoppinglist.join(',')) + "; path=/;expires = " + date.toGMTString();
}
//multiple places in .JS. 
// Put call to savecookie(); AFTER displayShoppingCart();
displayShoppingCart();
  //v 4.0 save cookie
  savecookie();

window.onload = function() {
  populateshoppinglistonload();
   displayShoppinglists();
};

function populateshoppinglistonload()
{
  shoppinglist = [];
  addtocart = [];
  //load cookie into array
  var y = readCookie('moo'); //cookie name
  //remove unwanted chars and format
  y = remove_unwanted(y); 
  //spit array by comma %2C
  y = y.split('%2C');
  if (y) {
    shoppinglist = y;
   }
}

function remove_unwanted(str) {  
    
  if ((str===null) || (str===''))  
       return false;  
 else  
   str = str.toString();  
   str = str.replace(/%20/g, "");
   str = str.replace(/%24/g, "$"); 
   str = str.replace(/%7C/g, " | ");
  return str.replace(/[^\x20-\x7E]/g, '');  
}  



