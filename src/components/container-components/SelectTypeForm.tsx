import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setType } from "../../store/SceneConfigSlice";
import z from "zod";
import { motion } from "framer-motion";

const schema = z.object({
  show: z.enum(["Vector", "Point"]),
});

type InputType = z.input<typeof schema>;
export default function SelectTypeForm() {
  const type = useSelector((state: RootState) => state.sceneConfig.type);
  const dispatch = useDispatch();

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: { show: type },
  });


  const selected = form.watch("show");

  const handleToggle: SubmitHandler<InputType> = (data) => {
    if (data.show !== type) dispatch(setType(data.show));
  };

  return (
    <div className="w-full flex justify-center">
      <form
        className="relative flex w-full max-w-xs rounded-2xl bg-slate-800/30
               backdrop-blur-md border border-slate-700/50 shadow-lg overflow-hidden"
        onChange={form.handleSubmit(handleToggle)}
      >
        {/* Sliding background */}
        <motion.div
          className="absolute top-0 left-0 h-full w-1/2
                 bg-gradient-to-r from-indigo-500/10 to-purple-500/10
                 rounded-2xl shadow-inner"
          animate={{ x: selected === "Vector" ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        />

        {["Vector", "Point"].map((option) => (
          <label
            key={option}
            className="flex-1 text-sm text-center font-medium text-slate-200
                   tracking-wide cursor-pointer z-10 py-2
                   hover:text-white transition-colors"
          >
            <input
              type="radio"
              value={option}
              className="sr-only"
              {...form.register("show")}
            />
            {option}
          </label>
        ))}
      </form>
    </div>
  );
}
