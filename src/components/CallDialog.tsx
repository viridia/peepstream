import * as autobind from 'autobind-decorator';
import * as React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock, Modal } from 'react-bootstrap';
import './CallDialog.scss';

interface Props {
  show: boolean;
  onHide: () => void;
  onCall: (event: string, content: string) => void;
}

interface State {
  method: string;
  content: string;
  contentError: string;
  contentValidation: 'error' | undefined;
}

export default class CallDialog extends React.Component<Props, State> {
  private contentEdit: any;

  constructor() {
    super();
    this.state = {
      method: '',
      content: '',
      contentError: '',
      contentValidation: undefined,
    };
  }

  public render() {
    const {
      method,
      content,
      contentError,
      contentValidation,
    } = this.state;

    const contentRef = (el: any) => { this.contentEdit = el; };
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="call-dialog">
        <Modal.Title>Call RPC</Modal.Title>
        <Modal.Body>
          <FormGroup controlId="event-name">
            <ControlLabel>RPC Name</ControlLabel>
            <FormControl
                type="text"
                placeholder="Name of RPC"
                value={method}
                onChange={this.onChangeMethod}
                autoFocus={true}
            />
          </FormGroup>
          <FormGroup controlId="event-content" validationState={contentValidation}>
            <ControlLabel>Content</ControlLabel>
            <FormControl
                type="text"
                placeholder="Call data (JSON)"
                componentClass="textarea"
                value={content}
                onChange={this.onChangeContent}
                inputRef={contentRef}
            />
            <HelpBlock>{contentError}</HelpBlock>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={this.props.onHide}>
            Cancel
          </Button>
          <Button
            bsStyle="success"
            onClick={this.onClickCall}
            disabled={method.length === 0}
          >
            Call
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  @autobind
  private onChangeMethod(e: any) {
    this.setState({ method: e.target.value });
  }

  @autobind
  private onChangeContent(e: any) {
    this.setState({ content: e.target.value, contentValidation: null, contentError: '' });
  }

  @autobind
  private onClickCall() {
    try {
      const json = this.state.content ? JSON.parse(this.state.content) : null;
      this.props.onCall(this.state.method, json);
    } catch (e) {
      const m = /position (\d+)/.exec(e.message);
      if (m) {
        const position = parseInt(m[1], 10);
        this.contentEdit.focus();
        this.contentEdit.selectionStart = position;
        this.contentEdit.selectionEnd = position + 1;
      }
      this.setState({ contentValidation: 'error', contentError: e.message });
    }
  }
}
