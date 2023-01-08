import Engine from "./engine";
import { Label, Panel } from "./interface";

// This class is a game renderer which is responsible for rendering the game
// to the screen. It is also responsible for handling the game loop.
// It uses dynamic delta time to ensure that the game runs at the same speed
// on all devices.
// Delta time, fps and elapsed time are calculated by the variables then, now, fps and elapsed.
export default class Renderer {
  public fps: number;
  public fpsInterval: number;
  public then: number = Date.now();
  public now: number = Date.now();
  public startTime: number = Date.now();
  public elapsed: number = 0;
  public deltaTime: number = 0;
  public pause: boolean = false;
  public skip: number = 0;
  public frames: number = 0;
  public engine: Engine;

  public renderer_panel: Panel;

  public fpsDisplay: Label;
  public framesDisplay: Label;
  public timeDisplay: Label;
  public deltaTimeDisplay: Label;

  public wantedFpsDisplay: Label;
  public fpsIntervalDisplay: Label;
  
  constructor(engine: Engine, fps: number) {
    this.engine = engine;
    this.fps = fps;
    this.fpsInterval = 1000 / this.fps;

    this.renderer_panel = new Panel("renderer-panel");
    this.engine.ui.addPanel(this.renderer_panel);

    this.fpsDisplay = new Label("fps-value", "FPS: ");
    this.renderer_panel.addElement(this.fpsDisplay);

    this.framesDisplay = new Label("frames-value", "Frames: ");
    this.renderer_panel.addElement(this.framesDisplay);

    this.timeDisplay = new Label("time-value", "Time: ");
    this.renderer_panel.addElement(this.timeDisplay);

    this.deltaTimeDisplay = new Label("delta-time-value", "Delta time: ");
    this.renderer_panel.addElement(this.deltaTimeDisplay);

    this.wantedFpsDisplay = new Label("wanted-fps-value", "Wanted FPS: ", this.fps.toFixed(4));
    this.renderer_panel.addElement(this.wantedFpsDisplay);

    this.fpsIntervalDisplay = new Label("fps-interval-value", "FPS interval: ", this.fpsInterval.toFixed(4));
    this.renderer_panel.addElement(this.fpsIntervalDisplay);

    document.addEventListener("keydown", (ev: KeyboardEvent) => {
      switch (ev.key) {
        case "ArrowRight":
          this.skip += 1;
          break;
        case "ArrowLeft":
          this.skip -= 1;
          break;
        case "p":
          this.pause = !this.pause;
          break;
      }
    });
  }

  tick() {
    requestAnimationFrame(() => {
      this.tick()
    })


    this.now = Date.now();

    this.deltaTime = (this.now - this.then);

    if (!this.pause) {
      this.elapsed += this.deltaTime;
    }

    // if enough time has elapsed, draw the next frame
    if (this.deltaTime + (this.deltaTime % this.fpsInterval) > this.fpsInterval) {
      this.frames++;

      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.then = this.now;
      
      // Display current FPS'
      this.fpsDisplay.text = (1000 / this.deltaTime).toFixed(0);
      

      // Display current amount of frames that has passed
      this.framesDisplay.text = this.frames.toString();

      // Display current time
      this.timeDisplay.text = this.elapsed.toFixed(0) + "ms";

      // Display current delta time
      this.deltaTimeDisplay.text = this.deltaTime.toFixed(4) + "ms";

      if (!this.pause) {
        // Put your drawing code here
        this.engine.update(this.deltaTime);
      } 
      this.engine.draw();
    }
  }

  run() {
    this.engine.start();
    this.engine.draw()
    this.tick();
  }
}