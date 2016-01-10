'use strict';

function Seed (elementName, props)
{
	props = props || {};
	var self = this;
	self.ownProps = ["componentWillRender", "componentDidRender", "render", 
					 "buildComponent", "elementTagName", "addChild", "fatherElement"];

	self.component = document.createElement(elementName);
	Object.keys(props).forEach(function(item){
			self[item] = props[item];
			});
}

Seed.prototype.appendChild = function(child){
	this.component.appendChild(child);
}

Seed.prototype.buildComponent = function(){
	var self = this;
	var keys = Object
				.keys(self)
				.filter(function(prop){return typeof(self[prop]) != "object" && typeof(self[prop]) != "array";})
				.filter(function(prop){return self.ownProps.indexOf(prop) < 0;});
	var i = keys.length;
	while(i--)
	{
		var key = keys[i];
		var propType = typeof(self[key]);
		var propName = key.indexOf("element") > -1? key.replace("element","").split("_").join("-").toLowerCase() : null;
		if(propType == "function")
		{
			var f = self[key];
			self.component.addEventListener(propName, f);
		}
		else
		{
			self.component.setAttribute(propName, self[key]);
		}
	}
}


Seed.prototype.render = function(fatherElement)
	{
		var self = this;
		var f = function(){};
		self.buildComponent();
		var willRender = typeof(self.componentWillRender) != "undefined"? self.componentWillRender: f;
		var didRender = typeof(self.componentDidRender) != "undefined"? self.componentDidRender: f;
		willRender();
		if(fatherElement != null)
		{
			fatherElement.innertHTML = '';
			fatherElement.appendChild(self.component);	
		}
		didRender();
		return self.component;
		
	};

Seed.prototype.constructor = Seed;