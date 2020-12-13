const X = false; // wall
const _ = true; // pass
const Coords = {x: 0, y: 3};

const markedStep = 'X'; // так будет отмечаться пройденный путь.
const rightStep = _; // для более комфортного чтения кода.
const arrPath = []; // сода будут записываться координаты шагов по массиву.

const Maze = [
    [X,X,X,X,_,X,X,X,X],
    [X,_,X,_,_,X,_,_,X],
    [X,_,X,X,_,X,_,X,X],
    [_,_,X,_,_,_,_,X,_],
    [X,_,X,_,X,_,X,X,X],
    [X,_,_,_,X,_,_,_,X],
    [X,X,X,X,X,X,X,X,X],
];

// ищем возможные варианты для следующего шага. далее отфильтроввываем из получившегося массива те,
// что по своему значению соответсвуют "rightStep".
const getPossibleSteps = (maze, start) => {

    const x = start.x;
    const y = start.y;
    const arrNewSteps = [];

    if (maze[y-1] !== undefined) arrNewSteps.push({ x: x, y: y-1, value: maze[y-1][x] });
    if (maze[y+1] !== undefined) arrNewSteps.push({ x: x, y: y+1, value: maze[y+1][x] });
    if (maze[y][x-1] !== undefined) arrNewSteps.push({ x: x-1, y: y, value: maze[y][x-1] });
    if (maze[y][x+1] !== undefined) arrNewSteps.push({ x: x+1, y: y, value: maze[y][x+1] });

    return arrNewSteps.filter((i) => i.value === rightStep);
};

// т.к по условиям задачи ман не известно есть ли у лабиринта выходы,
// мы находим их по условиям: выход должен находиться на краю массива,
// и координаты выхода не должны совпадать с координатами входа.
const getExitPoints = (maze, start) => {

    const arrExitPoints = [];

    for (let i=0; i<maze.length; i++) {
        for (let j=0; j<maze[i].length; j++) {
            if (maze[i-1] === undefined) arrExitPoints.push({ x: j, y: i, value: maze[i][j] });
            if (maze[i+1] === undefined) arrExitPoints.push({ x: j, y: i, value: maze[i][j] });
            if (maze[i][j-1] === undefined) arrExitPoints.push({ x: j, y: i, value: maze[i][j] });
            if (maze[i][j+1] === undefined) arrExitPoints.push({ x: j, y: i, value: maze[i][j] });
        }
    }

    for (let f=0; f<arrExitPoints.length; f++) {
        if (arrExitPoints[f].x === start.x && arrExitPoints[f].y === start.y) {
            arrExitPoints.splice(f, 1);
        }
    }

    return arrExitPoints.filter(k => k.value === rightStep);
};

// далее мы проверяем дошли ли мы до выхода из лабиринта
// для этого сравниваем координаты текущей позиции с координатам выхода.
// т.к. точек выхода может быть несколько - делаем перебор.
// и т.к. далее мы будем использовать булевы значения - в результате работы этой функции
// мы должны получить либо "true" либо "false".
const checkOutputs = (currentPoint, exit) => {
    for (let i=0; i<exit.length; i++) {
        if (currentPoint.x === exit[i].x && currentPoint.y === exit[i].y) {

            return true;
        }
    }

    return false;
};

// т.к .далее идёт рекурсивная фенкция, а количество и координаты воходов из лабиринта
// нам нужно получить только одир раз - для этого вызываем функцию "getExitPoints"
// и сохраняем результат в переменную.
const exitPoint = getExitPoints(Maze, Coords);


const walk = (maze, start) => {
    arrPath.push(`следующий шаг (х: ${start.x}, у: ${start.y}).`);
    maze[start.y][start.x] = markedStep;

    const possibleStep = getPossibleSteps(maze, start);

    // проверка на возможность шагать и на наличие выходов
    if (possibleStep.length > 0 && exitPoint.length > 0) {

        // перебор вариантов ходов (если у нас несколько смежных ячеек со значением "rightStep")
        for (let i=0; i<possibleStep.length; i++) {
            let nextStep = possibleStep[i];
            const isSolved = checkOutputs(nextStep, exitPoint);

            if (isSolved) {
                maze[nextStep.y][nextStep.x] = markedStep;
                arrPath.push(`выход из лабиринта (х: ${nextStep.x}, у: ${nextStep.y}).`);
                console.log('выход найден!');

                return console.log(arrPath);
            } else {
                walk(maze, nextStep);
            }
        }
    }
};

walk(Maze, Coords);