//Главный класс (1-238 строки) 
class Game {
	//Зависимость получения очков от количества убранных строк (lines)
	static points = {
		'1': 40,
		'2': 100,
		'3': 300,
		'4': 1200
	}; 

	constructor() {
		this.reset();
	}

	//Метод возвращающий значение уровня (каждые 10 убранных строк - новый уровень)
	get level() {
		return Math.floor(this.lines * 0.1); 
	}

	//Состояние игры на данный момент (уровень, очки, убранные строки, следующая фигура и игшровое поле)
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
			playfield,
			isGameOver: this.topOut
		};
	}

	//Возвращение всех свойств в первоначальное состояние
	reset() {
		this.score = 0;
		this.lines = 0;
		this.topOut = false;
		this.playfield = this.createPlayfield();
		this.activePiece = this.createPiece();
		this.nextPiece = this.createPiece();
	}

	//Метод создающий игровое поле (20х10)
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

	//Метод создающий рандомную фигуру на игровом поле
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

	//Методы для изменения координат фигур
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
		if (this.topOut) return;

		this.activePiece.y += 1;

		if (this.hasCollision()) {
			this.activePiece.y -= 1;
			this.lockPiece();
			const clearedLines = this.clearLines();
			this.updateScore(clearedLines);
			this.updatePieces();
		}

		if (this.hasCollision()) {
			this.topOut = true;
		}
	} 

	//Метод для поворота фигуры
	rotatePiece() {
		this.rotateBlocks();

		if (this.hasCollision()) {
			this.rotateBlocks(false);
		}
	}

	//Метод меняющий конфигурацию фигуры, поворачивающий ее по часовой стрелке
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

	//Метод для проверки наличия препятствий и возможности поворота фигуры
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
 
  	//Метод фиксирующий фигуру, если та попадает на препятствие (другую фигуру или нижнюю границу игрового поля)
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

	//Метод удаляющий полностью заполненные строки с игрового поля и возвращающий количство удаленных строк
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

		return lines.length;	}

	//Изменение счета игры
	updateScore(clearLines) {
		if (clearLines > 0) {
			this.score += Game.points[clearLines] * (this.level + 1);
			this.lines += clearLines;
		}
	}

	//Создание новой фигуры
	updatePieces() {
		this.activePiece = this.nextPiece;
		this.nextPiece = this.createPiece();
	}
};

//Класс визуализации игрового поля, фигур и интерфейса
class View {

	//Возможные цвета фигур
	static colors = { 
		'1': 'cyan',
		'2': 'blue',
		'3': 'orange',
		'4': 'yellow',
		'5': 'green',
		'6': 'purple',
		'7': 'red'
	};

	//Инициальзация объектов 
	constructor(element, width, height, rows, colums) {
		this.element = element;
		this.width = width; 
		this.height = height;

		this.canvas = document.createElement('canvas');
		this.canvas.width = width;
		this.canvas.height = height;
		this.context = this.canvas.getContext('2d');

		this.playfieldBorderWidth = 4;
		this.playfieldX = this.playfieldBorderWidth;
		this.playfieldY = this.playfieldBorderWidth;
		this.playfieldWidth = this.width * 2/3;
		this.playfieldHeight = this.height;
		this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
		this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;
 
		this.blockWidth = this.playfieldInnerWidth / colums;
		this.blockHeight = this.playfieldInnerHeight / rows;

		this.panelX = this.playfieldWidth + 10;
		this.panelY = 0;
		this.panelWidth = this.width / 3;
		this.panelHeight = this.height;

		this.element.appendChild(this.canvas);
	}

	//отрисовка главного экрана
	renderMainScreen(state) {
		this.clearScreen();
		this.renderPlayfield(state);	
		this.renderPanel(state)
	}
	
	//Метод удаляющий с поля предыдущую конфигурацию фигуры
	clearScreen() {
		 this.context.clearRect(0, 0, this.width, this.height);
	}

	//Отрисовка стартового экрана
	renderStartScreen() {
		this.context.fillStyle = 'white';
		this.context.font = '18px "Press Start 2P"';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
	}

	//Отрисовка эрана паузы
	renderPauseScreen() {

		this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
		this.context.fillRect(0, 0, this.width, this.height);

		this.context.fillStyle = 'white';
		this.context.font = '18px "Press Start 2P"';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
	}

	//Отрисовка эрана game over'a
	renderEndScreen({score}) {
		this.clearScreen();

		this.context.fillStyle = 'rgba(0, 0, 0, 0.75)';
		this.context.fillRect(0, 0, this.width, this.height);
		this.context.fillStyle = 'white';
		this.context.font = '18px "Press Start 2P"';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
		this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
		this.context.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 48);
	}

	//Отгрисовка игрового поля
	renderPlayfield({ playfield} ) {
	for (let y = 0; y < playfield.length; y++) {
				const line = playfield[y];

				for (let x = 0; x < line.length; x++) {
					const block = line[x];

					if (block) {
						this.renderBlock(
							this.playfieldX + (x * this.blockWidth), 
							this.playfieldY + (y * this.blockHeight), 
							this.blockWidth, 
							this.blockHeight,
							View.colors[block]
					);
				}
			}
		}

		this.context.strokeStyle = 'white';
		this.context.lineWidth = this.playfieldBorderWidth;
		this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight);

	}

	//Отгрисовка интерфейса игровой панели
	renderPanel({ level, score, lines, nextPiece }) {
		this.context.textAlign = 'start';
		this.context.textBaseline = 'top';
		this.context.fillStyle = 'white';
		this.context.font = '14px "Press start 2P"';
		
		this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 0);	
		this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 24);
		this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 48);
		this.context.fillText('Next:', this.panelX, this.panelY + 96);

		for (let y = 0; y < nextPiece.blocks.length; y++) {
			for (let x = 0; x < nextPiece.blocks[y].length; x++) {
				const block = nextPiece.blocks[y][x];

				if (block) {
					this.renderBlock(
						this.panelX + (x * this.blockWidth * 0.5),
						this.panelY + 100 + (y * this.blockHeight * 0.5),
						this.blockWidth * 0.5,
						this.blockHeight * 0.5,
						View.colors[block]
					);
				};
			};
		};
	};

	//Отрисовка фигуры на игровом поле 
	renderBlock(x, y, width, height, color) {
		this.context.fillStyle = color;
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 2;

		this.context.fillRect(x, y, width, height);
		this.context.strokeRect(x, y, width, height);
	}
}

//Класс с обработчиком событий и 
class Controller {
	constructor(game, view) {
		this.game = game;
		this.view = view;
		this.isPlaying = false;
		this.intervalId = null;

		document.addEventListener('keydown', this.handleKeydown.bind(this));
		document.addEventListener('keyup', this.handleKeyup.bind(this));

		this.view.renderStartScreen();
	}

	update() {
		this.game.movePieceDown();
		this.updateView();
	}

	//Метод для возобновления игрового процесса (отображение MainScreen и текущего расположения фигур)
	play() {
		this.isPlaying = true;
		this.startTimer();
		this.updateView();
	}

	//Метод для остановки игрового процесса (отображение PauseScreen)
	pause() {
		this.isPlaying = false;
		this.stopTimer();
		this.updateView();
	}

	//Метод перезапуска игрового процесса (отображение начального MainScreen)
	reset() {
		this.game.reset();
		this.play();

	}

	//Метод обновления конфигурации игрового поля и положения фигуры
	updateView() {
		const state = this.game.getState();

		if (state.isGameOver) {
			this.view.renderEndScreen(state);
		} else if  (!this.isPlaying) {
			this.view.renderPauseScreen();
		} else {
			this.view.renderMainScreen(state);
		}
	}

	//Метод, перемещаюйщий фигуры вниз, с каждым уровнем скорость их "падения" возрастает
	startTimer() {

		//Переменная определяющая интервал, с которым фигура будет менять координату OY, т.е. двигаться вниз
		const speed = 1000 - this.game.getState().level * 100;

			if (!this.intervalId) {
				this.intervalId = setInterval(() => {
				this.update();
			}, speed > 0 ? speed : 100);
		}
	}

	//Метод для прекращения изменения OY координат фигуры
	stopTimer() {
			if (this.intervalId) {
				clearInterval(this.intervalId);
				this.intervalId = null;
			}
	}

	//Отработчик событий 
	handleKeydown(event) {
		const state = this.game.getState();

		switch (event.keyCode) {
				case 13:// Enter
					if (state.isGameOver) {
						this.reset();
					} else if (this.isPlaying) {
						this.pause();
					} else {
						this.play();
					}
					break;
				case 37: // Левая стрелка
					this.game.movePieceLeft();
					this.updateView();
					break;
				case 38: //	Верхняя стрелка
					this.game.rotatePiece();
					this.updateView();
					break;
			    case 39: // Правая стрелка
					this.game.movePieceRight();
					this.updateView();
					break;
				case 40: // Нижняя стрелка
					this.stopTimer();
					this.game.movePieceDown();
					this.updateView();
					break;
		};
	}
	
	handleKeyup(event) {
		switch (event.keyCode) {
				case 40: // Нижняя стрелка
					this.startTimer();	
					break;
		}
	}
} 

const root = document.querySelector('#root');

const game = new Game();
const view = new View(root, 480, 640, 20, 10);
const controller = new Controller(game, view);

window.game = game;
window.view = view;
window.controller = controller; 

 

