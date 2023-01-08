import './style.css'
import Renderer from './renderer';
import Engine from './engine';
import UI from './interface';


// Using Engine and Renderer classes to create a game


let ui = new UI(document.body, "gui");
let engine = new Engine(ui);
let renderer = new Renderer(engine, 60);
ui.createHTMLNode();
ui.addHTMLNode();

renderer.run();