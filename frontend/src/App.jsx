import Home from "./pages/Home";
import getCurrUser from "./features/getCurrUser";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
     const data = await getCurrUser();
     dispatch(setUserData(data));
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
