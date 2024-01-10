import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";

import { FaImage } from "react-icons/fa";
export default function Carousel({ children: slides, setState: setCurrent, state: current, onChangeFunction }) {

  let previousSlide = () => {
    if (current === 0) setCurrent(slides.length);
    else setCurrent(current - 1);
  };

  let nextSlide = () => {
    if (current === slides.length) setCurrent(0);
    else setCurrent(current + 1);
  };

  return (
    <div className="relative w-3/5">
      <div className="overflow-hidden">
        <div
          className={`flex transition ease-out duration-400`}
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {slides}
          <form className="w-full flex-shrink-0 flex justify-center items-center border-4 border-dashed">
            <input type="file" name="file" id="file" hidden onChange={e => onChangeFunction(e)} />
            <label htmlFor="file" className="cursor-pointer w-full h-full flex items-center justify-center">
              <FaImage size={200} className="text-fourth" />
            </label>
          </form>
        </div>
      </div>

      <button onClick={previousSlide} className="absolute z-30 top-[50%] left-[-20%]">
        <BsFillArrowLeftCircleFill size={70} className="text-first" />
      </button>
      <button onClick={nextSlide} className="absolute z-30 top-[50%] right-[-20%]">
        <BsFillArrowRightCircleFill size={70} className="text-first" />
      </button>
    </div>
  );
}