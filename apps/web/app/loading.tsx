export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center text-center w-screen h-screen">
      <h1 className="text-5xl text-center font-black opacity-0"
        style={{ animation: 'fadeIn 1s ease-out forwards' }}
      >
        Načítám...
      </h1>
    </div>
  )
}
