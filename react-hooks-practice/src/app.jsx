import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';

function Shopping () {
    const [count, setCount] = useState(0)
    return (
        <>
            <p>{count} 🍎</p>
            <button onClick={() => setCount(count + 1)}>Add</button>
            <button onClick={() => setCount(count - 1)}>Delete</button>
        </>
    )
}

class App extends Component {
    
    static state = {
        count: 0
    }

    render() {
        return (
            <Shopping/>
        )
    }
}

ReactDOM.render(<App/> , document.getElementById('root'));
