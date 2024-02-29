export default function Loading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-center">
      <h1
        className="text-center text-5xl font-black opacity-0"
        style={{ animation: "fadeIn 1s ease-out forwards" }}
      >
        Načítám...
      </h1>
    </div>
  );
}
