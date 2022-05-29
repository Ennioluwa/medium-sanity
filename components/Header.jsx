import Navbar from './Navbar'

const Header = () => {
  return (
    <header className=" h-full w-full bg-yellow-400">
      <div className=" container mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-5 bg-yellow-400 py-10  px-10 md:grid-cols-12 xl:mx-auto xl:py-0">
        <div className="col-span-1 flex min-h-[500px] flex-col justify-center space-y-5 py-10 md:col-span-8">
          <h1 className=" font-serif text-6xl ">
            <span className=" underline decoration-current decoration-4">
              Medium
            </span>{' '}
            is a place to write, read, and connect
          </h1>
          <p>
            It's easy and free to post your thinking on any topic and connect
            with millions of readers
          </p>
          <button className=" cursor-pointer self-start rounded-full bg-black px-10 py-3 text-lg font-semibold text-white">
            Start Reading
          </button>
        </div>
        <img
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          alt="M logo"
          className=" col-span-1 mx-auto hidden w-44 md:col-span-4 md:inline-flex lg:h-full lg:w-60 xl:w-full"
        />
      </div>
    </header>
  )
}

export default Header
