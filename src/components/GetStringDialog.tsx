import * as autobind from 'autobind-decorator';
import * as React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Modal } from 'react-bootstrap';

interface Props {
  show: boolean;
  title: string;
  label: string;
  placeholder: string;
  confirm: string;
  onHide: () => void;
  onDone: (event: string) => void;
}

interface State {
  value: string;
}

export default class SubscribeDialog extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      value: '',
    };
  }

  public render() {
    const {
      title,
      label,
      placeholder,
      confirm,
      show,
      onHide,
    } = this.props;
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Title>{title}</Modal.Title>
        <Modal.Body>
          <FormGroup controlId="event-name">
            <ControlLabel>{label}</ControlLabel>
            <FormControl
                type="text"
                placeholder={placeholder}
                value={this.state.value}
                onChange={this.onChangeValue}
                onKeyDown={this.onKeyDown}
                autoFocus={true}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={onHide}>
            Cancel
          </Button>
          <Button
            bsStyle="success"
            onClick={this.onClickSubscribe}
            disabled={this.state.value.length === 0}
          >
            {confirm}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  @autobind
  private onChangeValue(e: any) {
    this.setState({ value: e.target.value });
  }

  @autobind
  private onKeyDown(e: any) {
    if (e.keyCode === 13 && this.state.value.length > 0) {
      this.onClickSubscribe();
    }
  }

  @autobind
  private onClickSubscribe() {
    this.props.onDone(this.state.value);
  }
}
