// ============================================
// COMBINED REACT COMPONENTS IN TYPESCRIPT
// ============================================


import React, { Component } from 'react';

// ============================================
// COMPONENT 01: FUNCTIONAL COMPONENT (Greeting)
// ============================================

interface GreetingProps {
  name: string;
}


const Greeting = ({ name }: GreetingProps): JSX.Element => {
  return <div>Hello, {name}!</div>;
};

// ============================================
// COMPONENT 02: CLASS COMPONENT (Counter)
// ============================================

interface CounterProps {

}
interface CounterState {
  count: number; 
}


class Counter extends Component<CounterProps, CounterState> {
  

  state: CounterState = {
    count: 0
  };

  increment = (): void => {

    this.setState({ count: this.state.count + 1 });
    
  };


  render(): JSX.Element {
    return (
      <div>

        <p>Count: {this.state.count}</p>

        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}



export { Greeting, Counter };
