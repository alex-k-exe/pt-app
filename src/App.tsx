import ListGroupProps from "./components/ListGroup";

function App() {
    const items = [
        "Among Us",
        "Fortnight",
        "Bungaboo"
    ]
    const heading = "Bad Games";

    return <>
        <ListGroupProps items={items} heading={heading} />
    </>
}

export default App;