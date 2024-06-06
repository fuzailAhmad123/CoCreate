import React from "react";
import { useDispatch, useSelector } from "react-redux";
import StrokeColorList from "../../../data/strokecolor-list.json";
import BackgroundColorList from "../../../data/backgroundcolor-list.json";
import HachureListFill from "../../../data/hachurefill-list.json";
import StrokeWidthList from "../../../data/strokewidth-list.json";
import StrokeStyleList from "../../../data/strokeStyle-list.json";
import SloppinessList from "../../../data/sloppiness-list.json";
import EdgesList from "../../../data/edges-list.json"
import {
  setBackgroundColor,
  setBackgroundHachureFill,
  setEdge,
  setSloppiness,
  setStrokeColor,
  setStrokeStyle,
  setStrokeWidth,
} from "../../../slices/styleSlice";
import transparentImage from "../../../assets/images/transparent-bg.jpg";
import ZigZagBackground from "../../../assets/images/zig-zag-bg.png";
import TiltedLinesBackground from "../../../assets/images/tilted-lines-bg.png";
import { GoDash } from "react-icons/go";
import { AiOutlineDash } from "react-icons/ai";
import { AiOutlineSmallDash } from "react-icons/ai";
import { TbBorderRadius } from "react-icons/tb";
import { MdContentCopy } from "react-icons/md";
import { RiDeleteBin3Line } from "react-icons/ri";
import { HiMiniLink } from "react-icons/hi2";

const ToolDesignBar = () => {
  const {
    strokeColor,
    backgroundColor,
    backgroundHachureFill,
    strokeWidth,
    strokeStyle,
    sloppiness,
    edge
  } = useSelector((state) => state.style);
  const dispatch = useDispatch();
  return (
    <div className="w-full min-h-full flex flex-col gap-y-3">
      {/* stroke style  */}
      <div className="">
        <p className="text-[10px] font-extralight text-black dark:text-grey-25 text-opacity-70 helvetica-light ">
          Stroke
        </p>
        <div className="w-full h-[22px] my-1 flex items-center justify-between">
          <div className="flex items-center gap-x-1 border-r border-grey-5 dark:border-none pr-2">
            {StrokeColorList.map((color, index) => (
              <div
                key={index}
                className={`h-[23px] w-[23px] p-[1px] rounded-[3px] ${
                  strokeColor === color
                    ? "border border-blue-100 dark:border-grey-25 border-opacity-50 "
                    : "border-0"
                }`}
              >
                <div
                  onClick={() => dispatch(setStrokeColor(color))}
                  className={`w-full h-full rounded-[3px] bg-color cursor-pointer group relative `}
                  style={{ backgroundColor: color }}
                >
                  <p className="text-[10px] text-white bg-black-5 dark:bg-black-50 dark:border dark:border-grey-25 dark:rounded-[3px] p-1 absolute -bottom-9 left-3 group-hover:block hidden transition-500 bg-opacity-80">
                    {color}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* background color style  */}
      <div className="">
        <p className="text-[10px] font-extralight text-black dark:text-grey-25 text-opacity-70 helvetica-light ">
          Background
        </p>
        <div className="w-full h-[22px] my-1 flex items-center justify-between">
          <div className="flex items-center gap-x-1 border-r border-grey-5 dark:border-none pr-2">
            {BackgroundColorList.map((color, index) => (
              <div
                key={index}
                className={`h-[23px] w-[23px] p-[1px] rounded-[3px] ${
                  backgroundColor === color
                    ? "border border-blue-100 dark:border-grey-25 border-opacity-50 "
                    : "border-0"
                }`}
              >
                <div
                  onClick={() => dispatch(setBackgroundColor(color))}
                  className={`w-full h-full rounded-[3px] bg-color cursor-pointer relative group ${
                    color === "transparent"
                      ? "border border-black border-opacity-20 "
                      : "border-none"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {color === "transparent" && (
                    <img
                      src={transparentImage}
                      alt=""
                      className="h-full object-cover "
                    />
                  )}

                  <p className="text-[10px] text-white dark:border dark:border-grey-25 dark:rounded-[3px]  bg-black p-1 absolute -bottom-9 left-3 group-hover:block hidden transition-500 bg-opacity-80">
                    {color}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* background fill style  */}
      <div className="">
        <p className="text-[10px] font-extralight text-black dark:text-grey-25  text-opacity-70 helvetica-light ">
          Fill
        </p>
        <div className="w-full h-[22px] my-2 flex items-center justify-between">
          <div className=" w-[70%] flex items-center justify-start gap-x-3  ">
            {HachureListFill.map((hachure, index) => (
              <div
                key={index}
                onClick={() => dispatch(setBackgroundHachureFill(hachure))}
                className={`h-[32px] w-[32px] rounded-[10px] flex justify-center items-center cursor-pointer relative  group  ${
                  backgroundHachureFill === hachure
                    ? "bg-blue-25 dark:bg-blue-175 bg-opacity-20 text-blue-100  "
                    : "bg-grey-5 dark:bg-grey-25 dark:bg-opacity-30 "
                }`}
              >
                <div
                  className={`w-[18px] h-[18px] rounded-[3px] overflow-hidden bg-grey-5 ${
                    backgroundHachureFill === hachure
                      ? "border border-blue-100 shadow-md shadow-blue-55 dark:bg-blue-100 dark:bg-opacity-20  "
                      : "border border-black dark:border-grey-25 dark:bg-grey-25 dark:bg-opacity-30  "
                  }`}
                >
                  {hachure === "hachure" ? (
                    <img
                      src={TiltedLinesBackground}
                      className="h-full object-cover "
                    />
                  ) : hachure === "cross-hatch" ? (
                    <img
                      src={ZigZagBackground}
                      className="h-full scale-150 object-cover"
                    />
                  ) : (
                    <div className={`w-[18px] h-[18px] rounded-[3px] ${
                      backgroundHachureFill === hachure
                        ? "border border-blue-100 shadow-md shadow-blue-55 bg-blue-100"
                        : "border  border-black dark:border-grey-25 bg-black dark:bg-grey-25 dark:bg-opacity-30"
                    } `}></div>
                  )}
                </div>

                <p className="w-fit  text-[10px] text-white bg-black-5 dark:bg-black-50 dark:border dark:border-grey-25 dark:rounded-[3px] p-1 absolute -bottom-9 left-3 group-hover:block hidden transition-500 bg-opacity-80">
                    {hachure}
                  </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* stroke width style  */}
      <div className="">
        <p className="text-[10px] font-extralight text-black dark:text-grey-25  text-opacity-70 helvetica-light ">
          Stroke width
        </p>
        <div className="w-full h-[22px] my-2 flex items-center justify-start gap-x-3">
          <div className=" w-[70%] flex items-center justify-between  ">
            {StrokeWidthList.map((stroke, index) => (
              <div
                key={index}
                onClick={() => dispatch(setStrokeWidth(stroke?.value))}
                className={`h-[32px] w-[32px] rounded-[10px] flex justify-center items-center cursor-pointer transition-500   ${
                  strokeWidth === stroke?.value
                    ? "bg-blue-25 dark:bg-blue-175 bg-opacity-20 text-blue-100 "
                    : "bg-grey-5 dark:bg-grey-25 dark:bg-opacity-30 border-none"
                }`}
              >
                <div
                  className={`w-[10px] rounded-[30px] relative group  ${
                    strokeWidth === stroke?.value ? "bg-blue-100" : "bg-black-5 dark:bg-grey-25"
                  } ${
                    stroke?.name === "Thin"
                      ? "h-[2px]"
                      : stroke?.name === "Bold"
                      ? "h-[3px]"
                      : "h-[4px]"
                  }`}
                >
                    <p className="text-[10px] text-white bg-black-5 dark:bg-black-50 dark:border dark:border-grey-25 dark:rounded-[3px] p-1 absolute -bottom-9 left-3 group-hover:block hidden transition-500 bg-opacity-80">
                    {stroke?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* stroke style  */}
      <div className="">
        <p className="text-[10px] font-extralight text-black dark:text-grey-25  text-opacity-70 helvetica-light ">
          Stroke style
        </p>
        <div className="w-full h-[22px] my-2 flex items-center justify-between">
          <div className=" w-[70%] flex items-center justify-start gap-x-3  ">
            {StrokeStyleList.map((style, index) => (
              <div
                key={index}
                onClick={() => dispatch(setStrokeStyle(style.value))}
                className={`h-[32px] w-[32px] rounded-[10px] flex justify-center items-center cursor-pointer transition-500  ${
                  strokeStyle === style.value
                    ? "bg-blue-25 dark:bg-blue-175  bg-opacity-20 text-blue-100 "
                    : "bg-grey-5 dark:bg-grey-25 dark:bg-opacity-30 border-none"
                }`}
              >
                <p className="relative group">
                  {
                    style.name === "Line" ?  <GoDash/> :
                    style.name === "Dashed" ? <AiOutlineDash/> :
                    style.name === "Dotted" ? <AiOutlineSmallDash/> : <></>
                  }
                    <p className="text-[10px] text-white bg-black-5 dark:bg-black-50 dark:border dark:border-grey-25 dark:rounded-[3px] p-1 absolute -bottom-9 left-3 group-hover:block hidden transition-500 bg-opacity-80">
                    {style.name}
                  </p>
                  </p>
              </div>
            ))}
          </div>
        </div>
      </div>

       {/* sloppiness  */}
       <div className="">
        <p className="text-[10px] font-extralight text-black dark:text-grey-25  text-opacity-70 helvetica-light ">
          Sloppiness
        </p>
        <div className="w-full h-[22px] my-2 flex items-center justify-between">
          <div className=" w-[70%] flex items-center justify-start gap-x-3  ">
            {SloppinessList.map((slope, index) => (
              <div
                key={index}
                onClick={() =>
                  dispatch(setSloppiness(slope.value))
                }
                className={`h-[32px] w-[32px] rounded-[10px] flex justify-center items-center cursor-pointer transition-500  ${
                  sloppiness === slope.value
                    ? "bg-blue-25 dark:bg-blue-175 bg-opacity-20 text-blue-100 "
                    : "bg-grey-5 dark:bg-grey-25 dark:bg-opacity-30 border-none"
                }`}
              >
                <div className="w-[18px] h-[18px] relative group">
                {
                  slope.name === "Architect" ? (
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" class="" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12.038c1.655-.885 5.9-3.292 8.568-4.354 2.668-1.063.101 2.821 1.32 3.104 1.218.283 5.112-1.814 5.112-1.814" stroke-width="1.25"></path></svg>
                  ) :
                  slope.name === "Artist" ? (
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" class="" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12.563c1.655-.886 5.9-3.293 8.568-4.355 2.668-1.062.101 2.822 1.32 3.105 1.218.283 5.112-1.814 5.112-1.814m-13.469 2.23c2.963-1.586 6.13-5.62 7.468-4.998 1.338.623-1.153 4.11-.132 5.595 1.02 1.487 6.133-1.43 6.133-1.43" stroke-width="1.25"></path></svg>
                  ) :
                  slope.name === "Cartoonist" ? (
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" class="" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 11.936c1.737-.879 8.627-5.346 10.42-5.268 1.795.078-.418 5.138.345 5.736.763.598 3.53-1.789 4.235-2.147M2.929 9.788c1.164-.519 5.47-3.28 6.987-3.114 1.519.165 1 3.827 2.121 4.109 1.122.281 3.839-2.016 4.606-2.42" stroke-width="1.25"></path></svg>
                  ) : (<></>)
                }
                  <p className="text-[10px] text-white bg-black-5 dark:bg-black-50 dark:border dark:border-grey-25 dark:rounded-[3px] p-1 absolute -bottom-9 left-3 group-hover:block hidden transition-500 bg-opacity-80">
                    {slope.name}
                  </p>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>

       {/* edges  */}
      <div className="">
        <p className="text-[10px] font-extralight text-black dark:text-grey-25  text-opacity-70 helvetica-light ">
          Edges
        </p>
        <div className="w-full h-[22px] my-2 flex items-center justify-between">
          <div className=" w-[70%] flex items-center justify-start gap-x-3 ">
            {EdgesList.map((edgeType, index) => (
              <div
                key={index}
                onClick={() => dispatch(setEdge(edgeType?.value))}
                className={`h-[32px] w-[32px] rounded-[10px] flex justify-center items-center cursor-pointer transition-500  ${
                  edge === edgeType?.value
                    ? "bg-blue-25 dark:bg-blue-175 bg-opacity-20 text-blue-100 "
                    : "bg-grey-5 dark:bg-grey-25 dark:bg-opacity-30 border-none"
                }`}
              >
                <div className="w-[18px] h-[18px] relative group transition-500">
                {
                  edgeType?.name === "Round" ? (
                    // <TbBorderRadius/>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" class="" fill="none" stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g stroke-width="1.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 12v-4a4 4 0 0 1 4 -4h4"></path><line x1="16" y1="4" x2="16" y2="4.01"></line><line x1="20" y1="4" x2="20" y2="4.01"></line><line x1="20" y1="8" x2="20" y2="8.01"></line><line x1="20" y1="12" x2="20" y2="12.01"></line><line x1="4" y1="16" x2="4" y2="16.01"></line><line x1="20" y1="16" x2="20" y2="16.01"></line><line x1="4" y1="20" x2="4" y2="20.01"></line><line x1="8" y1="20" x2="8" y2="20.01"></line><line x1="12" y1="20" x2="12" y2="20.01"></line><line x1="16" y1="20" x2="16" y2="20.01"></line><line x1="20" y1="20" x2="20" y2="20.01"></line></g></svg>
                  ) : (
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" class="" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><svg stroke-width="1.5"><path d="M3.33334 9.99998V6.66665C3.33334 6.04326 3.33403 4.9332 3.33539 3.33646C4.95233 3.33436 6.06276 3.33331 6.66668 3.33331H10"></path><path d="M13.3333 3.33331V3.34331"></path><path d="M16.6667 3.33331V3.34331"></path><path d="M16.6667 6.66669V6.67669"></path><path d="M16.6667 10V10.01"></path><path d="M3.33334 13.3333V13.3433"></path><path d="M16.6667 13.3333V13.3433"></path><path d="M3.33334 16.6667V16.6767"></path><path d="M6.66666 16.6667V16.6767"></path><path d="M10 16.6667V16.6767"></path><path d="M13.3333 16.6667V16.6767"></path><path d="M16.6667 16.6667V16.6767"></path></svg></svg>
                  )
                }
                   <p className="text-[10px] text-white bg-black-5 dark:bg-black-50 dark:border dark:border-grey-25 dark:rounded-[3px] p-1 absolute -bottom-9 left-3 group-hover:block hidden transition-500 bg-opacity-80">
                    {edgeType?.name}
                  </p>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div> 

       {/* opacity bar */}
       <div className="">
        <p className="text-[10px] font-extralight text-black dark:text-grey-25  text-opacity-70 helvetica-light ">
          Opacity
        </p>
        <div className="w-full h-[22px] my-2 flex items-center justify-between ">
        <form className="w-[95%] mx-auto" >
           <input type="range" id="opacity" name="opacity" min="0" max="100" className="w-full" defaultValue={100}/>
        </form>
        </div>
      </div>

      {/* action buttons */}
     <div className="">
        <p className="text-[10px] font-extralight text-black dark:text-grey-25  text-opacity-70 helvetica-light ">
          Actions
        </p>
        <div className="w-full h-[22px] my-2 flex items-center justify-start gap-x-3 text-[15px]">
            <div className="w-[32px] h-[32px] rounded-[10px] bg-grey-5 dark:bg-grey-25 dark:bg-opacity-30 dark:text-grey-25 flex justify-center items-center text-black text-opacity-90">
                  <MdContentCopy />
            </div>
            <div className="w-[32px] h-[32px] rounded-[10px] bg-grey-5 dark:bg-grey-25 dark:bg-opacity-30 dark:text-grey-25 flex justify-center items-center text-black text-opacity-90">
                  <RiDeleteBin3Line />
            </div>
            <div className="w-[32px] h-[32px] rounded-[10px] bg-grey-5 dark:bg-grey-25 dark:bg-opacity-30 dark:text-grey-25 flex justify-center items-center text-black text-opacity-90">
                  <HiMiniLink />
            </div>
        </div>
      </div>  
    </div>
  );
};

export default ToolDesignBar;
