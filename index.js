class Game {
	static points = {
		'1': 40,
		'2': 100,
		'3': 300,
		'4': 1200
	};
	score = 0;
	lines = 0;
	playfield = this.createPlayfield();
	activePiece = this.createPiece();

	nextPiece = this.createPiece();

	get level() {
		return Math.floor(this.lines * 0.1); 
	}

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
			score: this.score,
			level: this.level,
			lines: this.lines,
			nextPiece: this.nextPiece,
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
	 	const index = Math.floor(Math.random() * 7);
	 	const type ='IJLOSTZ'[index];
	 	const piece = {};

	 	switch (type) {
	 		case 'I':
	 			piece.blocks = [
	 				[0,0,0,0],
	 				[1,1,1,1],
	 				[0,0,0,0],
	 				[0,0,0,0]
	 			];
	 			break;
	 		case 'J':
	 			piece.blocks = [
	 				[0,0,0],
	 				[2,2,2],
	 				[0,0,2]
	 			];
	 			break;
	 		case 'L':
	 			piece.blocks = [
	 				[0,0,0],
	 				[3,3,3],
	 				[3,0,0]
	 			];
	 			break;
	 		case 'O':
	 			piece.blocks = [
	 				[0,0,0,0],
	 				[0,4,4,0],
	 				[0,4,4,0],
	 				[0,0,0,0]
	 			];
	 			break;
	 		case 'S':
	 			piece.blocks = [
	 				[0,0,0],
	 				[0,5,5],
	 				[5,5,0]
	 			];
	 			break;
	 		case 'T':
	 			piece.blocks = [
	 				[0,0,0],
	 				[6,6,6],
	 				[0,6,0]
	 			];
	 			break;
	 		case 'Z':
	 			piece.blocks = [
	 				[0,0,0],
	 				[7,7,0],
	 				[0,7,7]
	 			];
	 			break;
	 		default: 
	 			throw new Error('Неизвестный тип фигуры');
	 	}

	 	piece.x = Math.floor((10 - piece.blocks[0].length)/2);
	 	piece.y = -1;

		return piece;
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
			const clearedLines = this.clearLines();
			this.updateScore(clearedLines);
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

	clearLines() {
		const rows = 20;
		const colums = 10;
		let lines = [];

		for (let y = rows - 1; y >= 0; y--) {
			let numberOfBlocks = 0;

			for (let x = 0; x < colums; x++) {
				if (this.playfield[y][x]) {
					numberOfBlocks += 1;
				}
			}

			if (numberOfBlocks === 0) {
				break;
			} else if (numberOfBlocks < colums) {
				continue;
			} else if (numberOfBlocks === colums) {
				lines.unshift(y);
			}
		}
		for (let index of lines) {
			this.playfield.splice(index, 1);
			this.playfield.unshift(new Array(colums).fill(0));
		}

		return lines.length;
	}

	updateScore(clearLines) {
		if (clearLines > 0) {
			this.score += Game.points[clearLines] * (this.level + 1);
			this.lines += clearLines;
		}
	}

	updatePieces() {
		this.activePiece = this.nextPiece;
		this.nextPiece = this.createPiece();
	}
};

class View {
	static colors = { 
		'1': 'cyan',
		'2': 'blue',
		'3': 'orange',
		'4': 'yellow',
		'5': 'green',
		'6': 'purple',
		'7': 'red'
	};

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

	render(state) {
		this.clearScreen();
		this.renderPlayfield(state);	
		this.renderPanel(state)
	}
	
	clearScreen() {
		 this.context.clearRect(0, 0, this.width, this.height);
	}

	renderPlayfield({ playfield} ) {
	for (let y = 0; y < playfield.length; y++) {
				const line = playfield[y];

				for (let x = 0; x < line.length; x++) {
					const block = line[x];

					if (block) {
						this.renderBlock(x * this.blockWidth, y * this.blockHeight, this.blockWidth, this.blockHeight, View.colors[block]);
				}
			}
		}
	}

	renderPanel({ level, score, lines, nextPiece }) {
		this.context.textAlign = 'start';
		this.context.textBaseline = 'top';
		this.context.fillStyle = 'white';
		this.context.font = '14px "Press start 2P"';
		
		this.context.fillText(`Score: ${score}`, 0, 0);	
		this.context.fillText(`Lines: ${lines}`, 0, 24);
		this.context.fillText(`Level: ${level}`, 0, 48);
		this.context.fillText('Next', 0, 96);

		for (let y = 0; y < nextPiece.blocks.length; y++) {
			for (let x = 0; x < nextPiece.blocks[y].length; x++) {
				const block = nextPiece.blocks[y][x];

				if (block) {
					this.renderBlock(
						x * this.blockWidth,
						y * this.blockHeight,
						this.blockWidth,
						this.blockHeight,
						View.colors[block]
					);
				};
			};
		};
	};

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

view.render(game.getState()); //5:38