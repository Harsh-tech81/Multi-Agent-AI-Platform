import { Crown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../features/createOrder";
import { verifyPayment } from "../features/verifyPayment";
import getCurrUser from "../features/getCurrUser";
import { setUserData } from "../redux/userSlice";
function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Agent-Flow-AI",
        description: `Upgrade to ${plan} plan`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await verifyPayment(response);
            const refreshedUser = await getCurrUser();
            if (refreshedUser) {
              dispatch(setUserData(refreshedUser));
            }
            onClose();
          } catch (error) {
            console.log("Error verifying payment:", error);
          }
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Error upgrading plan:", error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-screen w-[380px] bg-[#181a20] border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#14161c]">
              <div>
                <div className="text-white text-lg font-semibold tracking-tight">
                  Billing
                </div>
                <div className="text-slate-400 text-sm">Plans & Credits</div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} className="text-slate-300" />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-5 flex flex-col gap-4 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className=" text-slate-400 text-sm">Current Plan</p>
                    <h3 className="text-xl font-bold text-white ">
                      {userData?.plan || "free"}
                    </h3>
                  </div>
                  <Crown className="text-yellow-400" />
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Credits</span>
                    <span>
                      {userData?.credits || 0} / {userData?.totalCredits || 100}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{
                        width: `${((userData?.credits || 0) / (userData?.totalCredits || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 flex-1 overflow-auto space-y-4">
              <div className="rounded-xl border border-white/10 p-4">
                <h3 className="text-white font-semibold">Starter Plan</h3>

                <p className="text-indigo-400 text-2xl font-bold mt-2">₹199</p>
                <p className="text-slate-400 text-sm mt-1">500 Credits</p>
                <button
                  onClick={() => handleUpgrade("starter")}
                  className="mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2 text-white"
                >
                  Upgrade
                </button>
              </div>
                      
              <div className="rounded-xl border border-white/10 p-4">
                <h3 className="text-white font-semibold">Pro Plan</h3>

                <p className="text-indigo-400 text-2xl font-bold mt-2">₹499</p>
                <p className="text-slate-400 text-sm mt-1">1000 Credits</p>
                <button
                  onClick={() => handleUpgrade("pro")}
                  className="mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2 text-white"
                >
                  Upgrade
                </button>
           
            </div>
            </div>
  
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;
