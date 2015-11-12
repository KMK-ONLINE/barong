import React from "react"

export class Detail extends React.Component {

  constructor(props) {
    super(props)
  }

  image(src, key) {
    return (
      <a href="javascript:" key={key} className="detail__link">
        <img className="detail__image" src={src} />
      </a>
    );
  }

  title() {
    if(this.props.item) {
      return (
        <h2 className="detail__title"><strong>{this.props.item.ref}</strong></h2>
      )
    }
    return '';
  }

  diff() {
    if(this.props.item) {
      return (
        <span className="detail__diff">Diff percentage: <strong className="detail__diff-value">{this.props.item.report}%</strong></span>
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
    let detailClass = 'detail';
    if(this.props.item) {
      if(this.props.item.passed) {
        detailClass += ' detail_success'
      }else{
        detailClass += ' detail_failed'
      }
    }
    return (
      <div className={detailClass}>
        <div className="detail__header">
          {this.title()}
          {this.diff()}
        </div>
        <div className="detail__images">
          {details}
        </div>
      </div>
    )
  }

}
