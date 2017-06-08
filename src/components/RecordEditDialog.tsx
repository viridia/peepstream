import * as autobind from 'autobind-decorator';
import * as React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock, Modal } from 'react-bootstrap';
import './RecordEditDialog.scss';

interface Props {
  show: boolean;
  recordName: string;
  fieldName: string;
  content: any;
  onHide: () => void;
  onSave: (record: string, field: string, content: string) => void;
}

interface State {
  content: string;
  contentError: string;
  contentValidation: 'error' | undefined;
}

/** Dialog for editing the content of a record. */
export default class RecordEditDialog extends React.Component<Props, State> {
  private contentEdit: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      content: JSON.stringify(props.content, null, 2),
      contentError: '',
      contentValidation: undefined,
    };
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.content !== this.props.content) {
      this.setState({ content: JSON.stringify(nextProps.content, null, 2) });
    }
  }

  public render() {
    const {
      recordName,
      fieldName,
    } = this.props;

    const {
      content,
      contentError,
      contentValidation,
    } = this.state;

    const contentRef = (el: any) => { this.contentEdit = el; };
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="record-edit-dialog">
        <Modal.Title>Edit Record</Modal.Title>
        <Modal.Body>
          <header>
            <span className="name">Record:</span>
            <span className="value">{recordName}</span>
          </header>
          {fieldName && <header>
            <span className="name">Field:</span>
            <span className="value">{fieldName}</span>
          </header>}
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
            onClick={this.onClickSave}
            disabled={content.length === 0}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  @autobind
  private onChangeContent(e: any) {
    this.setState({ content: e.target.value, contentValidation: null, contentError: '' });
  }

  @autobind
  private onClickSave() {
    try {
      const json = JSON.parse(this.state.content);
      if (typeof json !== 'object') {
        this.setState({ contentValidation: 'error', contentError: 'Value must be an object.' });
      } else if (Array.isArray(json)) {
        this.setState({
          contentValidation: 'error',
          contentError: 'Value should not be an array.',
        });
      } else {
        this.props.onSave(this.props.recordName, this.props.fieldName, json);
      }
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
