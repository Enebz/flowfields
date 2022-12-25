import './style.css'
import Renderer from './renderer';
import Engine from './engine';

let engine = new Engine();
let renderer = new Renderer(engine, 60);

renderer.run();