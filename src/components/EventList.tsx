import * as autobind from 'autobind-decorator';
import * as React from 'react';
import { Checkbox } from 'react-bootstrap';
import EventModel from '../EventModel';
import './EventList.scss';

interface Props {
  events: EventModel;
}

interface State {
  eventLog: any[];
}

export default class EventList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      eventLog: [],
    };
  }

  public componentWillMount() {
    this.props.events.onEventsChanged = this.onEventsChanged;
    // this.props.client.event.listen('.*', this.onEventChange);
  }

  public componentWillUnmount() {
    this.props.events.onEventsChanged = null;
  }

  public render() {
    const eventNames = this.props.events.events.keySeq().toArray();
    eventNames.sort();
    return (
      <section className="events panel">
        <section className="event-list">
          <table className="event-table">
            <thead>
              <th className="select">&nbsp;</th>
              <th className="event">Event name</th>
            </thead>
            <tbody>
              {eventNames.map(ev => (
                  <tr key={ev}>
                    <td className="select">
                      <Checkbox
                          checked={this.props.events.events.get(ev)}
                          data-eventid={ev}
                          onChange={this.onSelectEvent}
                      />
                    </td>
                    <td className="event">{ev}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </section>
        <header>Event Log</header>
        <section className="event-log">aa
        </section>
        <header>Event Details</header>
        <section className="event-details">
          aa
        </section>
      </section>
    );
  }

  @autobind
  private onEventsChanged() {
    this.forceUpdate();
  }

  @autobind
  private onSelectEvent(ev: any) {
    const eventid = ev.target.dataset.eventid;
    if (ev.target.checked) {
      this.props.events.subscribe(eventid);
    } else {
      this.props.events.unsubscribe(eventid);
    }
  }
}
