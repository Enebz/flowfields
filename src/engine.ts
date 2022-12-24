import Canvas from "./canvas";
import { Entity, Circle, PerlinField } from "./entities";
import { Vector3 } from './utils';

export default class Engine {
  public entities: Entity[] = [];
  public perlinfield: PerlinField;
  public main_scene: Canvas;

  constructor() {

    let canvas_node = document.getElementById("canvas") as HTMLCanvasElement;

    if (canvas_node === null) {
      throw new Error("Need canvas.");
    }

    this.main_scene = new Canvas(canvas_node, document.body.clientWidth, document.body.clientHeight);
  }

  start() {
    this.main_scene.clear();
  
    this.perlinfield = new PerlinField(this.main_scene, 90, 0.025, 0.0025);
  
    for (var y = 0; y < this.main_scene.height; y += this.perlinfield.spacing) {
      for (var x = 0; x < this.main_scene.width; x += this.perlinfield.spacing) {
        let p = new Circle(this.main_scene, new Vector3(x, y), new Vector3(0, 0), new Vector3(0, 0), 1, 1, 150);
        this.entities.push(p);
      }
    }
  }
  
  update(deltaTime: number) {
    this.main_scene.clear()
    
    this.perlinfield.update(deltaTime);
  
    // Update entities
    for (const entity of this.entities)
    {
      this.perlinfield.affect(entity);
      entity.update(deltaTime);
    }
  }
  
  draw() {  
    // this.perlinfield.draw();
  
    for (const entity of this.entities)
    {
      entity.draw();
    }
  }
}