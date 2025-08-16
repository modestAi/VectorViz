export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full">
      <div className="loader"></div>
      <div className="text-[16px] text-blue-200">Loading...</div>
    </div>
  );
}
