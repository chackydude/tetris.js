class Game {
	score = 0;
	lines = 0;
	level = 0;
	playfield = this.createPlayfield();
	activePiece = this.createPiece();

	nextPiece = this.createPiece();

	getState() {
		const pieceY = this.activePiece.y;
		const pieceX = this.activePiece.x;
		const blocks  = this.activePiece.blocks;
		const playfield = this.createPlayfield();

		for (let y = 0; y < this.playfield.length; y++) {
			playfield[y] = [];
				for (let x = 0; x < this.playfield[y].length; x++) {
					playfield[y][x] = this.playfield[y][x];
			}
		}

		for (let y = 0; y < blocks.length; y++) {
				for (let x = 0; x < blocks[y].length; x++) {
					if (blocks[y][x]) {
							playfield[pieceY + y][pieceX + x] = blocks[y][x];
						}
					}
				}

		return {
			playfield
		};
	}

	createPlayfield() {
		const playfield = [];

		for (let y = 0; y < 20; y++) {
			playfield[y] = [];
				for (let x = 0; x < 10; x++) {
					playfield[y][x] = 0;
			}
		}

		return playfield;					
	}

	createPiece() {
	 

		return {
		x: 0,
		y: 0,
		blocks: [
		 [0, 1, 0],	
		 [1, 1, 1],	
		 [0, 0, 0]
		]
		}; 
	}

	movePieceLeft() {
		this.activePiece.x -= 1;

		if (this.hasCollision()) {
			this.activePiece.x += 1;
		}
	}

	movePieceRight() {
		this.activePiece.x += 1;

		if (this.hasCollision()) {
			this.activePiece.x -= 1;
		}
	}

	movePieceDown() {
		this.activePiece.y += 1;

		if (this.hasCollision()) {
			this.activePiece.y -= 1;
			this.lockPiece();
			this.updatePieces();
		}
	} 

	rotatePiece() {
		this.rotateBlocks();

		if (this.hasCollision()) {
			this.rotateBlocks(false);
		}
	}

	rotateBlocks(clockwise = true) {
		const blocks = this.activePiece.blocks;
		const length = blocks.length;
		const x = Math.floor(length / 2);
		const y = length - 1;

		for (let i = 0; i < x; i++) {
			for (let j = i; j < y - i; j++) {
				const temp = blocks[i][j];

				if (clockwise) {
					blocks[i][j] = blocks[y - j][i];
					blocks[y - j][i] = blocks[y - i][y - j];
					blocks[y - i][y - j] = blocks[j][y - i];
					blocks[j][y - i] = temp;
				} else {
					blocks[i][j] = blocks[j][y - i];
					blocks[j][y - i] = blocks[y - i][y - j];
					blocks[y - i][y - j] = blocks[y - j][i];
					blocks[y - j][i] = temp;
				}
			}
		} 
	}

	hasCollision() {
		const blocks = this.activePiece.blocks;
		const pieceY = this.activePiece.y;
		const pieceX = this.activePiece.x;

		for (let y = 0; y < blocks.length; y++) {
			for (let x = 0; x < blocks[y].length; x++) {
				if (blocks[y][x] && ((this.playfield[pieceY + y] === undefined || this.playfield[pieceY + y][pieceX + x] === undefined) ||
					 this.playfield[pieceY + y][pieceX + x]
					)) {
					return true;
				}
			}
		}

		return false;
	}

	lockPiece() {
		const blocks = this.activePiece.blocks;
		const pieceY = this.activePiece.y;
		const pieceX = this.activePiece.x;

		for (let y = 0; y < blocks.length; y++) {
			for (let x = 0; x < blocks[y].length; x++) {
				if (blocks[y][x]) {
						this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
				}
			}
		}
	}

	updatePieces() {
		this.activePiece = this.nextPiece;
		this.activePiece = this.createPiece();
	}
};

class View {
	constructor(element, width, height, rows, colums) {
		this.element = element;
		this.width = width; 
		this.height = height;

		this.canvas = document.createElement('canvas');
		this.canvas.width = width;
		this.canvas.height = height;
		this.context = this.canvas.getContext('2d');

		this.blockWidth = this.width / colums;
		this.blockHeight = this.height / rows;

		this.element.appendChild(this.canvas);
	}

	render({playfield}) {
		this.clearScreen();
		this.renderPlayfield(playfield);	
	}
	
	clearScreen() {
		 this.context.clearRect(0, 0, this.width, this.height);
	}

	renderPlayfield(playfield) {
	for (let y = 0; y < playfield.length; y++) {
				const line = playfield[y];

				for (let x = 0; x < line.length; x++) {
					const block = line[x];

					if (block) {
						this.renderBlock(x * this.blockWidth, y * this.blockHeight, this.blockWidth, this.blockHeight, 'red');
				}
			}
		}
	}

	renderBlock(x, y, width, height, color) {
		this.context.fillStyle = color;
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 2;

		this.context.fillRect(x, y, width, height);
		this.context.strokeRect(x, y, width, height);
	}
}

const root = document.querySelector('#root');

const game = new Game();
const view = new View(root, 320, 640, 20, 10);

window.game = game;
window.view = view;

document.addEventListener('keydown', event => {
	switch (event.keyCode) {
		case 37: // Левая стрелка
			game.movePieceLeft();
			view.render(game.getState());
			break;
		case 38: //	Верхняя стрелка
			game.rotatePiece();
			view.render(game.getState());
			break;
	    case 39: // Правая стрелка
			game.movePieceRight();
			view.render(game.getState());
			break;
		case 40: // Нижняя стрелка
			game.movePieceDown();
			view.render(game.getState());
			break;
	};
}); 
