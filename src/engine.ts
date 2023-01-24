import Canvas from "./canvas";
import { Entity, Circle } from "./entities";
import UI, { Button, CheckBox, Color, ColorPicker, Panel, Slider } from "./interface";
import { Vector3 } from './utils';
import { PerlinField } from "./vectorfields";

export default class Engine1 {
  public ui: UI;

  public engine_panel: Panel;
  public renderer_panel: Panel;

  public mousePos: Vector3;
  public mouseDistanceMoved: number;
  public clickCount: number;

  public entities: Entity[] = [];

  public particle_count: Slider;
  public speed: Slider;
  public fieldforce: Slider;
  public noiseScale: Slider;
  public timeScale: Slider;
  public trace: CheckBox;
  public showPerlinField: CheckBox;
  public drawVelocity: CheckBox;
  public drawForce: CheckBox;
  public particleColor: ColorPicker;
  public reset: Button;

  public particles: Circle[] = [];
  public perlinfield: PerlinField;
  public main_scene: Canvas;
  public perlinfield_scene: Canvas;
  
  constructor(ui: UI) {
    // Canvas
    let canvases = document.getElementById("canvases") as HTMLElement;
    this.main_scene = new Canvas(canvases, "main-scene", window.innerWidth, window.innerHeight, "rgba(0, 0, 0, 0)");
    this.perlinfield_scene = new Canvas(canvases, "perlinfield-scene", window.innerWidth, window.innerHeight, "rgba(0, 0, 0, 0)");

    // Resize event is a kinda bad solution, but I am feeling done with this project for now so I will leave it like this
    // I will fix it later when I will have more time and motivation to do so :)
    // I will probably make a new project with better code and better architecture
    // I will probably use typescript combined with react for that project
    // That project will include a lot of cool stuff like:
    // - 3D rendering
    // - 3D physics
    // - 3D vector fields
    // - 3D particles
    // - Advanced UI
    // - Advanced UI animations
    // - Collision detection and response (2D and 3D)
    // - Fluid simulation (2D)

    // Resize event
    window.addEventListener("resize", (ev: UIEvent) => {
      this.perlinfield.width = this.perlinfield_scene.width;
      this.perlinfield.height = this.perlinfield_scene.height;
      this.draw();
    });

    // UI
    this.ui = ui;

    // Panels
    this.engine_panel = new Panel("engine-panel");

    this.ui.addPanel(this.engine_panel);

    // Mouse pos
    this.mousePos = new Vector3(0, 0);

    // Particles count
    this.particle_count = new Slider("particle-count", "Particles count", 0, 1000, 100, 1);
    this.particle_count.round = true;
    this.particle_count.onInputCallback = (value) => {
      // Change entities array to new length by resizing it and filling it with new entities
      this.particles.length = value;
      for (let i = 0; i < this.particles.length; i++) {
        if (this.particles[i] === undefined) {
          this.particles[i] = new Circle(
            this.perlinfield_scene,
            new Vector3(Math.random() * this.perlinfield.width + this.perlinfield.pos.x, Math.random() * this.perlinfield.height + this.perlinfield.pos.y),
            new Vector3(0, 0),
            new Vector3(0, 0),
            1,
            1,
            this.speed.value,
            this.particleColor.color
          );
        }
      }
    }
    this.engine_panel.addElement(this.particle_count);

    // Particles speed
    this.speed = new Slider("speed", "Speed", 0, 500, 100, 1);
    this.speed.onInputCallback = (value) => {
      for (const entity of this.particles)
      {
        entity.terminalVel = value;
      }
    }
    this.engine_panel.addElement(this.speed);

    // Field force
    this.fieldforce = new Slider("fieldforce", "Field force", 0, 1000, 25, 1);
    this.fieldforce.onInputCallback = (value: number) => {
      this.perlinfield.forceCoef = value;
    }
    this.engine_panel.addElement(this.fieldforce);

    // Noise scale
    this.noiseScale = new Slider("noise-scale", "Noise scale", 0.0001, 0.01, 0.0025, 0.0001);
    this.noiseScale.onInputCallback = (value: number) => {
      this.perlinfield.noiseScale = value;
    }
    this.engine_panel.addElement(this.noiseScale);

    // Time scale
    this.timeScale = new Slider("time-scale", "Time scale", 0, 0.0005, 0.0001, 0.00001);
    this.timeScale.onInputCallback = (value: number) => {
      this.perlinfield.timeScale = value;
    }
    this.engine_panel.addElement(this.timeScale);

    // Trace
    this.trace = new CheckBox("trace", "Trace (T)");
    this.trace.onChangeCallback = (checked: boolean) => {
      if (checked) {
        this.perlinfield_scene.clear();
        this.particleColor.color.a = 0.025;

        for (const particle of this.particles)
        {
          particle.trace = true;
        }
      } 
      else {
        this.particleColor.color.a = 1;

        for (const particle of this.particles)
        {
          particle.trace = false;
        }
      }
    };
    this.engine_panel.addElement(this.trace);

    // Show perlin field
    this.showPerlinField = new CheckBox("show-vectors", "Show vectors");
    this.showPerlinField.onChangeCallback = (checked: boolean) => {
      if (checked) {
        this.perlinfield_scene.clear();
        this.perlinfield.draw();
      } else {
        this.perlinfield_scene.clear();
      }
    };
    this.engine_panel.addElement(this.showPerlinField);

    // Draw Velocity
    this.drawVelocity = new CheckBox("draw-velocity", "Draw velocity");
    this.engine_panel.addElement(this.drawVelocity);

    // Draw Force
    this.drawForce = new CheckBox("draw-force", "Draw force");
    this.engine_panel.addElement(this.drawForce);

    // Particle color
    this.particleColor = new ColorPicker("particle-color", "Particle color", new Color(255, 255, 255, 1));
    this.engine_panel.addElement(this.particleColor);

    // Reset
    this.reset = new Button("reset", "Reset (R)");
    this.reset.onClickCallback = () => {
      this.start();
    }
    this.engine_panel.addElement(this.reset);

    // Reset
    document.addEventListener("keydown", (ev) => {
      switch (ev.key) {
        case "r":
          this.start();
          break;
      
        case "t":
          this.trace.checked = !this.trace.checked;

        default:
          break;
      }
    });

    document.addEventListener("mousemove", (ev) => {
      this.mousePos.x = ev.clientX;
      this.mousePos.y = ev.clientY;

      this.mouseDistanceMoved += this.mousePos.length() 
    });

    document.addEventListener("click", (ev) => {
      this.clickCount++;
    });
  }

  start() {
    this.main_scene.clear();
    this.perlinfield_scene.clear();
  
    this.perlinfield = new PerlinField(
      this.main_scene,
      new Vector3(0, 0),
      this.main_scene.width,
      this.main_scene.height,
      40,
      this.noiseScale.value,
      this.timeScale.value,
      2,
      this.fieldforce.value
    );

    this.particles = [];
    
    for (var i = 0; i < this.particle_count.value; i++) {
      let p = new Circle(
        this.perlinfield_scene,
        new Vector3(Math.random() * this.perlinfield.width + this.perlinfield.pos.x, Math.random() * this.perlinfield.height + this.perlinfield.pos.y),
        new Vector3(0, 0),
        new Vector3(0, 0),
        1,
        1,
        this.speed.value,
        this.particleColor.color
      );
      p.trace = this.trace.checked;
      this.particles.push(p);
    }

    this.draw();
  }
  
  update(deltaTime: number) {
    this.perlinfield.update(deltaTime);

    // Update entities
    for (const entity of this.entities) {
      if (entity instanceof Circle) {
      }
      entity.update(deltaTime);
    }
      
    // Update particles
    for (const particle of this.particles) {
      this.perlinfield.affect(particle);
      particle.update(deltaTime);
    }
  }
  
  draw() {
    if (!this.trace.checked) {
      this.perlinfield_scene.clear();
    }

    this.main_scene.clear();

    this.showPerlinField.checked ? this.perlinfield.draw() : null

    // Draw entities
    for (const entity of this.entities) {
      entity.draw();
    }
  
    // Draw particles
    for (const particle of this.particles) {
      particle.draw();
      if (this.drawVelocity.checked)
      {
        particle.drawVelocity(16, (velocity) => {
          let saturation = Math.floor((velocity / 500) * 100);
          let alpha = this.trace.checked ? 0.025 : 1;
          return new Color(0, saturation, 50, alpha);
        });
      }

      if (this.drawForce.checked)
      {
        particle.drawForce(16, (force) => {
          let saturation = Math.floor((force / 500) * 100);
          let alpha = this.trace.checked ? 0.025 : 1;
          return new Color(0, saturation, 50, alpha);
        });
      }

    }
  }
}