import { IoMdAdd } from "react-icons/io";
import { addVector } from "../store/VectorSlice";
import z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

const process = z
  .string()
  .min(1)
  .refine((e) => !isNaN(Number(e)))
  .transform(Number);

export const schema = z.object({
  x: process,
  y: process,
  z: process,
});

type InferType = z.infer<typeof schema>;
type InputType = z.input<typeof schema>;

function Form() {
  const form = useForm<InputType, undefined, InferType>({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();

  const submitHandler: SubmitHandler<InferType> = (data) => {
    try {
      dispatch(
        addVector({
          id: uuidv4(),
          vector: new THREE.Vector3(data.x, data.y, data.z),
        })
      );
      form.reset();
    } catch (err) {
      // Map Redux throw → form field error
      if (err instanceof Error) form.setError("root", { message: err.message, type: "manual" });
    }
  };

  return (
    <>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="flex flex-row items-center gap-2 mb-10 mt-3 justify-between"
      >
        <div className="flex gap-5">
          <input type="text" {...form.register("x")} className="input-style " placeholder="x" />
          <input type="text" {...form.register("y")} className="input-style " placeholder="y" />
          <input type="text" className="input-style" {...form.register("z")} placeholder="z" />
        </div>

        <button
          type="submit"
          className="rounded-[50%] w-7 h-7 hover:bg-overlay-light-0 p-1 cursor-pointer"
        >
          <IoMdAdd className="fill-emerald-500 h-[100%] w-[100%]" />
        </button>
      </form>

      {
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 4 }}
          className="text-[12px] text-red-500 "
        >
          {form.formState.errors.root?.message}
        </motion.span>
      }
    </>
  );
}

export default Form;
