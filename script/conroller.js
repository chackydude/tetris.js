export default class Controller {
    constructor(game, view) {

        this.game = game;
        this.view = view;
        this.isPlaying = false;
        this.intervalId = null;

        // desktop controls
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        document.addEventListener('keyup', this.handleKeyup.bind(this));


        // mobile controls
        view.arrows[0].addEventListener("click", () => {
            this.game.movePieceLeft();
            this.updateView();
        });
        view.arrows[1].addEventListener("click", () => {
            this.game.rotatePiece();
            this.updateView();
        });
        view.arrows[2].addEventListener("click", () => {
            this.game.movePieceRight();
            this.updateView();
        });
        view.arrows[3].addEventListener("click", () => {
            this.game.movePieceDown();
            this.updateView();
        });


        view.pauseButton.addEventListener("click", () => {
            this.pause();
            this.view.changePauseDialogVisibility();
        });

        view.closePauseDialogButton.addEventListener("click", () => {
            this.view.changePauseDialogVisibility();
            this.play();
        });

        view.restartPauseDialogButton.addEventListener("click", () => {
            this.view.changePauseDialogVisibility();
            this.reset();
        });

        view.restartGameOverButton.addEventListener("click", () => {
            this.view.closeGameOverDialog();
            this.reset();
        });

        this.play();
    }

    update() {
        this.game.movePieceDown();
        this.updateView();
    }

    // resumes game, shows MainScreen with the current pieces
    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    // stops game, shows PauseScreen
    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }

    // restarts game, shows new clear MainScreen
    reset() {
        this.game.reset();
        this.play();
    }

    // updates view, based on state
    updateView() {
        const state = this.game.getState();

        if (state.isGameOver) {
            // this.view.renderEndScreen(state);
            this.view.showGameOverDialog(state.score);
        } else if  (!this.isPlaying) {
            this.view.renderPauseScreen();
        } else {
            this.view.renderMainScreen(state);
        }
    }

    // makes pieces running down, changing their speed which based on the current level
    startTimer() {

        //Переменная определяющая интервал, с которым фигура будет менять координату OY, т.е. двигаться вниз
        const speed = 1000 - this.game.getState().level * 100;

        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.update();
            }, speed > 0 ? speed : 100);
        }
    }

    // freezes piece
    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // user's clicks handler
    handleKeydown(event) {
        const state = this.game.getState();

        console.log(event.code);

        switch (event.code) {
            case "Enter":// Enter
                if (state.isGameOver) {
                    this.reset();
                } else if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case "ArrowLeft": // Левая стрелка
                this.game.movePieceLeft();
                this.updateView();
                break;
            case "ArrowUp": //	Верхняя стрелка
                this.game.rotatePiece();
                this.updateView();
                break;
            case "ArrowRight": // Правая стрелка
                this.game.movePieceRight();
                this.updateView();
                break;
            case "ArrowDown": // Нижняя стрелка
                this.stopTimer();
                this.game.movePieceDown();
                this.updateView();
                break;
        };
    }

    handleKeyup(event) {
        switch (event.code) {
            case "ArrowDown": // Нижняя стрелка
                this.startTimer();
                break;
        }
    }
}