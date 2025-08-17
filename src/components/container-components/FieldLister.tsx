import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { delVector, updateVector, type VectorType } from "../../store/VectorSlice";
import { IoMdTrash } from "react-icons/io";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as THREE from "three";
import { schema } from "./FieldAdderForm";

function FieldLister() {
  const vecList = useSelector((data: RootState) => data.vectorList);
  return (
    <div className="flex gap-1 flex-col overflow-auto">
      {vecList.map((e) => (
        <Field key={e.id} vec={e} />
      ))}
    </div>
  );
}

type InferType = z.infer<typeof schema>;
type InputType = z.input<typeof schema>;

function Field(props: { vec: VectorType }) {
  const { vector } = props.vec;

  const form = useForm<InputType, undefined, InferType>({
    defaultValues: {
      x: String(vector.x),
      y: String(vector.y),
      z: String(vector.z),
    },
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();

  const submitHandler: SubmitHandler<InferType> = (data) => {
    const obj: VectorType = {
      id: props.vec.id,
      vector: new THREE.Vector3(data.x, data.y, data.z),
      color: props.vec.color,
    };
    dispatch(updateVector({ vector: obj }));
  };

  return (
    <div className="flex flex-row gap-2 justify-between items-center ">
      <div className="flex gap-5">
        <input
          type="text"
          {...form.register("x")}
          className="input-style "
          onBlur={() => form.handleSubmit(submitHandler)()}
        />

        <input
          type="text"
          {...form.register("y")}
          className="input-style "
          onBlur={() => form.handleSubmit(submitHandler)()}
        />

        <input
          type="text"
          className="input-style "
          {...form.register("z")}
          onBlur={() => form.handleSubmit(submitHandler)()}
        />
      </div>

      <button
        onClick={() => dispatch(delVector({ id: props.vec.id }))}
        className="rounded-[50%] w-7 h-7 hover:bg-overlay-light-0 p-1 cursor-pointer"
      >
        <IoMdTrash className="fill-red-500 h-[100%] w-[100%]" />
      </button>
    </div>
  );
}

export default FieldLister;
