import autobind from 'bind-decorator';
import * as Immutable from 'immutable';
import * as React from 'react';
import RpcResultModel, { LogEntry } from '../RpcResultModel';
import DisplayObject from './DisplayObject';
import './RpcResultList.scss';

interface Props {
  results: RpcResultModel;
}

interface State {
  results: Immutable.List<LogEntry>;
}

/** Displays the list of results from RPC calls. */
export default class RpcResultList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      results: props.results.log,
    };
  }

  public componentWillMount() {
    this.props.results.onLogChanged = this.onLogChanged;
  }

  public componentWillUnmount() {
    this.props.results.onLogChanged = null;
  }

  public render() {
    return (
      <section className="results panel">
        <section className="result-list">
          <table className="result-table data">
            <thead>
              <th className="rpc">RPC</th>
              <th className="result">Result</th>
              <th className="result">Error</th>
            </thead>
            <tbody>
              {this.state.results.map((entry: LogEntry, index) => (
                  <tr key={index}>
                    <td className="rpc">{entry.rpc}</td>
                    <td className="result">
                      {
                        typeof entry.result === 'object'
                          ? <DisplayObject data={entry.result} fieldName="" fieldPath="" />
                          : entry.result
                      }
                    </td>
                    <td className="result">{entry.error}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    );
  }

  @autobind
  private onLogChanged() {
    this.setState({ results: this.props.results.log });
  }
}
