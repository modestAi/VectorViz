import { IoLogoGithub } from "react-icons/io";

export default function Github() {
  return (
    <div className="absolute bottom-2 left-2 z-10 flex items-center justify-center">
      <a href="https://github.com/modestAi/VectorViz" target="_blank">
        <IoLogoGithub className="hover:scale-110 duration-150 h-6 w-6 fill-slate-500 hover:fill-slate-300" />
      </a>
    </div>
  );
}
