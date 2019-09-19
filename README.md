## terminal-dispatch-state

Re-render terminal contents by updating the state #react #redux

![](./examples/demo.svg)

## API

```javascript
import { Store } from 'terminal-dispatch-state';
import ora from 'ora'; // if you want to show a spinner

const store = new Store();
const state = [
  'line1',
  'line2',
  'line3',
];

store.dispatch(state); // renders three lines in the terminal

state.push('line4');
store.dispatch(state); // does not render anything because state is the same object

const newState = [...state];
store.dispatch(newState); // adds one line

const spinner = ora('Loading unicorns');
const newStateWithUnicorns = [
  ...newState,
  { spinner, isRunning: true }
]
store.dispatch([...newState, progress]); // adds ora spinner with text

store.stop();
```
