import { useRef, useState } from "react";
import Photos from "./Images.json";

const Images = () => {
  const elementRef = useRef(null);
  const [arrowDisable, setArrowDisable] = useState(true);
  const unsplashed = "https://source.unsplash.com/200x200/";

  const handleHorizontalScroll = (element, speed, distance, step) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
      if (element.scrollLeft === 0) {
        setArrowDisable(true);
      } else {
        setArrowDisable(false);
      }
    }, speed);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <button
        onClick={() => {
          handleHorizontalScroll(elementRef.current, 25, 100, -10);
        }}
        disabled={arrowDisable}
      >
        Left
      </button>
      <div
        class="img-container"
        ref={elementRef}
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        {Photos.map((placement, i) => (
          <img
            key={i}
            loading="lazy"
            alt={placement}
            src={unsplashed + `?${placement}`}
            style={{ marginRight: "10px" }}
          />
        ))}
      </div>
      <button
        onClick={() => {
          handleHorizontalScroll(elementRef.current, 25, 100, 10);
        }}
      >
        Right
      </button>
    </div>
  );
};
export default Images;
