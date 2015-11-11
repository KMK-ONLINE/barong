import React from "react"

export class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <p>
          <a className="footer__link" href="#"><strong>Barong</strong></a>
          &nbsp; &mdash; Visual Regression Testing Tools. It help us see things that cannot be seen with our mortal eyes.
        </p>
      </div>
    );
  }
}
