// Ehkalu Moo
//Javascript 
//April 3, 2017
//Assignment# 11
window.alert ('Welcome My shopping list App')










//v 3.0 Create Objects for Shoppinglist
var MyItems = {
  name:"",
  price:""
};

//v 2.1: change shoppinglist array empty array
var shoppinglist = [];

//v 2.1 Update function addShoppinglist
//v 3.0 Update function addShoppinglist by adding objects

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
  alert("Item Description Required: Please enter now :)");
  clearFocus();
  }
}

function clearFocus()
{
  document.getElementById("item").value = "";
 //  document.getElementById("cost").value = "";
  document.getElementById("item").focus();
}




function displayShoppinglists() {
    document.getElementById("MyList").innerHTML = '';
var TheList = "";
var arrayLength = shoppinglist.length;
for (var i = 0; i < arrayLength; i++) {
var btndelete =  ' <input name="delete" style="visibility:hidden" type="" value="" onclick="deleteShoppinglists(' + i + ')" />';
var arrays = shoppinglist[i];
arrays = "'"+arrays+"'";
var btnaddcart =  '<label><input name="add" type="checkbox" id="adds" value="Add to Shopping Cart" onclick="addtoshopcart('+arrays+','+ i +')" style="visibility:hidden"  /><img  id="adds" src="https://cdn.pbrd.co/images/61bOViCHY.png" alt=""/></label>';
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
var btndelete =  ' <input name="delete" style="visibility:hidden" type="" value="" onclick="deleteShoppingCart(' + i + ')" />';
var btnupdate =  ' <input class="button" name="edit" type="button" value="Edit Item" onclick="changeShoppingCart(' + i + ')" />';
var arrays = addtocart[i];
arrays = "'"+arrays+"'";
var btnaddlist =  '<label><input name="add" type="checkbox" id="adds" value="Add to Shopping List" onclick="deleteShoppingCart(' + i + ')"  checked="checked" style="visibility:hidden"/><img  id="test" src="https://cdn.pbrd.co/images/61dedbPM3.png" alt=""/></label>';
TheRow =  "<li>" + addtocart[i] + btndelete + ' ' +  ' ' + btnaddlist + '<br></li>';
TheList += TheRow;
}
if (arrayLength > 0)
{
  document.getElementById("MyCart").innerHTML = '<img src="https://cdn.pbrd.co/images/60KZlQAeX.png" alt="pastboard.co" style="width:30px;height:30px;">' + '<br><ul>' + TheList + '</ul>';
}else{
  document.getElementById("MyCart").innerHTML = '';
}
}


//v3.1
function deleteShoppinglists(position) {

  shoppinglist.splice(position, 1);
  displayShoppinglists();
  displayShoppingCart();
   //v 4.0 save cookie
  savecookie();
}
//v3.1
function deleteShoppingCart(position) {

  addtocart.splice(position, 1);
  displayShoppinglists();
  displayShoppingCart();
}


