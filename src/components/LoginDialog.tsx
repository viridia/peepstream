import * as autobind from 'autobind-decorator';
import * as React from 'react';
import { Button, ControlLabel, Form, FormControl, FormGroup, Modal } from 'react-bootstrap';

interface Props {
  show: boolean;
  onHide: () => void;
  onLogin: (url: string, auth: { username?: string, password?: string }) => void;
  servers?: { [key: string]: any; };
}

interface State {
  url: string;
  username: string;
  password: string;
}

export default class LoginDialog extends React.Component<Props, State> {
  constructor() {
    super();
    const savedState: State =
      JSON.parse(window.sessionStorage.getItem('deepstream-last-login')) || {};
    this.state = {
      url: savedState.url || '',
      username: savedState.username || '',
      password: '',
    };
  }

  public render() {
    const serverNames = Object.getOwnPropertyNames(this.props.servers);
    serverNames.sort();
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Title>Deepstream Login</Modal.Title>
        <Modal.Body>
          <FormGroup controlId="ds-url">
            <ControlLabel>Server URL</ControlLabel>
            <FormControl
                type="url"
                placeholder="Deepstream server URL"
                value={this.state.url}
                onChange={this.onChangeUrl}
                onKeyDown={this.onKeyDown}
                autoFocus={true}
                list="servers"
            />
            <datalist id="servers">
              {serverNames.map(s => <option key={s} value={s} />)}
            </datalist>
          </FormGroup>
          <FormGroup controlId="login-username">
            <ControlLabel>Username</ControlLabel>
            <FormControl
                type="text"
                placeholder="Username"
                value={this.state.username}
                onChange={this.onChangeUsername}
                onKeyDown={this.onKeyDown}
            />
          </FormGroup>
          <FormGroup controlId="login-password">
            <ControlLabel>Password</ControlLabel>
            <FormControl
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.onChangePassword}
                onKeyDown={this.onKeyDown}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={this.props.onHide}>
            Cancel
          </Button>
          <Button
            bsStyle="success"
            onClick={this.onClickLogIn}
            disabled={this.state.url.length === 0}
          >
            Log In
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  @autobind
  private onChangeUrl(e: any) {
    this.setState({ url: e.target.value });
  }

  @autobind
  private onChangeUsername(e: any) {
    this.setState({ username: e.target.value });
  }

  @autobind
  private onChangePassword(e: any) {
    this.setState({ password: e.target.value });
  }

  @autobind
  private onKeyDown(e: any) {
    if (e.keyCode === 13 && this.state.url.length > 0) {
      this.onClickLogIn();
    }
  }

  @autobind
  private onClickLogIn() {
    const { url, username, password } = this.state;
    const auth: any = {};
    if (username) {
      auth.username = username;
    }
    if (password) {
      auth.password = password;
    }
    window.sessionStorage.setItem('deepstream-last-login', JSON.stringify({ url, username }));
    this.props.onLogin(url, auth);
  }
}