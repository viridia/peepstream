import * as React from 'react';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Control that displays a toggleable triangle that rotates downward when checked. */
export default function DisclosureTriangle(props: Props) {
  const onChange = (ev: any) => props.onChange(ev.target.checked);
  return (
    <input
        type="checkbox"
        className="disclosure-triangle"
        checked={props.checked}
        onChange={onChange}
    />
  );
}
