## terminal-dispatch-state

Re-render terminal contents by updating the state.

![](./examples/demo.svg)

## API

```javascript
import { Store } from '@atlassian/terminal-dispatch-state';
import ora from 'ora'; // if you want to show a spinner

const store = new Store();
const state = [
  'line1',
  'line2',
  'line3',
];

store.update(state); // renders three lines in the terminal

state.push('line4');
store.update(state); // does not render anything because state is the same object

const newState = [...state];
store.update(newState); // adds one line

const spinner = ora('Loading unicorns');
const newStateWithUnicorns = [
  ...newState,
  { spinner, isRunning: true }
]
store.update([...newState, progress]); // adds ora spinner with text

store.stop();
```
