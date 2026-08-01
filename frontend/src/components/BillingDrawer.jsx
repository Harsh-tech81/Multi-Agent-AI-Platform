import { Crown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {useSelector} from "react-redux";
function BillingDrawer({ open, onClose }) {

const {userData} = useSelector((state) => state.user);
console.log("userData in BillingDrawer:", userData);
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
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed right-0 top-0 h-screen w-[380px]  bg-[#0f1117] border-1 border-white/10 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <div className="text-white text-lg font-semibold">Billing</div>
                <div className="text-slate-400 text-sm">Plans & Credits</div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
              >
                <X size={18} className="text-slate-300" />
              </button>
            </div>

            <div className=" p-5">
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p>Current Plan</p>
                    <h3>
{
    userData?.plan 
}

                    </h3>
                  </div>
                  <Crown/>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;
