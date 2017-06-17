import * as Immutable from 'immutable';

/** Model class which stores the records we're observing. */
export default class RecordsModel {
  public client: deepstreamIO.Client;
  public records: Immutable.Map<string, deepstreamIO.Record>;
  public onRecordsChanged: () => void;

  constructor(client: deepstreamIO.Client) {
    this.client = client;
    this.records = Immutable.Map<string, deepstreamIO.Record>();
  }

  public get(name: string): deepstreamIO.Record {
    if (this.records.has(name)) {
      return this.records.get(name);
    }
    const record = this.client.record.getRecord(name);
    this.records = this.records.set(name, record);
    if (this.onRecordsChanged) {
      this.onRecordsChanged();
    }
    return record;
  }

  public discard(name: string) {
    const record = this.records.get(name);
    if (record) {
      record.discard();
      this.records = this.records.delete(name);
      if (this.onRecordsChanged) {
        this.onRecordsChanged();
      }
    }
  }

  public delete(name: string) {
    const record = this.records.get(name);
    if (record) {
      record.delete();
      this.records = this.records.delete(name);
      if (this.onRecordsChanged) {
        this.onRecordsChanged();
      }
    }
  }
}
