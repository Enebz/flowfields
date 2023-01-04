export default class UI {
  public id: string;
  public panels = new Map<string, Panel>();
  public node = document.createElement("div");

  constructor(parentNode: HTMLElement, id: string) {
    this.id = id;
    this.node.id = id;
    parentNode.appendChild(this.node);
  }

  addPanel(panel: Panel) {
    this.panels.set(panel.id, panel);
    this.node.appendChild(panel.node);
  }

  removePanel(panel: Panel) {
    this.panels.delete(panel.id);
    this.node.removeChild(panel.node);
  }
    
}

export class Panel {
  public id: string;
  public node = document.createElement("div");
  public elements = new Map<string, Element>();

  constructor(id: string) {
    this.id = id;
    this.node.id = id;
  }  
}

export class Element {
  public id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class Label extends Element {

}

export class Slider extends Element {

}