import autobind from 'bind-decorator';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import RecordsModel from '../RecordsModel';
import DisplayObject from './DisplayObject';

interface Props {
  record: deepstreamIO.Record;
  records: RecordsModel;
  onEdit: (record: deepstreamIO.Record, field: string) => void;
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
          <div className="data">
            <DisplayObject data={record.get()} fieldName="" fieldPath="" />
            <Button bsStyle="primary" bsSize="xsmall" onClick={this.onClickEdit}>
              Edit&hellip;
            </Button>
            <Button bsStyle="danger" bsSize="xsmall" onClick={this.onClickDiscard}>
              Discard
            </Button>
            <Button bsStyle="danger" bsSize="xsmall" onClick={this.onClickDelete}>
              Delete
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  @autobind
  private onRecordChanged(data: any) {
    this.setState({ data });
  }

  @autobind
  private onClickEdit() {
    this.props.onEdit(this.props.record, '');
  }

  @autobind
  private onClickDiscard() {
    this.props.records.discard(this.props.record.name);
  }

  @autobind
  private onClickDelete() {
    this.props.records.delete(this.props.record.name);
  }
}
