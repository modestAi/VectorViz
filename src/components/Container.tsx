import { useState } from "react";
import { MdOutlineControlCamera } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import FieldAdderForm from "./container-components/FieldAdderForm";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import FieldLister from "./container-components/FieldLister";
import SelectTypeForm from "./container-components/SelectTypeForm";
import { Tooltip } from "radix-ui";
import { PiVectorThreeDuotone } from "react-icons/pi";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { VectorType } from "../store/VectorSlice";


const slideFade: Variants = {
  initial: {
    opacity: 0,
    x: 200,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      type: "spring",
    },
  },
  exit: {
    opacity: 0,
    x: 200,
    transition: {
      duration: 0.5,
      type: "spring",
    },
  },
};


export default function Container(props: { currentState: boolean; onReset: () => void }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showFields, setShowFields] = useState(true);
  const fields = useSelector((data: RootState) => data.vectorList)


  return (
    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
      <AnimatePresence mode="wait">
        <div>
          {!showSettings ?
            <SettingsButton onClickAction={() => setShowSettings(true)} />
            : (

              <motion.div
                key="close"
                {...slideFade}
                className="rounded p-2 bg-slate-950 text-amber-50 border border-slate-700 flex flex-col gap-2 max-h-[90vh] overflow-hidden"
              >
                <button onClick={() => setShowSettings(false)} className="cursor-pointer rounded-[50%] p-0.5 flex items-center justify-center  hover:bg-red-600/15 self-end">
                  <IoMdClose className="w-5 h-5  fill-red-400 hover:fill-red-500 duration-250" />
                </button>
                <FieldAdderForm />
                <SelectTypeForm />
                <ToggleableFieldView fields={fields} onToggleClick={(b: boolean) => setShowFields(b)} showFields={showFields} />
              </motion.div>
            )}

        </div>
      </AnimatePresence>
      <ResetCameraButton onReset={props.onReset} />
    </div>
  );
}

function SettingsButton(props: { onClickAction: () => void }) {
  return (<Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <motion.div
          key="setting"
          {...slideFade}
          className="rounded p-2 bg-slate-950 text-amber-50 border border-slate-700"
        >
          <button onClick={props.onClickAction} className="cursor-pointer flex items-center justify-center">
            <PiVectorThreeDuotone className="w-7 h-7 fill-slate-400 hover:fill-amber-300 duration-350 " />
          </button>
        </motion.div>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="left"
          className="bg-slate-800 text-white px-2 py-1 rounded z-1000 "
        >
          Edit vectors
          <Tooltip.Arrow className="fill-slate-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
  )
}

function ResetCameraButton(props: { onReset: () => void }) {

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.div
            layout
            className="rounded  w-fit self-end bg-slate-950 text-amber-50 p-2 border border-slate-700"
          >
            <motion.button
              onClick={props.onReset}
              className="flex items-center justify-center  cursor-pointer"
            >
              <MdOutlineControlCamera className="w-7 h-7 fill-slate-400 hover:fill-amber-300 duration-350" />
            </motion.button>
          </motion.div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="left"
            className="bg-slate-800 text-white px-2 py-1 rounded z-1000 "
          >
            Reset Camera
            <Tooltip.Arrow className="fill-slate-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )

}

function ToggleableFieldView(props: { fields: VectorType[], showFields: boolean, onToggleClick: (b: boolean) => void }) {
  const len = props.fields.length;
  return len > 0 && ((props.showFields) ? (
    <div className="flex flex-col gap-0.5 flex-1 min-h-0" >
      <button
        className="cursor-pointer duration-200  hover:text-slate-300 self-end text-[12px] text-slate-400"
        onClick={() => props.onToggleClick(false)}
      >
        Hide field{len > 1 && 's'}
      </button>
      <div className="overflow-y-auto flex-1 min-h-0 pr-1">
        <FieldLister />
      </div>
    </div>
  ) : (
    <div className="flex flex-col">
      <button
        className="cursor-pointer  duration-200 self-end hover:text-slate-300 text-[12px] text-slate-400"
        onClick={() => props.onToggleClick(true)}
      >
        Show field{len > 1 && 's'}
      </button>
    </div>
  ))
}
