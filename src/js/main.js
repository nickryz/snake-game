// import "babel-polyfill";
window.addEventListener('DOMContentLoaded', init);

// import $ from 'jquery';

function init () {
    
    
    // cтартовые праметры
    var startLength = 5;
    var startColumn = 15;
    var startInterval = 200;    
    
    
    
    var table = document.querySelector('.table');
    var row = document.querySelectorAll('.row');
    var cell = document.querySelectorAll('.cell');
    var activeCellClass = 'cell--active';
    var btnStart = document.querySelector('.btn-start');
    var overlayStart = document.querySelector('.start-overlay');
    var scoreValue = document.querySelector('.coins-box').children[0];
    
    var appleImg = document.createElement('img');
        appleImg.classList.add('apple-img');
        appleImg.src = "img/apple.svg";
        appleImg.alt = "apple";
    
    var message = document.createElement('p');
        message.classList.add('message');
    
    var cord = [];
    var way = moveUp;
    var coins = 0;
    
    
    // добавление в массив кординат ячеек (конструктор)
    function AddCord(row, cell) {
        this.row = row;
        this.cell = cell;
    }

    // получение кординат головы по строке (row)
    function getCordRow() {
        return cord[cord.length - 1].row;
    }

    // получение кординат головы по ячейке (cell)
    function getCordCell() {
        return cord[cord.length - 1].cell;
    }
    
    // формирует новую ячейку змеи (красит)
    function addNewCell() {
       table.rows[getCordRow()].cells[getCordCell()].classList.add(activeCellClass);
       table.rows[getCordRow()].cells[getCordCell()].dataset.snake = 's';
    }
    
    // удаляет последнюю ячейку змеи (убирает цвет)
    function removeLastCell() {
        table.rows[cord[0].row].cells[cord[0].cell].classList.remove(activeCellClass);
        table.rows[cord[0].row].cells[cord[0].cell].removeAttribute('data-snake');
        cord.shift();
    }

    
    // отрисовка стартовой змейки
    function renderStartPosition() {
        for(var i = 0; i < startLength; i++) {
            table.rows[ (row.length - 1) - i ].cells[startColumn - 1].classList.add(activeCellClass);
            table.rows[(row.length - 1) - i].cells[startColumn - 1].dataset.snake = 's';
            cord.push(new AddCord (row.length - 1 - i, startColumn - 1) );
        }
    }

    // генерирование новой произвольной точки (яблоко)
    function newApple() {
        var randomRow = Math.floor( Math.random() * row.length);
        var randomCell = Math.floor(Math.random() * cell.length / row.length);
        
        if (table.rows[randomRow].cells[randomCell].dataset.snake === 's') {
            newApple();
        } else {
            table.rows[randomRow].cells[randomCell].dataset.tag = 'a';
            table.rows[randomRow].cells[randomCell].appendChild(appleImg);

            if (coins === 0) {
                message.innerHTML = 'Let\'s play?';
                table.rows[randomRow].cells[randomCell].appendChild(message);
            } else if (coins === 1) {
                message.innerHTML = 'А есть меня-то зачем?';
                table.rows[randomRow].cells[randomCell].appendChild(message);
            } else if (coins === 2) {
                message.innerHTML = 'Фигня, а не игра...';
                table.rows[randomRow].cells[randomCell].appendChild(message);
            } 
        }
    }

    // удаление атрибута с произвольной точки после поглащения
    function removeDotAttribute() {
        var delDot = document.querySelector('[data-tag="a"]');
        delDot.removeAttribute('data-tag');
        if (document.querySelector('.message')) { document.querySelector('.message').remove() };
        if (document.querySelector('.apple-img')) { document.querySelector('.apple-img').remove() };
        ++coins;
        coinsPlus();
    }

    // добавляет очки при поглащении точки
    function coinsPlus() {
        scoreValue.innerHTML = coins;
    }


    // движенние змейки вверх
     function moveUp() {
        
        if (table.rows[getCordRow() - 1].cells[getCordCell()].dataset.tag === 'a' && getCordRow() - 1 >= 0) {
            cord.push(new AddCord(getCordRow() - 1, getCordCell()));
            addNewCell();
            removeDotAttribute();
        }

        if (getCordRow() - 1 >= 0) {
            cord.push(new AddCord(getCordRow() - 1, getCordCell()) );
            addNewCell();
            removeLastCell();
        }
    }

    // движенние змейки вниз
    function moveDown() {
            
        if (table.rows[getCordRow() + 1].cells[getCordCell()].dataset.tag === 'a' && getCordRow() + 1 <= row.length - 1) {
            cord.push(new AddCord(getCordRow() + 1, getCordCell()));
            addNewCell();
            removeDotAttribute();
        } 

        if (getCordRow() + 1 <= row.length - 1) {
            cord.push(new AddCord(getCordRow() + 1, getCordCell()));
            addNewCell();
            removeLastCell();
        }
    }

    // движенние змейки вправо
    function moveRight() {
            
        if (table.rows[getCordRow()].cells[getCordCell() + 1].dataset.tag === 'a' && getCordCell() + 1 <= cell.length / row.length - 1) {
            cord.push(new AddCord(getCordRow(), getCordCell() + 1));
            addNewCell();
            removeDotAttribute();
        }

        if (getCordCell() + 1 <= cell.length / row.length - 1) {
            cord.push(new AddCord(getCordRow(), getCordCell() + 1));
            addNewCell();
            removeLastCell();
        }
    }

    // движенние змейки влево
    function moveLeft() {
        
        if (table.rows[getCordRow()].cells[getCordCell() - 1].dataset.tag === 'a' && getCordCell() - 1 >= 0) {
            cord.push(new AddCord(getCordRow(), getCordCell() - 1));
            addNewCell();
            removeDotAttribute();
        }

        if (getCordCell() - 1 >= 0) {
            cord.push(new AddCord(getCordRow(), getCordCell() - 1));
            addNewCell();
            removeLastCell();
        }
        
    }

    // проверка проигрыша 
    function checkGameOver() {
        
        if (getCordRow() === 0 && way === moveUp
            || getCordRow() === row.length - 1 && way === moveDown
            || getCordCell() === 0 && way === moveLeft
            || getCordCell() === cell.length / row.length - 1 && way === moveRight
            || getCordRow() === 0 && way === moveDown && table.rows[getCordRow() + 1].cells[getCordCell()].dataset.snake === 's'  
            || getCordRow() === row.length - 1 && way === moveUp && table.rows[getCordRow() - 1].cells[getCordCell()].dataset.snake === 's'
            || getCordCell() === 0 && way === moveRight && table.rows[getCordRow()].cells[getCordCell() + 1].dataset.snake === 's'
            || getCordCell() === cell.length / row.length - 1 && way === moveLeft && table.rows[getCordRow()].cells[getCordCell() - 1].dataset.snake === 's')  {
            
            return false;
        } else if (getCordRow() - 1 >= 0 && getCordRow() + 1 <= row.length - 1 && getCordCell() - 1 >= 0 && getCordCell() + 1 <= cell.length / row.length - 1) {
            
            if (table.rows[getCordRow() - 1].cells[getCordCell()].dataset.snake === 's' && way === moveUp 
                || table.rows[getCordRow() + 1].cells[getCordCell()].dataset.snake === 's' && way === moveDown 
                || table.rows[getCordRow()].cells[getCordCell() - 1].dataset.snake === 's' && way === moveLeft 
                || table.rows[getCordRow()].cells[getCordCell() + 1].dataset.snake === 's' && way === moveRight) {
                
                return false;
            }
            
            return true;
        } else {
            return true;
        }
    }


    // функция сброса при проигрыше
    function gameClear() {
        var activeCells = document.querySelectorAll('.' + activeCellClass);
        var appleCell = document.querySelector('[data-tag="a"]');
        
        activeCells.forEach(function (elem) {
            elem.classList.remove(activeCellClass);
            elem.removeAttribute('data-snake');
        });
        
        appleCell.removeAttribute('data-tag'); 
        
        if (document.querySelector('.apple-img')) { document.querySelector('.apple-img').remove() };
        if (document.querySelector('.message')) { document.querySelector('.message').remove() };
        
        coins = 0;
        scoreValue.innerHTML = 0;
        way = moveUp;
        overlayStart.style.display = 'block';
        cord = [];
    }

    // изменение направления
    function getWay(e) {
        e.preventDefault();

        var key = e.keyCode;

        if (key !== 38 && key !== 40 && key !== 37 && key !== 39) {
            return;
        } else if (key === 39 && way !== moveLeft) {
            way = moveRight;
        } else if (key === 38 && way !== moveDown) {
            way = moveUp;
        } else if (key === 40 && way !== moveUp) {
            way = moveDown;
        } else if (key === 37 && way !== moveRight) {
            way = moveLeft;
        }

        window.removeEventListener('keydown', getWay);
    }
    
    
    
    // обработчик на кнопку старт
    btnStart.addEventListener('click', start);
    
    var startEnter = window.addEventListener('keydown', function startFromEnter(e) {
        var key = e.keyCode;
        if (key === 13 && overlayStart.style.display !== 'none') { 
            start() 
        }
    });
    



    // запуск
    function start() {
        overlayStart.style.display = 'none';
        renderStartPosition();
        newApple();
        
        setTimeout(function run() {

            window.addEventListener('keydown', getWay);
            
            if (!document.querySelector('[data-tag="a"]')) {
                newApple();
            }
            
            if(checkGameOver()) {
                way();
                setTimeout(run, startInterval - coins * 2);
            } else {
                gameClear();
                alert('game over');
            }
        }, startInterval);
    }

    

    
    
}








