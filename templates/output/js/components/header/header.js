import React from "react"
import styles from "./header.css"

export class Header extends React.Component {
  render() {
    return (
      <div className={styles.header}>
        <h1 className={styles.title}>Barong Test Result</h1>
      </div>
    );
  }
}
