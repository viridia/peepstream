import * as autobind from 'autobind-decorator';
import * as React from 'react';
import { Checkbox } from 'react-bootstrap';
import EventModel from '../EventModel';
import './EventList.scss';
import EventLog from './EventLog';

interface Props {
  events: EventModel;
}

export default class EventList extends React.Component<Props, undefined> {
  public componentWillMount() {
    this.props.events.onEventsChanged = this.onEventsChanged;
  }

  public componentWillUnmount() {
    this.props.events.onEventsChanged = null;
  }

  public render() {
    // TODO: Move each section into separate component, update props independently.
    const eventNames = this.props.events.events.keySeq().toArray();
    eventNames.sort();
    return (
      <section className="events panel">
        <section className="event-list">
          <table className="event-table">
            <thead>
              <th className="select">Listen</th>
              <th className="event">Event name</th>
            </thead>
            <tbody>
              {eventNames.map(ev => (
                  <tr key={ev}>
                    <td className="select">
                      <Checkbox
                          checked={this.props.events.isSubscribed(ev)}
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
        <EventLog events={this.props.events} />
      </section>
    );
  }

  @autobind
  private onEventsChanged() {
    // TODO: change this to update subcomponent.
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
