import * as autobind from 'autobind-decorator';
import * as classNames from 'classnames';
import * as deepstream from 'deepstream.io-client-js';
import * as React from 'react';
import { Alert, Button, Modal, Nav, NavItem } from 'react-bootstrap';
import EventModel from '../EventModel';
import RecordsModel from '../RecordsModel';
import RpcResultModel from '../RpcResultModel';
import CallDialog from './CallDialog';
import EventList from './EventList';
import GetStringDialog from './GetStringDialog';
import LoginDialog from './LoginDialog';
import './Page.scss';
import PostDialog from './PostDialog';
import PresenceList from './PresenceList';
import RecordList from './RecordList';
import RpcResultList from './RpcResultList';
import './styles/bootstrap.scss';
import './styles/controls.scss';
import './styles/dialog.scss';
import './styles/spinner.scss';

enum NavSelection {
  EVENTS,
  RPCS,
  RECORDS,
  LISTS,
  USERS,
}

interface State {
  showLogin: boolean;
  showConnecting: boolean;
  showPost: boolean;
  showSubscribe: boolean;
  showGetList: boolean;
  showGetRecord: boolean;
  showCall: boolean;
  clientState: string;
  clientUrl: string;
  alert?: string;
  navSelection: NavSelection;
  servers?: { [key: string]: any; };
}

/** Root element of the application */
export default class Page extends React.Component<undefined, State> {
  private client?: deepstreamIO.Client;
  private eventModel: EventModel;
  private rpcResultModel: RpcResultModel;
  private recordsModel: RecordsModel;

  constructor() {
    super();
    this.client = null;
    this.eventModel = null;
    this.recordsModel = null;
    this.rpcResultModel = null;
    this.state = {
      showLogin: false,
      showConnecting: false,
      showSubscribe: false,
      showPost: false,
      showCall: false,
      showGetRecord: false,
      showGetList: false,
      clientState: 'CLOSED',
      clientUrl: '',
      alert: null,
      navSelection: NavSelection.EVENTS,
      servers: JSON.parse(window.sessionStorage.getItem('deepstream-servers')) || {},
    };
  }

  public renderMainPanel(): JSX.Element {
    if (!this.client) { return null; }
    switch (this.state.navSelection) {
      case NavSelection.USERS: return <PresenceList client={this.client} />;
      case NavSelection.EVENTS: return <EventList events={this.eventModel} />;
      case NavSelection.RPCS: return <RpcResultList results={this.rpcResultModel} />;
      case NavSelection.RECORDS: return <RecordList records={this.recordsModel} />;
      case NavSelection.LISTS: return <span>Not implemented yet!</span>;
    }
    return null;
  }

  public render() {
    const disabled = !this.client;
    return (
      <section className="page">
        <header>
          {!this.client && (<Button bsStyle="primary" onClick={this.onClickLogIn}>
            Log In&hellip;
          </Button>)}
          {this.client &&
            <Button bsStyle="primary" onClick={this.onClickDisconnect}>Disconnect</Button>}
          <div className="client-url">{this.state.clientUrl}</div>
          <div className={classNames('client-state', this.state.clientState.toLowerCase())}>
            {this.state.clientState}
          </div>
        </header>
        {this.state.alert && <Alert bsStyle="danger">{this.state.alert}</Alert>}
        <Nav bsStyle="tabs" activeKey={this.state.navSelection} onSelect={this.onNav}>
          <NavItem eventKey={NavSelection.EVENTS} disabled={disabled}>Events</NavItem>
          <NavItem eventKey={NavSelection.RPCS} disabled={disabled}>RPCs</NavItem>
          <NavItem eventKey={NavSelection.RECORDS} disabled={disabled}>Records</NavItem>
          <NavItem eventKey={NavSelection.LISTS} disabled={disabled}>Lists</NavItem>
          <NavItem eventKey={NavSelection.USERS}  disabled={disabled}>Users</NavItem>
          <span className="spacer" />
          {this.state.navSelection === NavSelection.EVENTS &&
            <Button bsStyle="info" onClick={this.onClickPost} disabled={!this.client}>
              Post&hellip;
            </Button>}
          {this.state.navSelection === NavSelection.EVENTS &&
            <Button bsStyle="info" onClick={this.onClickSubscribe} disabled={!this.client}>
              Subscribe&hellip;
            </Button>}
          {this.state.navSelection === NavSelection.RPCS &&
            <Button bsStyle="info" onClick={this.onClickCall} disabled={!this.client}>
              Call&hellip;
            </Button>}
          {this.state.navSelection === NavSelection.RECORDS &&
            <Button bsStyle="info" onClick={this.onClickGetRecord} disabled={!this.client}>
              Get Record&hellip;
            </Button>}
          {this.state.navSelection === NavSelection.LISTS &&
            <Button bsStyle="info" onClick={this.onClickGetList} disabled={!this.client}>
              Get List&hellip;
            </Button>}
        </Nav>
        {this.renderMainPanel()}
        <LoginDialog
            show={this.state.showLogin}
            onHide={this.onHideLogIn}
            onLogin={this.onLogin}
            servers={this.state.servers}
        />
        <GetStringDialog
            show={this.state.showSubscribe}
            title="Subscribe to event"
            label="Event Name"
            placeholder="Name of event"
            confirm="Subscribe"
            onHide={this.onHideSubscribe}
            onDone={this.onSubscribe}
        />
        <GetStringDialog
            show={this.state.showGetRecord}
            title="Get Record"
            label="Record Name"
            placeholder="ID of record"
            confirm="Get"
            onHide={this.onHideGetRecord}
            onDone={this.onGetRecord}
        />
        <GetStringDialog
            show={this.state.showGetList}
            title="Get List"
            label="List Name"
            placeholder="ID of List"
            confirm="Get"
            onHide={this.onHideGetList}
            onDone={this.onGetList}
        />
        <PostDialog
            show={this.state.showPost}
            onHide={this.onHidePost}
            onPost={this.onPost}
        />
        <CallDialog
            show={this.state.showCall}
            onHide={this.onHideCall}
            onCall={this.onCall}
        />
        <Modal show={this.state.showConnecting} onHide={null} dialogClassName="connecting-dialog">
          <Modal.Body>
            <span className="spinner">Connecting&hellip;</span>
          </Modal.Body>
        </Modal>
      </section>
    );
  }

  @autobind
  private onClickLogIn() {
    this.setState({ showLogin: true });
  }

  @autobind
  private onHideLogIn() {
    this.setState({ showLogin: false });
  }

  @autobind
  private onLogin(url: string, auth: any) {
    this.setState({ showLogin: false, showConnecting: true, alert: null, clientUrl: url });
    if (this.client) {
      this.client.close();
    }
    console.info(`Connecting to ${url}:`);
    this.client = deepstream(url);
    this.client.on('error', (error, event, topic) => {
      if (event === 'connectionError') {
        this.setState({ alert: `Login to ${url} failed.`, showConnecting: false });
        console.error('connection error:', error);
      } else {
        console.error(error, event, topic);
      }
    });
    this.client.on('connectionStateChanged', (state, e) => {
      this.setState({ clientState: state });
      console.log('state:', state);
    });
    this.eventModel = new EventModel(this.client);
    this.recordsModel = new RecordsModel(this.client);
    this.rpcResultModel = new RpcResultModel(this.client);
    this.client.login(auth, (success: any, data: any) => {
      if (success) {
        const servers = { ...this.state.servers, [url]: auth };
        this.setState({ showConnecting: false, servers });
        window.sessionStorage.setItem('deepstream-servers', JSON.stringify(servers));
      } else {
        console.log('login failed:', data);
      }
    });
  }

  @autobind
  private onClickDisconnect() {
    if (this.client) {
      this.client.close();
      this.client = null;
    }
  }

  @autobind
  private onNav(key: any) {
    this.setState({ navSelection: key });
  }

  @autobind
  private onClickSubscribe() {
    this.setState({ showSubscribe: true });
  }

  @autobind
  private onHideSubscribe() {
    this.setState({ showSubscribe: false });
  }

  @autobind
  private onSubscribe(event: string) {
    this.setState({ showSubscribe: false });
    this.eventModel.subscribe(event, true);
  }

  @autobind
  private onClickPost() {
    this.setState({ showPost: true });
  }

  @autobind
  private onHidePost() {
    this.setState({ showPost: false });
  }

  @autobind
  private onPost(event: string, content: any) {
    this.setState({ showPost: false });
    this.client.event.emit(event, content);
  }

  @autobind
  private onClickCall() {
    this.setState({ showCall: true });
  }

  @autobind
  private onHideCall() {
    this.setState({ showCall: false });
  }

  @autobind
  private onCall(rpc: string, data: any) {
    this.setState({ showCall: false });
    this.rpcResultModel.call(rpc, data);
  }

  @autobind
  private onClickGetRecord() {
    this.setState({ showGetRecord: true });
  }

  @autobind
  private onHideGetRecord() {
    this.setState({ showGetRecord: false });
  }

  @autobind
  private onGetRecord(record: string) {
    this.setState({ showGetRecord: false });
    this.recordsModel.get(record);
  }

  @autobind
  private onClickGetList() {
    this.setState({ showGetList: true });
  }

  @autobind
  private onHideGetList() {
    this.setState({ showGetList: false });
  }

  @autobind
  private onGetList(record: string) {
    this.setState({ showGetList: false });
    // this.rpcResultModel.call(rpc, data);
  }
}
