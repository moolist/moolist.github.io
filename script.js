// Ehkalu Moo
//Javascript 
//April 11, 2017
//Assignment# 11
     




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







class ShapeController
	shapes: []
	frame: new Date().getTime()
	vel:
		scrollX: 0
		scrollY: 0
	
	data:
		amount: 24
		scale: 1.25
		minVel: 0.2
		maxVel: 1.0
		allowShuffle: true
		
		colors: [
			"#FA4248"
			"#5DDBBA"
			"#64C3F2"
			"#EDE670"
		]

		shapes:
			rectangle: [
				x: 0.33
				y: -0.33
			,
				x: 0.66
				y: -0.33
			,
				x: 0.66
				y: 1.33
			,
				x: 0.33
				y: 1.33
			,
				x: 0.33
				y: -0.33
			]
		
			triangle: [
				x: 0.5
				y: 0.07
			,
				x: 1.0
				y: 0.93
			,
				x: 0.0
				y: 0.93
			,
				x: 0.5
				y: 0.07
			]

			circle: [ 1 ]
	
			cross: [
				x: 0.33
				y: 0.00
			,
				x: 0.66
				y: 0.00
			,
				x: 0.66
				y: 0.33
			,
				x: 1.00
				y: 0.33
			,
				x: 1.00
				y: 0.66
			,
				x: 0.66
				y: 0.66
			,
				x: 0.66
				y: 1.00
			,
				x: 0.33
				y: 1.00
			,
				x: 0.33
				y: 0.66
			,
				x: 0.00
				y: 0.66
			,
				x: 0.00
				y: 0.33
			,
				x: 0.33
				y: 0.33
			,
				x: 0.33
				y: 0.00
			]

	init: ->
		@.getElements()
		@.initShapes()
		@.render()
		
	getElements: ->
		@.el = document.getElementsByTagName( "canvas" )[0]
		@.stage = @.el.getContext( "2d" )
		
	initShapes: ->
		i = 0
		while i < @.data.amount
			@.addShape()
			i++
			
		console.log @.shapes
			
	addShape: ( type , color , x , y , r , xvel , yvel , rvel ) ->
		buffer = @.data.scale * 250
		types = Object.getOwnPropertyNames( @.data.shapes )
		if type is undefined or types.indexOf( type )is -1
			type = types[ Math.floor( Math.random() * types.length )]
			
		colors = @.data.colors
		if color is undefined or colors.indexOf( color )is -1
			color = colors[ Math.floor( Math.random() * colors.length )]
			
		if x is undefined then x = -buffer + Math.random() * ( window.innerWidth + ( 2 * buffer ))
		if y is undefined then y = -buffer + Math.random() * ( window.innerHeight + ( 2 * buffer ))
		if r is undefined then r = Math.random() * 360

		if xvel is undefined
			dir = 0
			vel = @.data.minVel + ( Math.random() * ( @.data.maxVel - @.data.minVel ))
			if Math.random() > 0.5 then dir = -1 else dir = 1
			xvel = dir * vel
			
		if yvel is undefined
			dir = 0
			vel = @.data.minVel + ( Math.random() * ( @.data.maxVel - @.data.minVel ))
			if Math.random() > 0.5 then dir = -1 else dir = 1
			yvel = dir * vel
			
		if rvel is undefined
			dir = 0
			vel = @.data.minVel + ( Math.random() * ( @.data.maxVel - @.data.minVel ))
			if Math.random() > 0.5 then dir = -1 else dir = 1
			rvel = dir * vel
			
		@.shapes.push({
			type: type
			color: color
			mult: 0.5 + Math.random() * 2
			pos:
				x: x
				y: y
				r: r
			vel:
				x: xvel
				y: yvel
				r: rvel
		})
		
	repo: ( shape , rate ) ->
		buffer = @.data.scale * 250
		shape.pos.x += ( shape.vel.x + ( @.vel.scrollX * shape.mult )) * ( rate / ( 1000 / 60 ))
		shape.pos.y += ( shape.vel.y + ( @.vel.scrollY * shape.mult )) * ( rate / ( 1000 / 60 ))
		shape.pos.r += ( shape.vel.r / 2 ) * ( rate / ( 1000 / 60 ))
		shuffle = false
		
		if shape.pos.x > window.innerWidth + buffer
			shape.pos.x = -buffer
			shuffle = true
			
		if shape.pos.x < -buffer
			shape.pos.x = window.innerWidth + buffer
			shuffle = true
			
		if shape.pos.y > window.innerHeight + buffer
			shape.pos.y = -buffer
			shuffle = true
			
		if shape.pos.y < -buffer
			shape.pos.y = window.innerHeight + buffer
			shuffle = true
			
		if shape.pos.r > 360
			shape.pos.r -= 360
			
		if shape.pos.r < 0
			shape.pos.r += 360
			
		if shuffle is true and @.data.allowShuffle is true
			types = Object.getOwnPropertyNames( @.data.shapes )
			colors = @.data.colors
			
			type = types[ Math.floor( Math.random() * types.length )]
			color = colors[ Math.floor( Math.random() * colors.length )]
			
			shape.type = type
			shape.color = color
		
	draw: ( shape ) =>
		c = @.stage
		s = shape
		p = @.data.shapes[ s.type ]
		m = @.data.scale * 200
		i = 0
		
		c.save()
		c.fillStyle = s.color
		c.translate( s.pos.x , s.pos.y )
		c.rotate( s.pos.r * ( Math.PI / 180 ))
		c.beginPath()
		
		if p.length > 1
			while i < p.length
				x = ( p[i].x - 0.5 ) * m
				y = ( p[i].y - 0.5 ) * m

				if i is 0
					c.moveTo( x , y )
				else
					c.lineTo( x , y )
				i++
		else
			c.arc( 0 , 0 , p[0] * m * 0.5 , 0 , 2 * Math.PI )
			
		c.fill()
		c.restore()
			
	scale: ->
		if @.width isnt window.innerWidth or @.height isnt window.innerHeight
			@.width = window.innerWidth
			@.height = window.innerHeight
			@.el.width = document.body.clientWidth
			@.el.height = document.body.clientHeight

	friction: ( rate ) ->
		if Math.abs( @.vel.scrollX ) > 0.01
			@.vel.scrollX = Math.round( @.vel.scrollX * 0.95 * 1000 ) / 1000
		else
			@.vel.scrollX = 0

		if Math.abs( @.vel.scrollY ) > 0.01
			@.vel.scrollY = Math.round( @.vel.scrollY * 0.95 * 1000 ) / 1000
		else
			@.vel.scrollY = 0
		
	render: =>
		i = 0
		@.scale()
		elapsed = new Date().getTime()
		@.stage.clearRect( 0 , 0 , @.width , @.height )
		@.friction( elapsed - @.frame )
		while i < @.shapes.length
			@.repo( @.shapes[i] , elapsed - @.frame )
			@.draw( @.shapes[i] )
			i++
		@.frame = elapsed
		requestAnimationFrame @.render

window.App = new ShapeController
App.init()
