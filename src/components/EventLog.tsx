import * as autobind from 'autobind-decorator';
import * as Immutable from 'immutable';
import * as React from 'react';
import EventModel, { LogEntry } from '../EventModel';
import './EventList.scss';
import EventLogEntry from './EventLogEntry';

interface Props {
  events: EventModel;
}

interface State {
  eventLog: Immutable.List<LogEntry>;
}

export default class EventLog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      eventLog: props.events.eventLog,
    };
  }

  public componentWillMount() {
    this.props.events.onEventLogChanged = this.onEventLogChanged;
  }

  public componentWillUnmount() {
    this.props.events.onEventLogChanged = null;
  }

  public render() {
    return (
      <section className="event-log">
        <table className="event-log-table data">
          <tbody>
            {this.props.events.eventLog.map((entry: LogEntry) => (<EventLogEntry entry={entry} />))}
          </tbody>
        </table>
      </section>
    );
  }

  @autobind
  private onEventLogChanged() {
    this.setState({ eventLog: this.props.events.eventLog });
  }
}
