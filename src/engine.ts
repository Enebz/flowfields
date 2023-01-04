import Canvas from "./canvas";
import { Entity, Circle } from "./entities";
import { Vector3 } from './utils';
import { PerlinField } from "./vectorfields";

export default class Engine1 {
  public particles: Circle[] = [];
  public perlinfield: PerlinField;
  public main_scene: Canvas;
  public perlinfield_scene: Canvas;

  public particlesCountControl: HTMLInputElement;
  public particlesCountControlValue: HTMLSpanElement;

  public speedControl: HTMLInputElement;
  public speedControlValue: HTMLSpanElement;

  public forceControl: HTMLInputElement;
  public forceControlValue: HTMLSpanElement;

  public noiseScaleControl: HTMLInputElement;
  public noiseScaleControlValue: HTMLSpanElement;

  public timeScaleControl: HTMLInputElement;
  public timeScaleControlValue: HTMLSpanElement;

  public trace: HTMLInputElement;

  public showVectors: HTMLInputElement;
  
  constructor() {
    let canvases = document.getElementById("canvases") as HTMLElement;
    this.main_scene = new Canvas(canvases, "main-scene", window.innerWidth, window.innerHeight, "rgba(0, 0, 0, 0)");
    this.perlinfield_scene = new Canvas(canvases, "perlinfield-scene", window.innerWidth, window.innerHeight, "rgba(0, 0, 0, 0)");
    

    this.particlesCountControl = document.getElementById("particles-count") as HTMLInputElement;
    this.particlesCountControlValue = document.getElementById("particles-count-value") as HTMLSpanElement;
    this.particlesCountControl.oninput = (ev) => {
      if (ev.target === null) return;

      const target = ev.target as HTMLInputElement;

      this.particlesCountControlValue.innerText = target.value;
      // Change entities array to new length by resizing it and filling it with new entities
      this.particles.length = parseInt(target.value);
      for (let i = 0; i < this.particles.length; i++) {
        if (this.particles[i] === undefined) {
          this.particles[i] = new Circle(
            this.main_scene,
            new Vector3(Math.random() * this.perlinfield.width + this.perlinfield.pos.x, Math.random() * this.perlinfield.height + this.perlinfield.pos.y),
            new Vector3(0, 0),
            new Vector3(0, 0),
            1,
            1,
            parseFloat(this.speedControl.value),
            "rgba(255, 255, 255, " + (this.trace.checked ? "0.025" : "1") + ")"
          );
        }
      }
    }

    this.speedControl = document.getElementById("speed") as HTMLInputElement;
    this.speedControlValue = document.getElementById("speed-value") as HTMLSpanElement;
    this.speedControl.oninput = (ev) => {
      if (ev.target === null) return;

      const target = ev.target as HTMLInputElement;

      this.speedControlValue.innerText = target.value;
      for (const entity of this.particles)
      {
        entity.terminalVel = parseFloat(target.value);
      }
    }

    this.forceControl = document.getElementById("force") as HTMLInputElement;
    this.forceControlValue = document.getElementById("force-value") as HTMLSpanElement;
    this.forceControl.oninput = (ev) => {
      if (ev.target === null) return;

      const target = ev.target as HTMLInputElement;

      this.forceControlValue.innerText = target.value;
      this.perlinfield.forceCoef = parseFloat(target.value);
    }

    // UIPanel.slider("noise-scale", 0.01, 0.1, 0.01, 0.01, (value) => {
    //   this.perlinfield.noiseScale = value;
    // });

    this.noiseScaleControl = document.getElementById("noise-scale") as HTMLInputElement;
    this.noiseScaleControlValue = document.getElementById("noise-scale-value") as HTMLSpanElement;
    this.noiseScaleControl.oninput = (ev) => {
      if (ev.target === null) return;

      const target = ev.target as HTMLInputElement;

      this.noiseScaleControlValue.innerText = target.value;
      this.perlinfield.noiseScale = parseFloat(target.value);
    }

    this.timeScaleControl = document.getElementById("time-scale") as HTMLInputElement;
    this.timeScaleControlValue = document.getElementById("time-scale-value") as HTMLSpanElement;
    this.timeScaleControl.oninput = (ev) => {
      if (ev.target === null) return;

      const target = ev.target as HTMLInputElement;

      this.timeScaleControlValue.innerText = target.value;
      this.perlinfield.timeScale = parseFloat(target.value);
    }

    this.trace = document.getElementById("trace") as HTMLInputElement;
    this.trace.addEventListener("change", (ev: Event) => {
      if (ev.target === null) return;

      const target = ev.target as HTMLInputElement;

      if (target.checked) {
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
    })

    this.showVectors = document.getElementById("show-vectors") as HTMLInputElement;
    this.showVectors.addEventListener("change", (ev: Event) => {
      if (ev.target === null) return;

      const target = ev.target as HTMLInputElement;

      if (target.checked) {
        this.perlinfield_scene.clear();
        this.perlinfield.draw();
      } else {
        this.perlinfield_scene.clear();
      }
    });

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
      parseFloat(this.noiseScaleControl.value),
      parseFloat(this.timeScaleControl.value),
      2,
      parseFloat(this.forceControl.value)
    );

    this.particles = [];
    
    for (var i = 0; i < parseInt(this.particlesCountControl.value); i++) {
      let p = new Circle(
        this.main_scene,
        new Vector3(Math.random() * this.perlinfield.width + this.perlinfield.pos.x, Math.random() * this.perlinfield.height + this.perlinfield.pos.y),
        new Vector3(0, 0),
        new Vector3(0, 0),
        1,
        1,
        parseFloat(this.speedControl.value),
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

    this.showVectors.checked ? this.perlinfield.draw() : null
  
    for (const entity of this.particles) {
      entity.draw();
    }
  }
}