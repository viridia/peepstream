import * as Immutable from 'immutable';

export interface LogEntry {
  rpc: string;
  error: any;
  result: any;
}

/** Model class which stores the result log for all RPCs. */
export default class RpcResultModel {
  public client: deepstreamIO.Client;
  public log: Immutable.List<LogEntry>;
  public onLogChanged: () => void;

  constructor(client: deepstreamIO.Client) {
    this.client = client;
    this.log = Immutable.List<LogEntry>();
  }

  public call(rpc: string, args?: any) {
    this.client.rpc.make(rpc, args, (error: any, result: any) => {
      this.log = this.log.push({ rpc, error, result });
      if (this.onLogChanged) {
        this.onLogChanged();
      }
    });
  }
}
