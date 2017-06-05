import * as autobind from 'autobind-decorator';
import * as Immutable from 'immutable';
import * as React from 'react';
import RecordsModel from '../RecordsModel';
import './RecordList.scss';
import RecordRow from './RecordRow';

interface Props {
  records: RecordsModel;
}

interface State {
  records: Immutable.Map<string, deepstreamIO.Record>;
}

export default class RecordList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      records: props.records.records,
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
              <th />
              <th />
              <th />
            </thead>
            <tbody>
              {this.state.records.sort().map((r: deepstreamIO.Record) => (
                <RecordRow key={r.name} record={r} />
              ))}
            </tbody>
          </table>
        </section>
      </section>
    );
  }

  @autobind
  private onRecordsChanged() {
    this.setState({ records: this.props.records.records });
  }
}
