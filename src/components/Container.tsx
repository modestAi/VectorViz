import { useState } from "react";
import { MdRestore, MdSettingsSuggest } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import FieldAdderForm from "./container-components/FieldAdderForm";
import { AnimatePresence, anticipate, motion } from "framer-motion";
import FieldLister from "./container-components/FieldLister";
import SelectTypeForm from "./container-components/SelectTypeForm";

export default function Container(props: { currentState: boolean; onReset: () => void }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showFields, setShowFields] = useState(true);

  const slideFade = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.5, ease: anticipate },
  };

  return (
    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
      <AnimatePresence mode="wait">
        <div>
          {!showSettings ? (
            <motion.div
              key="setting"
              {...slideFade}
              className="rounded p-2 bg-slate-950 text-amber-50 border border-slate-700"
            >
              <button onClick={() => setShowSettings(true)} className="cursor-pointer">
                <MdSettingsSuggest className="w-7 h-7 fill-slate-400 hover:fill-amber-300 duration-350" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="close"
              {...slideFade}
              className="rounded p-2 bg-slate-950 text-amber-50 border border-slate-700 flex flex-col gap-2 max-h-[90vh] overflow-hidden"
            >
              <button onClick={() => setShowSettings(false)} className="cursor-pointer self-end">
                <IoMdClose className="w-5 h-5 fill-red-400 hover:fill-red-500 duration-450" />
              </button>
              <FieldAdderForm />
              <SelectTypeForm />
              {showFields ? (
                <div className="flex flex-col gap-0.5 flex-1 min-h-0">
                  <button
                    className="cursor-pointer self-end text-[12px] text-slate-400"
                    onClick={() => setShowFields(false)}
                  >
                    Hide fields
                  </button>
                  {/* This part scrolls */}
                  <div className="overflow-y-auto flex-1 min-h-0 pr-1">
                    <FieldLister />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <button
                    className="cursor-pointer self-end text-[12px] text-slate-400"
                    onClick={() => setShowFields(true)}
                  >
                    Show fields
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </AnimatePresence>
      {/* Restore button now in normal flow */}

      <motion.div
        layout
        className="rounded  w-fit self-end bg-slate-950 text-amber-50 p-2 border border-slate-700"
      >
        <motion.button
          onClick={() => props.onReset()}
          className="flex items-center justify-center  cursor-pointer"
        >
          <MdRestore className="w-7 h-7 fill-slate-400 hover:fill-amber-300 duration-350" />
        </motion.button>
      </motion.div>
    </div>
  );
}
