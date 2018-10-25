'use strict';

function Seed (elementName, props)
{
	let self = this;
	self.props = props || {};
	self.ownProps = ["componentWillRender", "componentDidRender", "render", "props",
					 "buildComponent", "elementTagName", "addChild", "component", "ownProps"];
	self.component = document.createElement(elementName);
}

Seed.prototype.filterFields = function(){
    let self = this;
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


Seed.prototype.render = function(fatherElement)
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
