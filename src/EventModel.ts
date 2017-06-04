import * as autobind from 'autobind-decorator';
import * as Immutable from 'immutable';

interface Subscription {
  event: string;
  callback: (data: any) => void;
}

export interface LogEntry {
  event: string;
  data: any;
}

export default class EventModel {
  public client: deepstreamIO.Client;
  public events: Immutable.Map<string, Subscription>;
  public eventLog: Immutable.List<LogEntry>;
  public onEventsChanged: () => void;
  public onEventLogChanged: () => void;

  constructor(client: deepstreamIO.Client) {
    this.client = client;
    this.events = Immutable.Map<string, Subscription>();
    this.eventLog = Immutable.List<any>();
    this.client.event.listen('.*', this.onEventChange);
  }

  public subscribe(eventId: string, force?: boolean) {
    if (this.events.has(eventId) || force) {
      const subscription: Subscription = {
        event: eventId,
        callback: (data: any) => {
          this.onEvent(eventId, data);
        },
      };
      this.client.event.subscribe(eventId, subscription.callback);
      this.events = this.events.set(eventId, subscription);
      if (this.onEventsChanged) {
        this.onEventsChanged();
      }
    }
  }

  public unsubscribe(eventId: string) {
    const subscription = this.events.get(eventId);
    if (subscription) {
      this.client.event.unsubscribe(eventId, subscription.callback);
      this.events = this.events.set(eventId, null);
      if (this.onEventsChanged) {
        this.onEventsChanged();
      }
    }
  }

  public isSubscribed(eventId: string): boolean {
    return !!this.events.get(eventId);
  }

  @autobind
  private onEventChange(
      match: string, isSubscribed: boolean, response: deepstreamIO.ListenResponse) {
    if (isSubscribed) {
      this.events = this.events.set(match, null);
      response.accept();
    } else {
      this.unsubscribe(match);
      this.events = this.events.delete(match);
    }
    if (this.onEventsChanged) {
      this.onEventsChanged();
    }
  }

  private onEvent(event: string, data: any) {
    this.eventLog = this.eventLog.push({ event, data });
    if (this.onEventLogChanged) {
      this.onEventLogChanged();
    }
  }
}
