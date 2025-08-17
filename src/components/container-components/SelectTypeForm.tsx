import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setType } from "../../store/SceneConfigSlice";
import z from "zod";

const schema = z.object({
  show: z.enum(["Vector", "Point"]),
});

type InputType = z.input<typeof schema>;
type InferType = z.input<typeof schema>;

export default function SelectTypeForm() {
  const selector = useSelector((data: RootState) => data);
  const dispatch = useDispatch();
  const form2 = useForm<InputType, undefined, InferType>({
    resolver: zodResolver(schema),
    defaultValues: {
      show: selector.sceneConfig.type,
    },
  });

  const handleToggle: SubmitHandler<InferType> = (data) => {
    dispatch(setType(data.show));
  };

  return (
    <>
      <form
        className="p-1 flex gap-5 text-[13px] [&_*]:cursor-pointer"
        onChange={() => form2.handleSubmit(handleToggle)()}
      >
        <label className="flex gap-2 ">
          <input type="radio" value="Vector" {...form2.register("show")} />
          Show vectors
        </label>

        <label className="flex gap-2">
          <input type="radio" value="Point" {...form2.register("show")} />
          Show points
        </label>
      </form>
    </>
  );
}
