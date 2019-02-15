'use strict';

/*
/ Creates a new Seed object
/ Parameters:
/ - elementName: The name of the HTML element you want to create (input, div, etc)
/ - attrs: The attributes of your element (style, value, etc)
*/
function Seed (elementName, attrs)
{
	let self = this;
	self.attrs = attrs || {};
	self.ownProps = ["componentWillRender", "componentDidRender", "render", "attrs",
					 "buildComponent", "elementTagName", "addChild", "component", "ownProps"];
	self.component = document.createElement(elementName);
}

/*
Add the attributes to the element
*/
Seed.prototype.filterFields = function() {
    let self = this;
    Object.keys(self.attrs)
          .filter(function(key){return 	typeof(self.attrs[key]) != "object" &&
                                       	typeof(self.attrs[key]) != "array" &&
                                     		self.ownProps.indexOf(key) < 0;})
          .forEach(function(item) { self[item] = self.attrs[item]; });
}

/*
 Appends and render a child component
*/
Seed.prototype.appendChild = function(seedElement) { seedElement.renderOn(this.component); }

Seed.prototype.buildComponent = function(){
	let self = this;
	self.filterFields();
	let keys = Object
				.keys(self)
				.map(function(item){

				    if(item.indexOf("element") > -1)
				    {
				        let newKey = item.replace("element","")
				                .split("_")
				                .join("-")
				                .toLowerCase();

				        self[newKey] = self[item];

				        delete self[item];

				        return newKey;
				    }

				}).filter(function(key){return key != null});

	let i = keys.length;
	
	while(i--)
	{
		let key = keys[i];
		let propType = typeof(self[key]);
		let propName = key;

		if(propType == "function")
		{
			let f = self[key];
			self.component.addEventListener(propName, f);
		}
		else
		{
		    self.component.setAttribute(propName, self[key]);
		}
	}
}

/*
/	Renders the component
/ Parameters: 
/ - fatherElement: element where your component must be rendered
*/
Seed.prototype.renderOn = function(fatherElement)
	{
		let self = this;
		let f = function(){};
		self.buildComponent();
		let willRender = typeof(self.componentWillRender) == "undefined"? f : self.componentWillRender;
		let didRender = typeof(self.componentDidRender) == "undefined"? f : self.componentDidRender;
		willRender();
		if(fatherElement != null)
		{
			fatherElement.appendChild(self.component);
		}
		didRender();
		return self.component;

	};

Seed.prototype.constructor = Seed;
