import * as Immutable from 'immutable';

export interface LogEntry {
  rpc: string;
  result: any;
}

/** Model class which stores the event log and the set of subscribed events. */
export default class RpcResultModel {
  public client: deepstreamIO.Client;
  public log: Immutable.List<LogEntry>;
  public onLogChanged: () => void;

  constructor(client: deepstreamIO.Client) {
    this.client = client;
    this.log = Immutable.List<LogEntry>();
  }

  public call(rpc: string, args?: any) {
    this.client.rpc.make(rpc, args, (result: any) => {
      this.log = this.log.push({ rpc, result });
      if (this.onLogChanged) {
        this.onLogChanged();
      }
    });
  }
}
