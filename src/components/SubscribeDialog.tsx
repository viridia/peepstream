import * as autobind from 'autobind-decorator';
import * as React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Modal } from 'react-bootstrap';

interface Props {
  show: boolean;
  onHide: () => void;
  onSubscribe: (event: string) => void;
}

interface State {
  event: string;
}

/** Dialog for subscribing to a deepstream event. */
export default class SubscribeDialog extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      event: '',
    };
  }

  public render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Title>Subscribe to Event</Modal.Title>
        <Modal.Body>
          <FormGroup controlId="event-name">
            <ControlLabel>Event Name</ControlLabel>
            <FormControl
                type="event"
                placeholder="Name of event"
                value={this.state.event}
                onChange={this.onChangeEvent}
                onKeyDown={this.onKeyDown}
                autoFocus={true}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={this.props.onHide}>
            Cancel
          </Button>
          <Button
            bsStyle="success"
            onClick={this.onClickSubscribe}
            disabled={this.state.event.length === 0}
          >
            Subscribe
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  @autobind
  private onChangeEvent(e: any) {
    this.setState({ event: e.target.value });
  }

  @autobind
  private onKeyDown(e: any) {
    if (e.keyCode === 13 && this.state.event.length > 0) {
      this.onClickSubscribe();
    }
  }

  @autobind
  private onClickSubscribe() {
    this.props.onSubscribe(this.state.event);
  }
}
