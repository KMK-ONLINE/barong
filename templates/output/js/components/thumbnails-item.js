import React from "react"
import Resemble from "resemblejs"

export class ThumbnailsItem extends React.Component {

  componentDidMount() {
    Resemble.outputSettings({
      errorColor: {
        red: 255,
        green: 87,
        blue: 34
      },
    });

    Resemble(this.props.data.test).compareTo(this.props.data.ref).ignoreColors().onComplete(function(data){
      this.props.updateDataItem(this.props.index, {
        diff: data.getImageDataUrl(),
        report: data.misMatchPercentage,
        passed: (data.misMatchPercentage == 0)
      });
    }.bind(this));
  }

  setActive() {
    this.props.setActiveItemIndex(this.props.index)
  }

  render() {
    let itemClassName = "thumbnails__item"
    if(typeof this.props.data.passed !== 'undefined') {
      if(this.props.data.passed) {
        itemClassName += " thumbnails__item_success"
      }else {
        itemClassName += " thumbnails__item_failed"
      }
    }

    if(this.props.active) {
      itemClassName += " thumbnails__item_active"
    }
    

    return (
      <a href="javascript:;" onClick={this.setActive.bind(this)} className={itemClassName}>
        <img className="thumbnails__image" src={this.props.data.test} />
      </a>
    )
  }
}
