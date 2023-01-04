import './style.css'
import Renderer from './renderer';
import Engine from './engine';
import UI from './interface';


// Using Engine and Renderer classes to create a game


let engine = new Engine();
let renderer = new Renderer(engine, 60);
//let ui = new UI();

let gui = document.getElementById("gui") as HTMLDivElement;

document.addEventListener("keydown", (ev: KeyboardEvent) => {
    switch (ev.key) {
        case "u":
            gui.style.display = gui.style.display === "none" ? "block" : "none";
            break;
    }
});


renderer.run();