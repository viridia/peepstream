import * as autobind from 'autobind-decorator';
import * as React from 'react';
import DisclosureTriangle from './DisclosureTriangle';
import './Display.scss';

interface Props {
  data: any;
  fieldName: string;
  fieldPath: string;
}

interface State {
  expanded: boolean;
}

export default class DisplayObject extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  public render() {
    return (
      <section className="display object">
        <DisclosureTriangle checked={this.state.expanded} onChange={this.onToggleExpanded} />
        {this.renderContent()}
      </section>
    );
  }

  private renderContent() {
    const prefix = this.props.fieldName ? `${this.props.fieldName}: ` : '';
    if (this.state.expanded) {
      if (Array.isArray(this.props.data)) {
        return (
          <div className="content expanded">
            <div>{prefix}[</div>
            {this.props.data.map(this.renderElement)}
            <div>]</div>
          </div>
        );
      }
      const names = Object.getOwnPropertyNames(this.props.data);
      names.sort();
      return (
        <div className="content expanded">
          <div>{prefix}{'{'}</div>
          {names.map(this.renderField)}
          <div>}</div>
        </div>
      );
    } else {
      return <div className="object-content">{prefix}{JSON.stringify(this.props.data)}</div>;
    }
  }

  @autobind
  private renderField(field: string): JSX.Element {
    const value = this.props.data[field];
    if (typeof value === 'object') {
      const fieldPath = this.props.fieldName ? `${this.props.fieldName}.${field}` : field;
      return <DisplayObject data={value} fieldName={field} fieldPath={fieldPath} key={field} />;
    } else {
      return (
        <div className="display primitive" key={field}>
          <div className="indent" />
          <div className="value">{field}: {JSON.stringify(value)}</div>
        </div>
      );
    }
  }

  @autobind
  private renderElement(value: string, index: number): JSX.Element {
    if (typeof value === 'object') {
      const field = `${index}`;
      const fieldPath = this.props.fieldName ? `${this.props.fieldName}.${index}` : field;
      return <DisplayObject data={value} fieldPath={fieldPath} fieldName={field} key={index} />;
    } else {
      return (
        <div className="display primitive" key={index}>
          <div className="indent" />
          <div className="value">{index}: {JSON.stringify(value)}</div>
        </div>
      );
    }
  }

  @autobind
  private onToggleExpanded(expanded: boolean) {
    this.setState({ expanded });
  }
}
