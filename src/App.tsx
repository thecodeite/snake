import { RefCallback, useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './App.css'

function App() {
  const map = useSnake();

  
  
  return (
    <>
      <a href="https://github.com/thecodeite/snake">https://github.com/thecodeite/snake</a>
      <pre style={{lineHeight: 0.8, border: '1px solid white', width: 'min-content', margin: '1em auto'}}>{map}</pre>
    </>
  )
}

interface P {
  x: number;
  y: number;
}

interface State {
  headPos: P;
  foodPos: P;
  direction: P;
  tailLength: number;
  tail: P[];

}

function useSnake() {
  const width = 20;
  const height = 20;

  const [state, setState] = useState<State>({
    headPos: { x: 10, y: 10 },
    foodPos: { x: 15, y: 10 },
    direction: { x: 0, y: 1 },
    tailLength: 5,
    tail: [],
  });

  const { headPos, foodPos } = state;

  const render = (x: number, y: number) => {
    if (x === headPos.x && y === headPos.y) {
      return 'O';
    }
    if (x === foodPos.x && y === foodPos.y) {
      return '#';
    }
    if (state.tail.find(p => p.x === x && p.y === y)) {
      return 'o';
    }
    return ' ';
  };

  const map = Array.from({ length: height }).map((_, y) => Array.from({ length: width }).map((_, x) => render(x,y)));



  const { ref } = useSwipeable({
    onSwipedLeft: () => setState((state) => ({ ...state, direction: { x: -1, y: 0 } })),
    onSwipedRight: () => setState((state) => ({ ...state, direction: { x: 1, y: 0 } })),
    onSwipedUp: () => setState((state) => ({ ...state, direction: { x: 0, y: -1 } })),
    onSwipedDown: () => setState((state) => ({ ...state, direction: { x: 0, y: 1 } })),
  }) as { ref: RefCallback<Document> };
  
  useEffect(() => {
    ref(document);
    // Clean up swipeable event listeners
    return () => ref(null);
  });

  useEffect(() => {
    
  

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        setState((state) => ({ ...state, direction: { x: 0, y: -1 } }));
      }
      if (e.key === 'ArrowDown') {
        setState((state) => ({ ...state, direction: { x: 0, y: 1 } }));
      }
      if (e.key === 'ArrowLeft') {
        setState((state) => ({ ...state, direction: { x: -1, y: 0 } }));
      }
      if (e.key === 'ArrowRight') {
        setState((state) => ({ ...state, direction: { x: 1, y: 0 } }));
      }

    });

    const handle = setInterval(() => {
      setState((state) => {
        const { direction } = state;
        let { headPos, tail, tailLength, foodPos } = state;

        headPos = {
          x: headPos.x + direction.x,
          y: headPos.y + direction.y,
        };

        if(headPos.x === foodPos.x && headPos.y === foodPos.y) {
          tailLength++;
          do{
          foodPos = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
          };
        } while(tail.find(p => p.x === foodPos.x && p.y === foodPos.y));
        }

        if(headPos.x < 0) headPos.x = width - 1;
        if(headPos.x >= width) headPos.x = 0;
        if(headPos.y < 0) headPos.y = height - 1;
        if(headPos.y >= height) headPos.y = 0;

        if (tail.find(p => p.x === headPos.x && p.y === headPos.y)) {
          clearInterval(handle);
        }

        tail = [headPos, ...tail].slice(0, tailLength);

        return {
          ...state,
          headPos,
          foodPos,
          tail,
          tailLength
        };
      });
    }, 250);

    return () => {
      clearInterval(handle); 
    }
  }, []);

  return  map.map(row => row.join('')).join('\n')
   
}

export default App
