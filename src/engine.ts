import Canvas from "./canvas";
import { Entity, Circle } from "./entities";
import { Vector3 } from './utils';
import { PerlinField } from "./vectorfields";

export default class Engine {
  public entities: Entity[] = [];
  public perlinfield: PerlinField;
  public main_scene: Canvas;

  constructor() {

    let canvas_node = document.getElementById("canvas") as HTMLCanvasElement;

    if (canvas_node === null) {
      throw new Error("Need canvas.");
    }

    this.main_scene = new Canvas(canvas_node, document.body.clientWidth, document.body.clientHeight, "rgb(0, 0, 0)");

    document.onkeydown = (ev) => {
      if (ev.key === "r") {
        this.entities = [];
        this.start();
      }
    }
  }

  start() {
    this.main_scene.clear();
  
    this.perlinfield = new PerlinField(this.main_scene, new Vector3(0, 0), this.main_scene.width, this.main_scene.height, 40, 0.001, 0.0001, 2);
  
    for (var i = 0; i < 1000; i++) {
      let p = new Circle(
        this.main_scene,
        new Vector3(Math.random() * this.perlinfield.width + this.perlinfield.pos.x, Math.random() * this.perlinfield.height + this.perlinfield.pos.y),
        new Vector3(0, 0),
        new Vector3(0, 0),
        1,
        1,
        100,
        "rgba(0, 183, 195, 0.05)"
      );
      this.entities.push(p);
    }
  }
  
  update(deltaTime: number) {
    //this.main_scene.clear();

    this.perlinfield.update(deltaTime);
      
    // Update entities
    for (const entity of this.entities)
    {
      this.perlinfield.affect(entity);
      entity.update(deltaTime);
    }
  }
  
  draw() {  
    //this.perlinfield.draw();
  
    for (const entity of this.entities)
    {
      entity.draw();
    }
  }
}