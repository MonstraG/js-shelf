type EventSubscriber = (data?: any) => void;

class EventEmitter {
  //subscribing to specific events
  private readonly eventSubscribers: { [event: string]: EventSubscriber[] } = {};
  //subscribing to any event from this emitter
  private subscribers: EventSubscriber[] = [];

  subscribe(fn: EventSubscriber, eventName?: string): () => void {
    if (eventName) {
      return this.subscribeToEvent(fn, eventName);
    }
    return this.subscribeToAllEvents(fn);
  }

  private subscribeToEvent = (fn: EventSubscriber, eventName: string): (() => void) => {
    if (!this.eventSubscribers[eventName]) {
      this.eventSubscribers[eventName] = [];
    }

    this.eventSubscribers[eventName].push(fn);

    return () => {
      this.eventSubscribers[eventName] = this.eventSubscribers[eventName].filter(
        (eventFn) => fn !== eventFn
      );
    };
  };

  private subscribeToAllEvents = (fn: EventSubscriber): (() => void) => {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter((eventFn) => fn !== eventFn);
    };
  };

  emit(eventName: string, data: any) {
    const event = this.eventSubscribers[eventName];
    if (event) {
      event.forEach((fn) => fn.call(null, data));
    }
    this.subscribers.forEach((fn) => fn.call(null, data));
  }
}

export default EventEmitter;
