import React from "react"
import Resemble from "resemblejs"
import styles from "./item.css"

export class ThumbnailsItem extends React.Component {

  componentDidMount() {
    console.log('Resemble:', this.props.data.test)

    Resemble.outputSettings({
      errorColor: {
        red: 255,
        green: 87,
        blue: 34
      },
    })

    Resemble(this.props.data.test).compareTo(this.props.data.ref).ignoreColors().onComplete(function(data){
      this.props.updateDataItem(this.props.index, {
        diff: data.getImageDataUrl(),
        report: data.misMatchPercentage,
        passed: (data.misMatchPercentage == 0)
      });
    }.bind(this))
  }

  setActive() {
    this.props.setActiveItemIndex(this.props.index)
  }

  render() {
    let itemClassName = styles.item
    if(typeof this.props.data.passed !== 'undefined') {
      if(this.props.data.passed) {
        itemClassName += " " + styles.item_success
      }else {
        itemClassName += " " + styles.item_failed
      }
    }

    if(this.props.active) {
      itemClassName += " " + styles.item_active
    }
    

    return (
      <a href="javascript:;" onClick={this.setActive.bind(this)} className={itemClassName}>
        <img className={styles.image} src={this.props.data.test} />
      </a>
    )
  }
}
