//Класс визуализации игрового поля, фигур и интерфейса
export default class View {

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

    //Инициализация объектов
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

        // 20 - wrapper's margin-top, 100vh mobile bug
        document.body.style.height = (document.documentElement.clientHeight.toString() - 20)+ 'px';

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
        this.context.font = '35px "Pixel"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('CLICK to Start', this.width / 2, this.height / 2);
    }

    //Отрисовка эрана паузы
    renderPauseScreen() {
        //
        // this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        // this.context.fillRect(0, 0, this.width, this.height);
        //
        // this.context.fillStyle = 'white';
        // this.context.font = '35px "Pixel"';
        // this.context.textAlign = 'center';
        // this.context.textBaseline = 'middle';
        // this.context.fillText('ENTER to Resume', this.width / 2, this.height / 2);
    }

    //Отрисовка эрана game over'a
    renderEndScreen({score}) {
        this.clearScreen();

        this.context.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.fillStyle = 'white';
        this.context.font = '35px "Pixel"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
        this.context.fillText('CLICK to Restart', this.width / 2, this.height / 2 + 48);
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
        this.context.font = '20px "Pixel"';

        this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 0);
        this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 24);
        this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 48);
        this.context.fillText('Next:', this.panelX, this.panelY + 80);

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