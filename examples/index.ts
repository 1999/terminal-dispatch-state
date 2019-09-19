import ora from 'ora';
import { Store, StateChunk } from '../src';

const sleep = (timeoutMs: number) => new Promise((resolve) => setTimeout(resolve, timeoutMs));

const main = async () => {
  const store = new Store();
  let state: StateChunk[] = [];

  state = [{ spinner: ora('Validating package.json...'), isRunning: true }];
  store.dispatch(state);
  await sleep(1000);

  state = [
    { spinner: ora('Validating package.json...'), isRunning: true },
    { spinner: ora('Resolving packages...'), isRunning: true },
  ];
  store.dispatch(state);
  await sleep(1000);

  state = [
    '✔ Validating package.json',
    { spinner: ora('Resolving packages...'), isRunning: true },
    { spinner: ora('Fetching packages...'), isRunning: true },
  ];
  store.dispatch(state);
  await sleep(1000);

  state = [
    '✔ Validating package.json',
    '✔ Resolving packages',
    '✔ Fetching packages',
    { spinner: ora('Linking dependencies...'), isRunning: true },
  ];
  store.dispatch(state);
  await sleep(1000);

  state = [
    '✔ Validating package.json',
    '✔ Resolving packages',
    '✔ Fetching packages',
    { spinner: ora('Linking dependencies...'), isRunning: true },
    { spinner: ora('Building fresh packages...'), isRunning: true },
  ];
  store.dispatch(state);
  await sleep(1000);

  state = ['✔ All done'];
  store.dispatch(state);
  store.kill();
};

main();
