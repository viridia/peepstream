import * as autobind from 'autobind-decorator';
import * as Immutable from 'immutable';
import * as React from 'react';
import RecordsModel from '../RecordsModel';
import RecordEditDialog from './RecordEditDialog';
import './RecordList.scss';
import RecordRow from './RecordRow';

interface Props {
  records: RecordsModel;
}

interface State {
  records: Immutable.Map<string, deepstreamIO.Record>;
  showEdit: boolean;
  recordToEdit: deepstreamIO.Record;
  fieldToEdit: string;
}

/** Displays the list of deepstream records we are currently watching. */
export default class RecordList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      records: props.records.records,
      showEdit: false,
      recordToEdit: null,
      fieldToEdit: null,
    };
  }

  public componentWillMount() {
    this.props.records.onRecordsChanged = this.onRecordsChanged;
  }

  public componentWillUnmount() {
    this.props.records.onRecordsChanged = null;
  }

  public render() {
    return (
      <section className="records panel">
        <section className="records-list">
          <table className="records-table data">
            <thead>
              <th className="name">Name</th>
              <th className="record">Record</th>
            </thead>
            <tbody>
              {this.state.records.sort().map((r: deepstreamIO.Record) => (
                <RecordRow
                  key={r.name}
                  record={r}
                  records={this.props.records}
                  onEdit={this.onShowEdit}
                />
              ))}
            </tbody>
          </table>
        </section>
        <RecordEditDialog
            show={this.state.showEdit}
            onHide={this.onHideEdit}
            onSave={this.onSave}
            recordName={this.state.recordToEdit && this.state.recordToEdit.name}
            fieldName={this.state.fieldToEdit}
            content={this.state.recordToEdit && this.state.recordToEdit.get()}
        />
      </section>
    );
  }

  @autobind
  private onRecordsChanged() {
    this.setState({ records: this.props.records.records });
  }

  @autobind
  private onShowEdit(record: deepstreamIO.Record, fieldName: string) {
    this.setState({ showEdit: true, recordToEdit: record, fieldToEdit: fieldName });
  }

  @autobind
  private onHideEdit() {
    this.setState({ showEdit: false });
  }

  @autobind
  private onSave(recordName: string, fieldName: string, data: any) {
    this.setState({ showEdit: false });
    if (this.state.recordToEdit) {
      if (fieldName) {
        this.state.recordToEdit.set(fieldName, data);
      } else {
        this.state.recordToEdit.set(data);
      }
    }
  }
}
