class ElementWrapper {
	constructor(type) {
		this.root = document.createElement(type)
	}
	setAttribute(name,value){
		this.root.setAttribute(name,value);
	}
	appendChild(vchild){
		vchild.mountTo(this.root);
	}
	mountTo(parent){
		parent.appendChild(this.root);
	}
}
class TextWrapper {
	constructor(content) {
		this.root = document.createTextNode(content)
	}
	mountTo(parent){
		parent.appendChild(this.root);
	}	
}
//Wrapper只是为了让我们的component跟原生的DOM的行为一致

export class Component {
	constructor() {
		this.children = [];
	}
	setAttribute(name,value) {
		this[name] = value;
	}
	mountTo(parent) {
		let vdom = this.render();
		vdom.mountTo(parent);
	}
	appendChild(vchild){
		this.children.push(vchild);
	}
}
export let ToyReact = {
	createElement(type,attributes,...children){
		console.log(arguments);
		// debugger;


		// let element = document.createElement(type)


		let element;
		if(typeof type === "string")
			element = new ElementWrapper(type);
		else
			element = new type;


		for(let name in attributes){
			element.setAttribute(name, attributes[name]);
		}
		let insertChildren = (children) => {
			for(let child of children){
				if(typeof child === "object" && child instanceof Array) {
					insertChildren(child)
				} else {
					if(!(child instanceof Component) && !(child instanceof ElementWrapper) && !(child instanceof TextWrapper))
						child = String(child);
					if(typeof child === "string")
						// child = document.createTextNode(child);
						child = new TextWrapper(child);
					element.appendChild(child);
				}
			}
		}
		insertChildren(children);

		return element;
	},
	render(vdom,element){
		vdom.mountTo(element);	//element.appendChild(vdom);
	}
}