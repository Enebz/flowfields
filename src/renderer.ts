export default class Renderer {
  public fps: number;
  public fpsInterval: number;
  public then: number;
  public now: number = 0;
  public startTime: number;
  public elapsed: number = 0;
  public deltaTime: number = 0;
  public engine: Engine;
  
  constructor(fps: number, engine: Engine) {
    this.fps = fps;
    this.fpsInterval = 1000 / this.fps;
    this.then = Date.now();
    this.startTime = this.then;
    this.engine = engine;
  }

  tick() {
    requestAnimationFrame(() => {
      this.tick()
    })

    this.now = Date.now();
    this.deltaTime = this.now - this.then;

    // if enough time has elapsed, draw the next frame
    if (this.deltaTime > this.fpsInterval) {

      // Update total elapsed
      this.elapsed = this.now - this.startTime;

      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.then = this.now - (this.deltaTime % this.fpsInterval);

      // Put your drawing code here
      this.engine.update(this.deltaTime);
      this.engine.draw();
    }
  }

  run() {
    this.engine.start();
    this.tick();
  }
}