import * as autobind from 'autobind-decorator';
import * as classNames from 'classnames';
import * as React from 'react';
import { LogEntry } from '../EventModel';

interface Props {
  entry: LogEntry;
}

interface State {
  pretty: boolean;
}

export default class EventLogEntry extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pretty: false,
    };
  }

  public render() {
    const { entry } = this.props;
    const { pretty } = this.state;
    return (
      <tr>
        <td className="event">{entry.event}</td>
        <td className="toggle-pretty">
          <input
              type="checkbox"
              className="disclosure-triangle"
              checked={this.state.pretty}
              onChange={this.onTogglePretty}
          />
        </td>
        <td className={classNames('data', { pretty })}>
          {pretty ? JSON.stringify(entry.data, null, 2) : JSON.stringify(entry.data)}</td>
      </tr>
    );
  }

  @autobind
  private onTogglePretty(ev: any) {
    this.setState({ pretty: ev.target.checked });
  }
}
