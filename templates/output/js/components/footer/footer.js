import React from "react"
import styles from "./footer.css"

export class Footer extends React.Component {
  render() {
    return (
      <div className={styles.footer}>
        <p>
          <a className={styles.link} href="#"><strong>Barong</strong></a>
          &nbsp; &mdash; Visual Regression Testing Tools. It help us see things that cannot be seen with our mortal eyes.
        </p>
      </div>
    );
  }
}
