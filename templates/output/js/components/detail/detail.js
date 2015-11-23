import React from "react"
import styles from "./detail.css"

export class Detail extends React.Component {

  constructor(props) {
    super(props)
  }

  image(src, key) {
    return (
      <a href="javascript:" key={key} className={styles.link}>
        <img className={styles.image} src={src} />
      </a>
    );
  }

  title() {
    if(this.props.item) {
      return (
        <h2 className={styles.title}><strong>{this.props.item.ref}</strong></h2>
      )
    }
    return '';
  }

  diff() {
    if(this.props.item) {
      return (
        <span className={styles.diff}>Diff percentage: <strong className={styles.diff_value}>{this.props.item.report}%</strong></span>
      )
    }

    return '';

  }

  getDetails(item) {
    if(!item){
      return '';
    }

    return [
      this.image(item.ref, 0),
      this.image(item.test, 1),
      this.image(item.diff, 2)
    ]
  }

  render() {
    let details = this.getDetails(this.props.item)
    let detailClass = styles.detail;
    if(this.props.item) {
      if(this.props.item.passed) {
        detailClass = styles.detail + ' ' + styles.detail_success
      }else{
        detailClass = styles.detail + ' ' + styles.detail_failed
      }
    }
    return (
      <div className={detailClass}>
        <div className={styles.header}>
          {this.title()}
          {this.diff()}
        </div>
        <div className={styles.images}>
          {details}
        </div>
      </div>
    )
  }

}
