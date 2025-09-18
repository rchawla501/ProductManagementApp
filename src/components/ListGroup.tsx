import { useState } from "preact/hooks";

interface Props {
  items: string[];
  heading: string;
}

function ListGroup({ items, heading }: Props) {
  const [activeIndex, setIndex] = useState(-1);

  function handleClick(index) {
    console.log("clicked");
    setIndex(index);
  }
  return (
    <>
      <h1>{heading}</h1>
      <ul class="list-group">
        {items.map((item, index) => (
          <li
            key={item}
            class="list-group-item"
            onClick={() => handleClick(index)}
            className={
              activeIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
