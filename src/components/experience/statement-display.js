import React from "react";

export default class StatementDisplay extends React.Component {
    constructor ({
        props,
    }) {
        super();
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}