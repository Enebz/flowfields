import Canvas from "./canvas";
import { Entity, Circle } from "./entities";
import UI, { CheckBox, Panel, Slider } from "./interface";
import { Vector3 } from './utils';
import { PerlinField } from "./vectorfields";

export default class Engine1 {
  public ui: UI;

  public engine_panel: Panel;
  public renderer_panel: Panel;

  public particle_count: Slider;
  public speed: Slider;
  public fieldforce: Slider;
  public noiseScale: Slider;
  public timeScale: Slider;
  public trace: CheckBox;
  public showPerlinField: CheckBox;

  public particles: Circle[] = [];
  public perlinfield: PerlinField;
  public main_scene: Canvas;
  public perlinfield_scene: Canvas;
  
  constructor(ui: UI) {
    // Canvas
    let canvases = document.getElementById("canvases") as HTMLElement;
    this.main_scene = new Canvas(canvases, "main-scene", window.innerWidth, window.innerHeight, "rgba(0, 0, 0, 0)");
    this.perlinfield_scene = new Canvas(canvases, "perlinfield-scene", window.innerWidth, window.innerHeight, "rgba(0, 0, 0, 0)");

    // UI
    this.ui = ui;

    // Panels
    this.engine_panel = new Panel("engine-panel");

    this.ui.addPanel(this.engine_panel);

    // Particles count
    this.particle_count = new Slider("particle-count", "Particles count", 0, 1000, 100, 1);
    this.particle_count.round = true;
    this.particle_count.onInputCallback = (value) => {
      // Change entities array to new length by resizing it and filling it with new entities
      this.particles.length = value;
      for (let i = 0; i < this.particles.length; i++) {
        if (this.particles[i] === undefined) {
          this.particles[i] = new Circle(
            this.main_scene,
            new Vector3(Math.random() * this.perlinfield.width + this.perlinfield.pos.x, Math.random() * this.perlinfield.height + this.perlinfield.pos.y),
            new Vector3(0, 0),
            new Vector3(0, 0),
            1,
            1,
            this.speed.value,
            "rgba(255, 255, 255, " + (this.trace.checked ? "0.025" : "1") + ")"
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
    this.trace = new CheckBox("trace", "Trace");
    this.trace.onChangeCallback = (checked: boolean) => {
      if (checked) {
        this.main_scene.clear();

        for (const particle of this.particles)
        {
          particle.color = "rgba(255, 255, 255, 0.025)";
        }
      } else {
        for (const particle of this.particles)
        {
          particle.color = "rgba(255, 255, 255, 1)";
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

    // Reset
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "r") {
        this.start();
      }
    });
  }

  start() {
    this.main_scene.clear();
  
    this.perlinfield = new PerlinField(
      this.perlinfield_scene,
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
        this.main_scene,
        new Vector3(Math.random() * this.perlinfield.width + this.perlinfield.pos.x, Math.random() * this.perlinfield.height + this.perlinfield.pos.y),
        new Vector3(0, 0),
        new Vector3(0, 0),
        1,
        1,
        this.speed.value,
        "rgba(255, 255, 255, " + (this.trace.checked ? "0.025" : "1") + ")"
      );
      this.particles.push(p);
    }
  }
  
  update(deltaTime: number) {
    this.perlinfield.update(deltaTime);
      
    // Update particles
    for (const particle of this.particles) {
      this.perlinfield.affect(particle);
      particle.update(deltaTime);
    }
  }
  
  draw() {
    if (!this.trace.checked) {
      this.main_scene.clear();
    }

    this.perlinfield_scene.clear();

    this.showPerlinField.checked ? this.perlinfield.draw() : null
  
    for (const entity of this.particles) {
      entity.draw();
    }
  }
}