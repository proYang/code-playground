import React from "react";
import { render } from "react-dom";
import diffObserver from "./utils";

class Diff extends React.Component {
  state = { input: "", lastInput: "" };

  patch = () => {
    this.setState(s => ({
      lastInput: s.input,
      input: this.$input.value
    }));
  };

  componentDidMount() {
    this.diffObs = diffObserver(".react-seq");
    this.diffObs();
  }

  render() {
    const lastSequence = this.state.lastInput.trim().split("");
    const sequence = this.state.input.trim().split("");
    return (
      <div>
        <input placeholder="输入不重复的数字" ref={node => (this.$input = node)} />
        <button onClick={this.patch}>保存</button>
        <p>上次 [{lastSequence.join()}]</p>
        <p>当前 [{sequence.join()}]</p>
        <hr />
        <div className="seq react-seq">
          {sequence.map(item =>
            <div  key={item} className="box">
              {item}
            </div>
          )}
        </div>
      </div>
    );
  }
}

render(<Diff />, document.getElementById("app"));
