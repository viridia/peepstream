import * as autobind from 'autobind-decorator';
import * as React from 'react';
import { Button } from 'react-bootstrap';

interface Props {
  record: deepstreamIO.Record;
}

interface State {
  data: any;
}

export default class RecordRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: props.record.get(),
    };
  }

  public componentWillMount() {
    this.props.record.subscribe(this.onRecordChanged);
  }

  public componentWillUnmount() {
    this.props.record.unsubscribe(this.onRecordChanged);
  }

  public render() {
    const { record } = this.props;
    return (
      <tr>
        <td className="name">{record.name}</td>
        <td className="record">
          <input
              type="checkbox"
              className="disclosure-triangle"
              checked={false}
              onChange={null}
          />
          {JSON.stringify(record.get(), null, 2)}
        </td>
        <td>
          <Button bsStyle="primary" bsSize="xsmall" onClick={this.onClickDiscard}>
            Edit&hellip;
          </Button>
        </td>
        <td>
          <Button bsStyle="primary" bsSize="xsmall" onClick={this.onClickDiscard}>
            Discard
          </Button>
        </td>
        <td>
          <Button bsStyle="primary" bsSize="xsmall" onClick={this.onClickDiscard}>
            Delete
          </Button>
        </td>
      </tr>
    );
  }

  @autobind
  private onRecordChanged(data: any) {
    this.setState({ data });
  }

  @autobind
  private onClickDiscard(data: any) {
    // this.setState({ data });
  }
}
