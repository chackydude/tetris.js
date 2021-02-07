import View from "./view.js";
import Game from "./model.js";
import Controller from "./conroller.js";

const root = document.querySelector('#root');

const game = new Game();
const view = new View(root, 310, 413, 20, 10);
const controller = new Controller(game, view);

window.game = game;
window.view = view;
window.controller = controller; 

 

