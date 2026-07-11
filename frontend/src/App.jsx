import Home from "./pages/Home";
import getCurrUser from "./features/getCurrUser";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const getUser = async () => {
      await getCurrUser();
    };

    getUser();
  }, []);

  return (
    <>
      <Home />
    </>
  );
}

export default App;
