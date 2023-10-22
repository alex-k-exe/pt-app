import { useState } from "react";

interface ListGroupProps {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: ListGroupProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return <>
    <p>Test pls</p>
    <h1>{heading}</h1>
    {length === 0 && <p>No item found</p>}

    <ul className="list-group"> {items.map((item, index) => <li
      className={selectedIndex === index ? "list-group-item active" : "list-group-item"}
      key={item}
      onClick={() => {
        setSelectedIndex(index)
        onSelectItem(item)
      }}
    >{item}</li>)}
    </ul>
  </>
}

export default ListGroup;