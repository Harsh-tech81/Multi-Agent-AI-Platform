import { auth, googleProvider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import api from "../../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { setUserData } from "../redux/userSlice";
import { useSelector,useDispatch } from "react-redux";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";
function Home() {
  const {userData} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log("User Data from Redux:", userData);
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserData(data));
    } catch (error) {
      console.log(error);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    await handleLogin(token);
  };

  return (
    <div className="flex h-screen bg-[#0d0f14] text-white overflow-hidden">

<SideBar/>
<ChatArea/>
<Artifact/>



    {
      !userData && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
        <div className="flex w-[340px] bg-[#13151c] border border-white/[0.88] rounded-2xl p-7 flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
              Welcome to AgentFlow AI
            </h2>
            <p className="text-[13px] text-slate-500">
              Please login to continue using the app.
            </p>
          </div>
          <button
            className="w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-200  transition-all duration-150 cursor-pointer"
            onClick={googleLogin}
          >
            <FcGoogle size={15} />
            Continue With Google
          </button>
        </div>
      </div>
    }
    </div>
  );
  
}

export default Home;
