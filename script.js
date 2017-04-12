// Ehkalu Moo
//Javascript 
//April 11, 2017
//Assignment# 11
var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

class Random {
    
    static generateBinary() {
        var random = Math.random();
        if (random > 0.5) {
            return 1;
        } else {
            return 0;
        }
    }
    
    static generate(min, max) {
        return Math.floor((Math.random() * max) + min);
    }
    
}

class Binary {
    constructor() {
        this.value = Random.generateBinary();
    }
    
    animate(ts, leftOffset, topOffset) {
        var div = document.createElement("div");
        $(div).css("font-size", ts + "px");
        $(div).css("top", topOffset * (ts / 2));
        $(div).css("left", leftOffset + "px");
        $(div).text(this.value);
        $(div).addClass("binary");
        $(div).hide();
        $("body").append(div);
        $(div).show().addClass("animated fadeIn").on(animationEnd, this.fadeInEnd);
        return $(div).offset().top;
    }
   
    fadeInEnd(event) {
        var $binary = $(event.currentTarget);
        $binary.removeClass("animated fadeIn");
        $binary.addClass("animated fadeOut").on(animationEnd, function() {
            $binary.remove();
        });
    }
}

class BinaryLine {
    constructor(lO, tS, dS) {
        this.leftOffset = lO;
        this.textSize = tS;
        this.documentSize = dS;
    }
    
    generate() {
        var iterator = 1;
        var size = this.length;
        var fontSize = this.textSize;
        var documentSize = this.documentSize;
        var currentOffset = 0;
        var leftOffset = this.leftOffset;
        var interval = setInterval(function() {
            if (currentOffset < documentSize) {
                var binary = new Binary();
                currentOffset = binary.animate(fontSize, leftOffset, iterator);
                iterator++;
            } else {
                clearInterval(interval);
            }
        }, 80);
    }
}

class BinaryAnimation {
    constructor() {}
    
    start() {
        setInterval(function() {
            new BinaryLine(Random.generate(0, $(document).width()), Random.generate($(document).width() * 0.008, $(document).width() * 0.012), $(document).height()).generate();
        }, 400);
        
        setInterval(function() {
            $(".binary").remove();
        }, 30000)
    }
}

new BinaryAnimation().start();     









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



