import * as React from "react";

export default function App() {
  return (
    <GameLoopProvider>
      <Game />
    </GameLoopProvider>
  );
}

const Game = () => {
  const [helloWorldId, setHelloWorldId] = React.useState(null);
  const { subscribe, unsubscribe } = useGameLoop();

  React.useEffect(() => {
    const helloWorldId = subscribe(() => {
      console.log("hello world");
    });

    setHelloWorldId(helloWorldId);

    return () => {
      unsubscribe(helloWorldId);
    };
  }, [subscribe, unsubscribe]);

  return (
    <>
      The game... <button onClick={() => unsubscribe(helloWorldId)}>weg</button>
    </>
  );
};

const GameLoopContext = React.createContext();

function GameLoopProvider({ children }) {
  const callbacksRef = React.useRef([]);

  const subscribe = React.useCallback((callback) => {
    const id = callbacksRef.current.push(callback);
    console.log("subscribed id " + id);
    return id;
  }, []);

  const unsubscribe = React.useCallback((id) => {
    callbacksRef.current.splice(id - 1, 1);
    console.log("unsubscribed id " + id);
  }, []);

  const value = { subscribe, unsubscribe };

  return (
    <GameLoopContext.Provider value={value}>
      {children}
    </GameLoopContext.Provider>
  );
}

function useGameLoop() {
  const context = React.useContext(GameLoopContext);
  if (context === undefined) {
    throw new Error("useGameLoop must be used within a GameLoopProvider");
  }
  return context;
}

export { GameLoopProvider, useGameLoop };
