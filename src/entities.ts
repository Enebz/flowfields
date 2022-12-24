import { Vector3 } from "./utils";
import Canvas from "./canvas";
import { createNoise3D, NoiseFunction3D } from 'simplex-noise';

export class CanvasElement {
  public canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }
}

export class Entity extends CanvasElement {
  public static count = 0;
  public id;
  public pos;
  public vel;
  public terminalVel;
  public acc;
  public force: Vector3;
  public mass;

  constructor(canvas: Canvas, pos: Vector3 = new Vector3(0, 0, 0), vel: Vector3 = new Vector3(0, 0, 0), acc: Vector3 = new Vector3(0, 0, 0), mass: number = 1, terminalVel: number) {
    super(canvas)
    this.id = Entity.count
    this.pos = pos;
    this.vel = vel;
    this.terminalVel = terminalVel;
    this.acc = acc;
    this.mass = mass;
    this.force = new Vector3();
    Entity.count++;
  }

  update(deltaTime: number) {
    // ACCELERATION
    this.acc.add(this.force.copy().divide(this.mass));    

    // VELOCITY
    this.vel.add(this.acc)
    // this.vel.y += g;

    if (this.terminalVel !== undefined) {
      this.vel.setLength(this.terminalVel);
    }

    // POSITION
    this.pos.add(this.vel.copy().multiply(deltaTime / 1000))

    // RESET
    this.acc.multiply(0);
    this.force.multiply(0);
  }

  draw() {
    return;
  }
}

export class Circle extends Entity {
  public radius;
  public color;

  constructor(canvas: Canvas, pos: Vector3=new Vector3(0, 0, 0), vel: Vector3=new Vector3(0, 0, 0), acc: Vector3=new Vector3(0, 0, 0), mass: number = 1, radius: number = 10, terminalVel: number, color: string = '#FFFFFF') {
    super(canvas, pos, vel, acc, mass, terminalVel);
    this.radius = radius;
    this.color = color;
  }

  gravity(entities: Entity[]) {
    for (const other of entities)
    {
      if (this.id == other.id)
      {
        continue;
      }

      let d = other.pos.copy().subtract(this.pos)
      let r = d.length();

      let Fg = (this.mass * other.mass) / Math.pow(r, 2)

      this.force.add(d.copy().normalize().multiply(Fg));
    }
  }

  circleCollision(circles: Circle[]) {
    for (const circle of circles) {
      // If entity is self, skip.
      if (circle.id === this.id)
      {
        continue;
      }

      // If entity is circle
      if (circle instanceof Circle)
      {
        // Get vector between circles
        let d = circle.pos.copy().subtract(this.pos);
        if (d.length() < circle.radius + this.radius) {
          let correction = (circle.radius + this.radius - d.length()) / 2;
          let correction_vector = d.copy().normalize().multiply(correction);
          circle.pos.add(correction_vector);
          this.pos.subtract(correction_vector);

          let theta = d.headingXY();
          let sine = Math.sin(theta);
          let cosine = Math.cos(theta);

          let perpThis = new Vector3(this.vel.x * cosine + this.vel.y * sine, this.vel.y * cosine - this.vel.x * sine);
          let perpEntity = new Vector3(circle.vel.x * cosine + circle.vel.y * sine, circle.vel.y * cosine - circle.vel.x * sine);

          this.vel.x = perpEntity.x * cosine - perpThis.y * sine;
          this.vel.y =  perpThis.y * cosine + perpEntity.x * sine;
          circle.vel.x = perpThis.x * cosine - perpEntity.y * sine;
          circle.vel.y = perpEntity.y * cosine + perpThis.x * sine;          
        }
      }
    }
  }

  wallBounce() {
    if (this.pos.y - this.radius < 0) {
      this.pos.y = this.radius;
      this.vel.y = -this.vel.y * 0.9;
    } else if (this.pos.y + this.radius >= this.canvas.height) {
      this.pos.y = this.canvas.height - this.radius;
      this.vel.y = -this.vel.y * 0.9;
    }
    
    if (this.pos.x - this.radius < 0) {
      this.pos.x = this.radius;
      this.vel.x = -this.vel.x * 0.9;
    } else if (this.pos.x + this.radius >= this.canvas.width) {
      this.pos.x = this.canvas.width - this.radius;
      this.vel.x = -this.vel.x * 0.9;
    }
  }

  wallRepeat() {
    if (this.pos.x > this.canvas.width) { this.pos.x = 0 }
    if (this.pos.x < 0) { this.pos.x = this.canvas.width}
    if (this.pos.y > this.canvas.height) { this.pos.y = 0 }
    if (this.pos.y < 0) { this.pos.y = this.canvas.height}
  }

  wallRandom() {
    if (this.pos.y < 0 || this.pos.y >= this.canvas.height || this.pos.x < 0 || this.pos.x >= this.canvas.width) {
      this.pos.x = Math.random() * (this.canvas.width - 1);
      this.pos.y = Math.random() * (this.canvas.height - 1);
    }
  }

  update(deltaTime: number) {
    // this.gravity();

    /// POST CALCULATION FOR COLLISIONS ETC
    // this.circleCollision();
    // this.wallBounce();
    // this.wallRepeat();
    this.wallRandom();

    super.update(deltaTime)
  }

  draw() {
    super.draw();
    this.color = "hsla(" + this.pos.y * 350 / this.canvas.height + ", 100%, 100%, 1)"
    this.canvas.ctx.beginPath()
    this.canvas.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    this.canvas.ctx.closePath();
    this.canvas.ctx.fillStyle = this.color;
    this.canvas.ctx.fill();
  }
}

export class VectorField extends CanvasElement {
  public columns: number;
  public rows: number;
  public spacing: number;
  public vectors: Vector3[];
  public affected: Entity[]; 

  constructor(canvas: Canvas, columns: number = 2 ** 5) {
    super(canvas);
    this.columns = columns;
    this.spacing = this.canvas.width / this.columns;
    this.rows = Math.ceil(this.canvas.height / this.spacing);
    this.vectors = Array(this.columns * this.rows);
    this.affected = [];
  }

  getVector(x: number, y: number) {
    let index = x + y * this.columns;
    return this.vectors[index];
  }

  affect(affected: Entity) {
    let vec_x = Math.floor(affected.pos.x / this.spacing);
    let vec_y = Math.floor(affected.pos.y / this.spacing);

    if ((vec_x >= 0 && vec_x < this.columns) && (vec_y >= 0 && vec_y < this.rows)) {
      affected.force.add(this.getVector(vec_x, vec_y));
    }
  }

  draw() {
    for (var v = 0; v < this.vectors.length; v++) {
      let x = v % this.columns
      let y = Math.floor(v / this.columns)
      let normalized = this.vectors[v].copy().normalize();

      this.canvas.ctx.strokeStyle = "#FFFFFF";
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x * this.spacing, y * this.spacing);
      this.canvas.ctx.lineTo(x * this.spacing + normalized.x * 12, y * this.spacing + normalized.y * 12);
      this.canvas.ctx.closePath();
      this.canvas.ctx.stroke();
  
      this.canvas.ctx.strokeStyle = "rgba(0, 255, 255, 1)";
      this.canvas.ctx.lineWidth = 0.5;
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x * this.spacing, y * this.spacing);
      this.canvas.ctx.lineTo(x * this.spacing + 8, y * this.spacing);
      this.canvas.ctx.moveTo(x * this.spacing, y * this.spacing);
      this.canvas.ctx.lineTo(x * this.spacing, y * this.spacing + 8);
      this.canvas.ctx.closePath();
      this.canvas.ctx.stroke();
    }
  }
}

export class PerlinField extends VectorField {
  public noise: NoiseFunction3D;
  public noiseScale: number;
  public timeScale: number;
  public timer: number = 0;
  
  constructor(canvas: Canvas, columns: number = 2 ** 5, noiseScale: number = 0.01, timeScale: number = 0.01) {
    super(canvas, columns);
    this.noise = createNoise3D();
    this.noiseScale = noiseScale;
    this.timeScale = timeScale;
    
    for (var y = 0; y < this.rows; y++) {
      for (var x = 0; x < this.columns; x++) {
        let noiseVal = (this.noise((x + 1) * this.noiseScale, (y + 1) * this.noiseScale, 0 * this.noiseScale * this.timeScale) + 1) / 2;
        let theta = noiseVal * 2 * Math.PI;
        let index = x + y * this.columns;
        this.vectors[index] = new Vector3(Math.cos(theta), Math.sin(theta));
      }
    }
  }

  update(deltaTime: number) {
    this.timer += deltaTime;
    for (var y = 0; y < this.rows; y++) {
      for (var x = 0; x < this.columns; x++) {
        let noiseVal = (this.noise((x + 1) * this.noiseScale, (y + 1) * this.noiseScale, this.timer * this.noiseScale * this.timeScale) + 1) / 2;
        let theta = noiseVal * 2 * Math.PI;
        let index = x + y * this.columns;
        this.vectors[index].x = Math.cos(theta) * 40;
        this.vectors[index].y = Math.sin(theta) * 40;
      }
    }
  }

  draw() {
    super.draw()
  }
}