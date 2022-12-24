import './style.css'
import Renderer from './renderer';
import Engine from './engine';





let engine = new Engine();
let renderer = new Renderer(25, engine);




renderer.run();