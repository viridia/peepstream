import * as autobind from 'autobind-decorator';
import * as Immutable from 'immutable';

export default class EventModel {
  public client: deepstreamIO.Client;
  public events: Immutable.Map<string, boolean>;
  public eventLog: Immutable.List<any>;
  public onEventsChanged: () => void;
  public onEventLogChanged: () => void;

  constructor(client: deepstreamIO.Client) {
    this.client = client;
    this.events = Immutable.Map<string, boolean>();
    this.eventLog = Immutable.List<any>();
    this.client.event.listen('.*', this.onEventChange);
  }

  public subscribe(eventId: string) {
    if (this.events.has(eventId)) {
      this.client.event.subscribe(eventId, this.onEvent);
      this.events = this.events.set(eventId, true);
      if (this.onEventsChanged) {
        this.onEventsChanged();
      }
    }
  }

  public unsubscribe(eventId: string) {
    if (this.events.has(eventId)) {
      this.client.event.unsubscribe(eventId, this.onEvent);
      this.events = this.events.set(eventId, false);
      if (this.onEventsChanged) {
        this.onEventsChanged();
      }
    }
  }

  @autobind
  private onEventChange(
      match: string, isSubscribed: boolean, response: deepstreamIO.ListenResponse) {
    if (isSubscribed) {
      this.events = this.events.set(match, false);
      response.accept();
    } else {
      // Unsubscribe if we are subscribed.
      if (this.events.get(match)) {
        this.client.event.unsubscribe(match, this.onEvent);
      }
      this.events = this.events.delete(match);
    }
    if (this.onEventsChanged) {
      this.onEventsChanged();
    }
  }

  @autobind
  private onEvent(ev: any) {
    this.eventLog = this.eventLog.push(ev);
    console.log(ev);
    if (this.onEventLogChanged) {
      this.onEventLogChanged();
    }
  }
}
