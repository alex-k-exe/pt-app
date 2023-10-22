import ListGroup from "./components/ListGroup";

function App() {
    const items = [
        "Among Us",
        "Fortnight",
        "Bungaboo"
    ]
    const heading = "Bad Games";

    return <div>
        <ListGroup
            items={items}
            heading={heading}
            onSelectItem={item => console.log(item)}
        />
    </div>
}

export default App;