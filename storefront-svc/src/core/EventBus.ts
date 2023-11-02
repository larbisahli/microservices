import EventEmitter from 'events';
import { Service } from 'typedi';

@Service()
export default class EventsBus extends EventEmitter {
  async publish(event: string | symbol, args: any) {
    return this.emit(event, args);
  }

  async subscribe(event: string | symbol, handler: (...args: any[]) => void) {
    this.on(event, handler);
  }
}
