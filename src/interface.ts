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
    this.node.checked = checked;
  }
}

export class ColorPicker extends Element {
  private _color: Color;

  public onChangeCallback: (color: Color) => void = (color: Color) => {};

  declare public node: HTMLInputElement;

  constructor(id: string, name: string, color: Color) {
    super(id, name);
    this._color = color;
    this.node = document.createElement("input");
    this.node.id = id;
    this.node.type = "color";
    this.node.value = this._color.hex.slice(0, 7);

    this.node.oninput = (ev) => this.onInput(ev);
  }

  onInput(ev: Event) {
    if (ev.target === null) return;
    const target = ev.target as HTMLInputElement;
    this.color.hex = target.value;
  }

  get color() {
    return this._color;
  }

  set color(color: Color) {
    this.onChangeCallback(color);
    this._color = color;
    this.node.value = color.hex.slice(0, 7);
  }
}

export class Button extends Element {
  public onClickCallback: () => void = () => {};

  declare public node: HTMLButtonElement;

  constructor(id: string, name: string) {
    super(id, name);
    this.node = document.createElement("button");
    this.node.id = id;
    this.node.innerText = name;

    this.node.onclick = () => this.onClick();
  }

  onClick() {
    this.onClickCallback();
  }
}

export class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  get hex() {

    // convert alpha to hex
    const alpha = Math.round(this.a * 255);
    const alphaHex = alpha.toString(16);
    const alphaHexPadded = alphaHex.length === 1 ? `0${alphaHex}` : alphaHex;

    return `#${this.r.toString(16).padStart(2, "0")}${this.g.toString(16).padStart(2, "0")}${this.b.toString(16).padStart(2, "0")}${alphaHexPadded}`;
  }

  set hex(hex: string) {
    if (hex.length === 7) {
      this.r = parseInt(hex.slice(1, 3), 16);
      this.g = parseInt(hex.slice(3, 5), 16);
      this.b = parseInt(hex.slice(5, 7), 16);
    }
    if (hex.length !== 9) return;
    this.r = parseInt(hex.slice(1, 3), 16);
    this.g = parseInt(hex.slice(3, 5), 16);
    this.b = parseInt(hex.slice(5, 7), 16);
    this.a = parseInt(hex.slice(7, 9), 16);
  }

  get rgba() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  set rgba(rgba: string) {
    const rgbaArray = rgba.slice(5, rgba.length - 1).split(",");
    this.r = parseInt(rgbaArray[0]);
    this.g = parseInt(rgbaArray[1]);
    this.b = parseInt(rgbaArray[2]);
    this.a = parseFloat(rgbaArray[3]);
  }

  get hsla() {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const a = this.a / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return `hsla(${h * 360}, ${s * 100}%, ${l * 100}%, ${a})`;
  }

  set hsla(hsla: string) {
    const hslaArray = hsla.slice(5, hsla.length - 1).split(",");
    const h = parseFloat(hslaArray[0]) / 360;
    const s = parseFloat(hslaArray[1]) / 100;
    const l = parseFloat(hslaArray[2]) / 100;
    const a = parseFloat(hslaArray[3]);

    let r = 0;
    let g = 0;
    let b = 0;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    this.r = r * 255;
    this.g = g * 255;
    this.b = b * 255;
    this.a = a;
  }
}
