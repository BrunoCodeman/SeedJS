var father = document.getElementById('father');
var mother = document.getElementById('mother');

//this constructor takes 2 parameters:
//-- elementName (string): the html tag you wants to create
//-- props (object - optional): the properties and methods of your component
var s = new Seed('input');

s.elementClick = function(){
					var self = this;
					// All the HTML element properties must be named capitalized and prefixed by the word "element" (without the quotes);
					//if you want to use an attribute like data-something, name you property as elementData_something.
					var inputText  = new Seed("input",
											  { 
											     elementType: "text",
											     elementData_Test: "teste", 
											     uselessProperty: "testing",
											     elementClick:function(){this.value = inputText.uselessProperty;}, 
											     elementClass:"form-control"
											   });
					inputText.render(mother);
					setTimeout(function(){ self.setAttribute('class', "btn btn-primary"); }, 1000);
					
					};
s.elementValue = "Click Me!";
//This method will be executed before rendering the element
s.componentWillRender = function(){console.log('Here we go');}

//This method will be executed after rendering the element
s.componentDidRender = function(){ console.log("We did it!");}

//setting manually some properties
s.elementType = "button";
s.elementID = "btnTest";
s.elementClass = "btn btn-default";


//this method takes one parameter:
//-- father (object): the element where you want to render your component
s.render(father);

