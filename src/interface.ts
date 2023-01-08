export default class UI {
  public id: string;
  public panels = new Map<string, Panel>();
  public node = document.createElement("div");
  public parentNode: HTMLElement;

  constructor(parentNode: HTMLElement, id: string) {
    this.id = id;
    this.node.id = id;
    this.parentNode = parentNode;

    document.addEventListener("keydown", (ev: KeyboardEvent) => {
      switch (ev.key) {
        case "u":
          this.node.style.display = this.node.style.display === "none" ? "block" : "none";
          break;
      }
    });
  }

  addPanel(panel: Panel) {
    this.panels.set(panel.id, panel);
    this.node.appendChild(panel.node);
  }

  removePanel(panel: Panel) {
    this.panels.delete(panel.id);
    this.node.removeChild(panel.node);
  }

  createHTMLNode() {
    for (let panel of this.panels.values()) {
      this.node.appendChild(panel.createHTMLNode());
    }

    return this.node;
  }

  addHTMLNode() {
    this.parentNode.appendChild(this.createHTMLNode());
  }
}

export class Panel {
  public id: string;
  public node = document.createElement("div");
  public elements = new Map<string, Element>();

  constructor(id: string) {
    this.id = id;
    this.node.id = this.id;
    this.node.classList.add("panel");
  }  

  addElement(element: Element) {
    this.elements.set(element.id, element);
    this.node.appendChild(element.node);
  }

  removeElement(element: Element) {
    this.elements.delete(element.id);
    this.node.removeChild(element.node);
  }

  createHTMLNode() {
    for (let element of this.elements.values()) {
      this.node.appendChild(element.createHTMLNode());
    }

    return this.node;
  }
}

export abstract class Element {
  public id: string;
  public name: string;
  public parentNode: HTMLDivElement = document.createElement("div");
  public node: HTMLElement;
  public nameNode: HTMLSpanElement = document.createElement("span");

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.nameNode.innerText = name;
  }

  createHTMLNode() {
    this.parentNode.appendChild(this.nameNode);
    this.parentNode.appendChild(this.node);
    return this.parentNode;
  }
}

export abstract class NumberElement extends Element {
  protected _value: number;
  public valueNode: HTMLSpanElement = document.createElement("span");

  createHTMLNode() {
    super.createHTMLNode();
    this.parentNode.appendChild(this.valueNode);
    return this.parentNode;
  }
}

export class Label extends Element {
  public _text: string;

  constructor(id: string, name: string, text?: string) {
    super(id, name);
    this.node = document.createElement("span");
    this.node.id = id;

    if (text !== undefined) {
      this.text = text;
    }
  }

  get text() {
    return this._text;
  }

  set text(text: string) {
    this._text = text;
    this.node.innerText = text;
  }

}

export class Slider extends NumberElement {
  public min: number;
  public max: number;
  public step: number;

  public onInputCallback: (value: number) => void = (value: number) => {};
  public round: boolean = false;

  declare public node: HTMLInputElement;

  constructor(id: string, name: string, min: number, max: number, value: number, step: number) {
    super(id, name);
    this.min = min;
    this.max = max;
    this.value = value;
    this.step = step;

    this.node = document.createElement("input");
    this.node.id = id;
    this.node.type = "range";
    this.node.min = min.toString();
    this.node.max = max.toString();
    this.node.value = value.toString();
    this.node.step = step.toString();

    this.node.oninput = (ev) => this.onInput(ev);
  }

  private onInput(ev: Event) {
    if (ev.target === null) return;
    const target = ev.target as HTMLInputElement;
    this.value = parseFloat(target.value); 
  }

  get value() {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
    if (this.round) {
      this._value = Math.round(this._value);
    }
    this.onInputCallback(this._value);
    this.valueNode.innerText = value.toFixed(6);
  }
}

export class CheckBox extends Element {
  private _checked: boolean;

  public onChangeCallback: (checked: boolean) => void = (checked: boolean) => {};

  declare public node: HTMLInputElement;

  constructor(id: string, name: string, checked: boolean = false) {
    super(id, name);
    this._checked = checked;
    this.node = document.createElement("input");
    this.node.id = id;
    this.node.type = "checkbox";
    this.node.checked = checked;

    this.node.oninput = (ev) => this.onInput(ev);
  }

  onInput(ev: Event) {
    if (ev.target === null) return;
    const target = ev.target as HTMLInputElement;
    this.checked = target.checked as boolean;
  }

  get checked() {
    return this._checked;
  }

  set checked(checked: boolean) {
    this.onChangeCallback(checked);
    this._checked = checked;
  }
}