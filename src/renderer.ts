import Engine from "./engine";

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

  public fpsDisplay: HTMLSpanElement;
  public framesDisplay: HTMLSpanElement;
  public timeDisplay: HTMLSpanElement;
  public deltaTimeDisplay: HTMLSpanElement;

  public wantedFpsDisplay: HTMLSpanElement;
  public fpsIntervalDisplay: HTMLSpanElement;
  
  constructor(engine: Engine, fps: number) {
    this.engine = engine;
    this.fps = fps;
    this.fpsInterval = 1000 / this.fps;



    this.fpsDisplay = document.getElementById('fps-value') as HTMLSpanElement;
    this.framesDisplay = document.getElementById('frames-value') as HTMLSpanElement;
    this.timeDisplay = document.getElementById('time-value') as HTMLSpanElement;
    this.deltaTimeDisplay = document.getElementById('delta-time-value') as HTMLSpanElement;

    this.wantedFpsDisplay = document.getElementById('wanted-fps-value') as HTMLSpanElement;
    this.fpsIntervalDisplay = document.getElementById('fps-interval-value') as HTMLSpanElement;

    this.wantedFpsDisplay.innerText = this.fps.toFixed(4);
    this.fpsIntervalDisplay.innerText = this.fpsInterval.toFixed(4);

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
      this.fpsDisplay.innerText = (1000 / this.deltaTime).toFixed(0);
      

      // Display current amount of frames that has passed
      this.framesDisplay.innerText = this.frames.toString();

      // Display current time
      this.timeDisplay.innerText = this.elapsed.toFixed(0) + "ms";

      // Display current delta time
      this.deltaTimeDisplay.innerText = this.deltaTime.toFixed(4) + "ms";

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