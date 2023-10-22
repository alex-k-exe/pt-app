import { useState } from "react";

function App() {
    const [btnPressed, setBtnPressed] = useState(false);

    return <div>
        <button onClick={() => setBtnPressed(!btnPressed)}>Click me!</button>
        {btnPressed && <p>Hi Chris (client) this is Alex</p>}
    </div>
}

export default App;