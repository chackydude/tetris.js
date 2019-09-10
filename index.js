class Game {
	score = 0;
	lines = 0;
	level = 0;
	playfield = [
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],	
	 ];
	activePiece = {
		x: 0,
		y: 0,
		blocks: [
		 [0, 1, 0],	
		 [1, 1, 1],	
		 [0, 0, 0]
		]
	};

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
};

const game = new Game();
window.game = game;