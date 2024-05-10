import { useRef } from "react";

const HorizontalCardList = ({ cards }) => {
  const listRef = useRef(null);

  const handleScroll = (direction) => {
    const scrollAmount = direction === "left" ? -200 : 200;
    listRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <button onClick={() => handleScroll("left")}>Left</button>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          whiteSpace: "nowrap",
        }}
        ref={listRef}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              width: "200px", // adjust as needed
              marginRight: "10px", // adjust as needed
            }}
          >
            {/* Render your card component here */}
            <div
              style={{
                border: "1px solid black", // adjust as needed
                padding: "10px", // adjust as needed
              }}
            >
              {/* Card content */}
              {card}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => handleScroll("right")}>Right</button>
    </div>
  );
};

export default HorizontalCardList;