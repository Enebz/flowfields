import Canvas, { CanvasElement } from "./canvas";
import { Entity } from "./entities";
import { Vector3 } from "./utils";
import { createNoise3D, NoiseFunction3D } from 'simplex-noise';

export class VectorField extends CanvasElement {
  public pos: Vector3;
  public width: number;
  public height: number;
  public draw_spacing: number;

  constructor(canvas: Canvas, pos: Vector3 = new Vector3(0, 0), width: number, height: number, draw_spacing: number = 16) {
    super(canvas);
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.draw_spacing = draw_spacing;
  }

  getVector(x: number, y: number) {
    return new Vector3(0, 0);
  }

  affect(affected: Entity) {
    if ((affected.pos.x >= this.pos.x && affected.pos.x < this.pos.x + this.width) && 
        (affected.pos.y >= this.pos.y && affected.pos.y < this.pos.y + this.height)) {
      affected.force.add(this.getVector(affected.pos.x, affected.pos.y));
    }
  }

  draw() {
    for (var y = 0; y < this.height; y += this.draw_spacing) {
      for (var x = 0; x < this.width; x += this.draw_spacing) {
        // Draw border
        
        // Draw vectors
        let normalized = this.getVector(x, y).copy().normalize();

        this.canvas.ctx.strokeStyle = "#FFFFFF";
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x, y);
        this.canvas.ctx.lineTo(x + normalized.x * 12, y + normalized.y * 12);
        this.canvas.ctx.closePath();
        this.canvas.ctx.stroke();

        // Draw axises
        this.canvas.ctx.strokeStyle = "rgba(255, 0, 125, 1)";
        this.canvas.ctx.lineWidth = 0.5;
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x, y);
        this.canvas.ctx.lineTo(x + 8, y);
        this.canvas.ctx.moveTo(x, y);
        this.canvas.ctx.lineTo(x, y + 8);
        this.canvas.ctx.closePath();
        this.canvas.ctx.stroke();  
      }
    }
  }
}

export class PerlinField extends VectorField {
  public noise: NoiseFunction3D;
  public noiseScale: number;
  public timeScale: number;
  public angleCoef: number;
  public timer: number = 0;
  
  constructor(canvas: Canvas, pos: Vector3 = new Vector3(0, 0), width: number, height: number, draw_spacing: number = 16, noiseScale: number = 0.001, timeScale: number = 0.0001, angleCoef: number = 1) {
    super(canvas, pos, width, height, draw_spacing);
    this.noise = createNoise3D();
    this.noiseScale = noiseScale;
    this.timeScale = timeScale;
    this.angleCoef = angleCoef;

    super.getVector = (x, y) => {
      let noiseVal = (this.noise(x * this.noiseScale, y * this.noiseScale, this.timer * this.timeScale) + 1) / 2;
      let theta = (noiseVal * 2 * Math.PI * this.angleCoef) % (2 * Math.PI);
      return new Vector3(Math.cos(theta) * 25, Math.sin(theta) * 25);
    }
  }

  update(deltaTime: number) {
    this.timer += deltaTime;
  }

  draw() {
    super.draw()
  }
}