import { appendFileSync, writeFileSync } from 'fs';
import { hide as hideCursor } from 'cli-cursor';
import { Ora } from 'ora';
import { clearLine, cursorTo, moveCursor } from 'readline';

export type OraState = {
  spinner: Ora;
  isRunning: boolean;
};

export type StateChunk = string | OraState;

export type StoreOptions = {
  initialState?: StateChunk[];
  stream?: NodeJS.WriteStream;
  interval?: number;
};

const isOra = (chunk: StateChunk): chunk is OraState => {
  return typeof chunk !== 'string';
};

export class Store {
  private state: StateChunk[];
  private stream: NodeJS.WriteStream;
  private interval: number;
  private id: NodeJS.Timeout | null = null;
  private startedAt = Date.now();
  private logFilePath = `${__dirname}/debug.log`;
  private isDebug = process.env.DEBUG === '1';

  constructor(options: StoreOptions = {}) {
    this.state = options.initialState || [];
    this.stream = options.stream || process.stderr;
    this.interval = options.interval || 100;
    this.id = setInterval(this.renderScheduled, this.interval);

    if (this.isDebug) {
      writeFileSync(this.logFilePath, '');
      this.debug('Start');
    }

    hideCursor();
  }

  update(newState: StateChunk[]): void {
    if (newState === this.state) {
      return;
    }

    const cleanLinesBeforeCurrent = this.state.length;
    this.state = newState;

    this.resetIntervalAndRender(cleanLinesBeforeCurrent);
  }

  stop(): void {
    if (this.id) {
      clearInterval(this.id);
    }

    this.stream.write('\n');
  }

  private resetIntervalAndRender(cleanLinesBeforeCurrent: number): void {
    if (this.id) {
      clearInterval(this.id);
      this.id = setInterval(this.renderScheduled, 100);
    }

    this.render(cleanLinesBeforeCurrent);
  }

  private renderScheduled = (): void => {
    moveCursor(this.stream, 0, 0 - this.state.length);
    cursorTo(this.stream, 0);

    for (const chunk of this.state) {
      if (isOra(chunk)) {
        const { spinner, isRunning } = chunk;

        if (isRunning) {
          clearLine(this.stream, 0);
          cursorTo(this.stream, 0);

          this.stream.write(spinner.frame());
        }
      }

      moveCursor(this.stream, 0, 1);
    }
  }

  private render(cleanLinesBeforeCurrent: number): void {
    // clear `cleanLinesBeforeCurrent` lines before the cursor
    for (let i = 0; i < cleanLinesBeforeCurrent; i++) {
      moveCursor(this.stream, 0, -1);
      clearLine(this.stream, 0);
    }

    cursorTo(this.stream, 0);

    for (let i = 0; i < this.state.length; i++) {
      const chunk = this.state[i];

      if (isOra(chunk)) {
        const { spinner } = chunk;
        this.stream.write(spinner.frame());
      } else {
        this.stream.write(chunk);
      }

      this.stream.write('\n');
    }
  }

  private debug(...args: string[]): void {
    const timeDiff = Date.now() - this.startedAt;
    const logMessage = `[+${timeDiff}ms] ${JSON.stringify(args)}\n`;

    if (this.isDebug) {
      appendFileSync(this.logFilePath, logMessage);
    }
  }
}
