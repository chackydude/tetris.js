//Класс с обработчиком событий и
export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.isPlaying = false;
        this.intervalId = null;

        // TODO: DOM элементы во -> view

        // desktop
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        document.addEventListener('keyup', this.handleKeyup.bind(this));

        let arrows = [
            document.getElementById("button-left"),
            document.getElementById("button-up"),
            document.getElementById("button-right"),
            document.getElementById("button-down")
        ]; // left -> up -> right -> down

        // mobile
        arrows[0].addEventListener("click", () => {
            this.game.movePieceLeft();
            this.updateView();
        });
        arrows[1].addEventListener("click", () => {
            this.game.rotatePiece();
            this.updateView();
        });
       arrows[2].addEventListener("click", () => {
            this.game.movePieceRight();
            this.updateView();
        });
        arrows[3].addEventListener("click", () => {
            this.game.movePieceDown();
            this.updateView();
        });

        this.pauseDialog = document.getElementById("pause-wrapper");
        this.gameOverDialog = document.getElementById("game-over-wrapper");

        let pauseButton = document.querySelector("#pause-button");
        pauseButton.addEventListener("click", () => {
            this.pause();
            this.changePauseDialogVisibility();
        });

        let closePauseDialogButton = document.getElementById("pause-window__close-pause-button");
        closePauseDialogButton.addEventListener("click", () => {
            this.changePauseDialogVisibility();
            this.play();
        });

        let restartPauseDialogButton = document.querySelector(".pause-menu__restart-button");
        restartPauseDialogButton.addEventListener("click", () => {
            this.changePauseDialogVisibility();
            this.reset();
        });

        let restartGameOverButton = document.querySelector(".game-over-menu__restart-button");
        restartGameOverButton.addEventListener("click", () => {
            this.closeGameOverDialog();
            this.reset();
        });

        this.scorePlaceholder = document.getElementById("user-score");

        // this.view.renderStartScreen();
        this.play();
    }

    changePauseDialogVisibility() {
        this.pauseDialog.style.display = this.pauseDialog.style.display === "grid" ? "none" : "grid";
    }

    showGameOverDialog(score) {
        this.gameOverDialog.style.display = "grid";
        this.scorePlaceholder.innerText = `Score: ${score}`
    }

    closeGameOverDialog() {
        this.gameOverDialog.style.display = "none";
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
            // this.view.renderEndScreen(state);
            this.showGameOverDialog(state.score);
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