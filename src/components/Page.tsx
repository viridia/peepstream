import * as autobind from 'autobind-decorator';
import * as classNames from 'classnames';
import * as deepstream from 'deepstream.io-client-js';
import * as React from 'react';
import { Alert, Button, Modal, Nav, NavItem } from 'react-bootstrap';
import EventModel from '../EventModel';
import EventList from './EventList';
import LoginDialog from './LoginDialog';
import './Page.scss';
import PostDialog from './PostDialog';
import PresenceList from './PresenceList';
import './styles/bootstrap.scss';
import './styles/controls.scss';
import './styles/dialog.scss';
import './styles/spinner.scss';
import SubscribeDialog from './SubscribeDialog';

interface State {
  showLogin: boolean;
  showConnecting: boolean;
  showPost: boolean;
  showSubscribe: boolean;
  clientState: string;
  clientUrl: string;
  alert?: string;
  navSelection: string;
  servers?: { [key: string]: any; };
}

export default class Page extends React.Component<undefined, State> {
  private client?: deepstreamIO.Client;
  private eventModel: EventModel;

  constructor() {
    super();
    this.client = null;
    this.eventModel = null;
    this.state = {
      showLogin: false,
      showConnecting: false,
      showSubscribe: false,
      showPost: false,
      clientState: 'CLOSED',
      clientUrl: '',
      alert: null,
      navSelection: 'users',
      servers: JSON.parse(window.sessionStorage.getItem('deepstream-servers')) || {},
    };
  }

  public renderMainPanel(): JSX.Element {
    if (!this.client) { return null; }
    switch (this.state.navSelection) {
      case 'users': return <PresenceList client={this.client} />;
      case 'events': return <EventList events={this.eventModel} />;
    }
    return null;
  }

  public render() {
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
          <NavItem eventKey="users" title="users">Users</NavItem>
          <NavItem eventKey="rpcs" title="rpcs">RPCs</NavItem>
          <NavItem eventKey="events" title="events">Events</NavItem>
          <NavItem eventKey="objects" disabled={true}>Records</NavItem>
          <span className="spacer" />
          {this.state.navSelection === 'events' &&
            <Button bsStyle="info" onClick={this.onClickPost}>Post&hellip;</Button>}
          {this.state.navSelection === 'events' &&
            <Button bsStyle="info" onClick={this.onClickSubscribe}>Subscrbe&hellip;</Button>}
        </Nav>
        {this.renderMainPanel()}
        <LoginDialog
            show={this.state.showLogin}
            onHide={this.onHideLogIn}
            onLogin={this.onLogin}
            servers={this.state.servers}
        />
        <SubscribeDialog
            show={this.state.showSubscribe}
            onHide={this.onHideSubscribe}
            onSubscribe={this.onSubscribe}
        />
        <PostDialog
            show={this.state.showPost}
            onHide={this.onHidePost}
            onPost={this.onPost}
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
}
