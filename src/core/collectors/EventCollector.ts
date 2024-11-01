import { fromEvent, merge, Observable } from 'rxjs';
import { map, filter, debounceTime } from 'rxjs/operators';
import { UserInteraction, InteractionType } from '../types/behavior';

export class EventCollector {
  private static instance: EventCollector;
  private events$: Observable<UserInteraction>;

  private constructor() {
    this.events$ = this.initializeEventStreams();
  }

  public static getInstance(): EventCollector {
    if (!EventCollector.instance) {
      EventCollector.instance = new EventCollector();
    }
    return EventCollector.instance;
  }

  private initializeEventStreams(): Observable<UserInteraction> {
    const clicks$ = fromEvent<MouseEvent>(document, 'click').pipe(
      map(event => this.createInteraction(event, InteractionType.CLICK))
    );

    const scrolls$ = fromEvent(window, 'scroll').pipe(
      debounceTime(100),
      map(event => this.createInteraction(event, InteractionType.SCROLL))
    );

    const hovers$ = fromEvent<MouseEvent>(document, 'mouseover').pipe(
      filter(event => event.target instanceof Element),
      debounceTime(200),
      map(event => this.createInteraction(event, InteractionType.HOVER))
    );

    const inputs$ = fromEvent<Event>(document, 'input').pipe(
      filter(event => event.target instanceof HTMLInputElement),
      debounceTime(300),
      map(event => this.createInteraction(event, InteractionType.INPUT))
    );

    return merge(clicks$, scrolls$, hovers$, inputs$);
  }

  private createInteraction(event: Event, type: InteractionType): UserInteraction {
    const target = event.target as Element;
    return {
      timestamp: Date.now(),
      type,
      target: this.getTargetSelector(target),
      metadata: this.extractEventMetadata(event, type)
    };
  }

  private getTargetSelector(element: Element): string {
    return element.id ? `#${element.id}` : 
           element.className ? `.${element.className.split(' ')[0]}` : 
           element.tagName.toLowerCase();
  }

  private extractEventMetadata(event: Event, type: InteractionType): Record<string, unknown> {
    switch (type) {
      case InteractionType.SCROLL:
        return {
          scrollY: window.scrollY,
          scrollX: window.scrollX,
          maxScroll: Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          )
        };
      case InteractionType.CLICK:
        const mouseEvent = event as MouseEvent;
        return {
          x: mouseEvent.clientX,
          y: mouseEvent.clientY
        };
      default:
        return {};
    }
  }

  public getEventStream(): Observable<UserInteraction> {
    return this.events$;
  }
}