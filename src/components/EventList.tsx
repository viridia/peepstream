import * as React from 'react';

interface Props {
  client: deepstreamIO.Client;
}

interface State {
  users: any[];
}

export default class EventList extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  public componentWillMount() {
    this.props.client.event.listen('.*', (match, isSubscribed, response) => {
      console.log('event', match, isSubscribed);
      response.accept();
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
