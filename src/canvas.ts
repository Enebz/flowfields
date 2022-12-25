export default class Canvas {
  public node: HTMLCanvasElement;
  public width: number;
  public height: number;
  public color: string;
  public ctx: CanvasRenderingContext2D;

  constructor(node: HTMLCanvasElement, width: number, height: number, color: string = "#000000") {
    this.node = node;
    this.width = width;
    this.height = height;
    this.color = color;
    this.ctx = node.getContext("2d") as CanvasRenderingContext2D;

    node.width = width;
    node.height = height;
  }

  clear() {
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