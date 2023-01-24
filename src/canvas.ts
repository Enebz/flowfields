import { Vector3 } from "./utils";

export default class Canvas {
  public node: HTMLCanvasElement;
  public width: number;
  public height: number;
  public color: string;
  public mousePos: Vector3;
  public onResizeCallback: (width: number, height: number) => void;
  public ctx: CanvasRenderingContext2D;

  constructor(parentNode: HTMLElement, id: string, width: number, height: number, color: string = "#000000") {
    this.node = document.createElement("canvas");
    this.node.id = id;
    parentNode.appendChild(this.node);

    this.width = width;
    this.height = height;
    this.color = color;
    this.mousePos = new Vector3(0, 0, 0);
    this.ctx = this.node.getContext("2d") as CanvasRenderingContext2D;

    this.node.width = width;
    this.node.height = height;

    this.node.onmousemove = (ev) => this.mouseMoveEvent(ev);
    window.addEventListener("resize", (ev) => this.resizeEvent(ev));
  }

  mouseMoveEvent(ev: MouseEvent) {
    this.mousePos.x = ev.clientX;
    this.mousePos.y = ev.clientY;
  }

  resizeEvent(ev: UIEvent) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
   
    this.node.width = this.width;
    this.node.height = this.height;

    if (this.onResizeCallback) {
      this.onResizeCallback(this.width, this.height);
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}

export class CanvasElement {
  public canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }
}