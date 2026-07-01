export default async function ShopPage() {
  return (
    <div className="mt-5 w-full min-h-100 bg-green-800 dark:bg-blue-900 transition-discrete duration-300 rounded-t-3xl overflow-hidden">
      <div className="w-full h-auto bg-repeat bg-size-[14px_16px] lg:bg-size-[25px_25px] bg-[linear-gradient(rgba(125,125,125,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(155,125,125,0.1)_1px,transparent_1px)]">
        <div className="ml-auto w-55 h-55 bg-radial-[at_100%_0%] from-green-300/45 dark:from-blue-300/50 to-transparent to-72%"></div>
        <h4 className="w-fit mx-auto p-1 uppercase text-3xl font-semibold text-amber-100 dark:text-amber-300">
          Привет всем! Народ налетай, подешевело...
        </h4>
        <div className="mr-auto w-55 h-55 bg-radial-[at_0%_100%] from-green-300/45 dark:from-blue-300/50 to-transparent to-72%"></div>
      </div>
    </div>
  );
}
