import * as React from 'react';

interface Props {
  client: deepstreamIO.Client;
}

interface State {
  users: any[];
}

export default class PresenceList extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  public componentWillMount() {
    this.props.client.presence.getAll(users => {
      console.log('users', users);
      this.setState({ users });
    });
  }

  public render() {
    return (
      <ul className="presence-list">
        {this.state.users.map(user => <li className="user" key={user}>{user}</li>)}
      </ul>
    );
  }
}
