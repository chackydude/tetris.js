import View from "./view.js";
import Game from "./model.js";
import Controller from "./conroller.js";

// 20 - wrapper's margin-top, 100vh mobile bug
document.querySelector(".wrapper").style.height = (document.documentElement.clientHeight.toString() - 20)+ 'px';

const root = document.querySelector('#root');

const game = new Game();
const view = new View(root, 310, 413, 20, 10);
const controller = new Controller(game, view);

window.game = game;
window.view = view;
window.controller = controller; 

 

