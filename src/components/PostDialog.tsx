import autobind from 'bind-decorator';
import * as React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock, Modal } from 'react-bootstrap';
import './PostDialog.scss';

interface Props {
  show: boolean;
  onHide: () => void;
  onPost: (event: string, content: string) => void;
}

interface State {
  event: string;
  content: string;
  contentError: string;
  contentValidation: 'error' | undefined;
}

/** Dialog for posting a deepstream event. */
export default class PostDialog extends React.Component<Props, State> {
  private contentEdit: any;

  constructor() {
    super();
    this.state = {
      event: '',
      content: '',
      contentError: '',
      contentValidation: undefined,
    };
  }

  public render() {
    const {
      event,
      content,
      contentError,
      contentValidation,
    } = this.state;

    const contentRef = (el: any) => { this.contentEdit = el; };
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="post-dialog">
        <Modal.Title>Post Event</Modal.Title>
        <Modal.Body>
          <FormGroup controlId="event-name">
            <ControlLabel>Event Name</ControlLabel>
            <FormControl
                type="text"
                placeholder="Name of event"
                value={event}
                onChange={this.onChangeEvent}
                autoFocus={true}
            />
          </FormGroup>
          <FormGroup controlId="event-content" validationState={contentValidation}>
            <ControlLabel>Content</ControlLabel>
            <FormControl
                type="text"
                placeholder="Event content (JSON)"
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
            onClick={this.onClickPost}
            disabled={event.length === 0 || content.length === 0}
          >
            Post
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
  private onChangeContent(e: any) {
    this.setState({ content: e.target.value, contentValidation: null, contentError: '' });
  }

  @autobind
  private onClickPost() {
    try {
      const json = JSON.parse(this.state.content);
      this.props.onPost(this.state.event, json);
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
