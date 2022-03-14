import React from 'react';
import Food from './Food';
import Snake from './Snake';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y];
}

const directions = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  UP: 'UP',
  DOWN: 'DOWN'
}

const initialPosition = [
  [0,0], 
  [2,0], 
  [4,0]
];

function App() {

  const [snakeDots, setSnakeDots] = React.useState(initialPosition);

  const [foodDot, setFoodDot] = React.useState(getRandomCoordinates());

  const [direction, setDirection] = React.useState(directions.RIGHT);

  const [score, setScore] = React.useState(0);

  const existDot = (coordinates) => {
    return snakeDots.find(c => c[0] === coordinates[0] && c[1] === coordinates[1])
  }

  const eat = (head) => {
    if (head[0] == foodDot[0] && head[1] === foodDot[1]){
      let newCoordinates = getRandomCoordinates();
      while (existDot(newCoordinates)){
        newCoordinates = getRandomCoordinates();
      }
      setFoodDot(newCoordinates);
      let dots = [...snakeDots];
      const diffX = dots[1][0] - dots[0][0];
      const diffY = dots[1][1] - dots[0][1]
      let newDot = [dots[0][0] + diffX, dots[0][1] + diffY];
      dots.unshift(newDot);
      setSnakeDots(dots);
      setScore(prev => prev + 1)
    }
  }

  const gameOver = () => {
    localStorage.setItem('maxScore', ''+score);
    setSnakeDots(initialPosition);
    setScore(0);
  }

  const moveSnake = (dir) => {
    let dots = [...snakeDots];
    let head = dots[dots.length -1];

    switch (dir) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
      case 'DOWN':
        head = [head[0], head[1] +2];
        break;
    }

    //setting left = 0 if pos > 98
    if (head[0] > 98)
      head[0] = 0
    //setting left = 98 if pos < 0
    else if (head[0] < 0)
      head[0] = 98

    //setting top = 0 if pos > 98
    if (head[1] > 98)
      head[1] = 0
    //setting top = 98 if pos < 0
    else if (head[1] < 0)
      head[1] = 98

    if (existDot(head)) {
      gameOver();
      return;
    }

    dots.push(head);
    dots.shift();
    setSnakeDots(dots);
    eat(head);
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      moveSnake(direction)
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [direction, snakeDots]);

  const handleOnKeyDown = (e) => {
    e = e || window.event;
    let direction = '';
    switch (e.keyCode) {
      case 38:
        direction = directions.UP;
        break;
      case 40:
        direction = directions.DOWN;
        break;
      case 37:
        direction = directions.LEFT;
        break;
      case 39:
        direction = directions.RIGHT;
        break;
    }

    setDirection(direction);
    moveSnake(direction);
  }

  return (
    <div className="container">
      <div className="board" tabIndex="0" onKeyDown={handleOnKeyDown}>
        <Snake snakeDots={snakeDots} />
        <Food dot={foodDot} />
      </div>
      <div className="score">
        <p>{score} Ponto(s)</p>
        <p>{localStorage.getItem('maxScore')} Pontuação Máxima</p>
      </div>
    </div>
  );
}

export default App;
