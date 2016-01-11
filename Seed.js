'use strict';

function Seed (elementName, props)
{
	var self = this;
	self.props = props || {};
	self.ownProps = ["componentWillRender", "componentDidRender", "render", "props",
					 "buildComponent", "elementTagName", "addChild", "component", "ownProps"];
	self.component = document.createElement(elementName);
}

Seed.prototype.filterFields = function(){
    var self = this;
    Object.keys(self.props)
          .filter(function(key){return typeof(self.props[key]) != "object" &&
                                       typeof(self.props[key]) != "array";})
          .filter(function(key){return self.ownProps.indexOf(key) < 0;})
          .forEach(function(item){
                    self[item] = self.props[item];
                   });

}

Seed.prototype.appendChild = function(seedElement){
    seedElement.render(this.component);
}

Seed.prototype.buildComponent = function(){
	var self = this;
	self.filterFields();
	var keys = Object
				.keys(self)
				.map(function(item){
				    if(item.indexOf("element") > -1)
				    {
				        var newKey = item.replace("element","")
				                .split("_")
				                .join("-")
				                .toLowerCase();

				        self[newKey] = self[item];

				        delete self[item];

				        return newKey;
				    }

				}).filter(function(key){return key != null});
    var i = keys.length;
	while(i--)
	{
		var key = keys[i];
		var propType = typeof(self[key]);
		var propName = key;

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
		var willRender = typeof(self.componentWillRender) == "undefined"? f : self.componentWillRender;
		var didRender = typeof(self.componentDidRender) == "undefined"? f : self.componentDidRender;
		willRender();
		if(fatherElement != null)
		{
			fatherElement.appendChild(self.component);
		}
		didRender();
		return self.component;

	};

Seed.prototype.constructor = Seed;