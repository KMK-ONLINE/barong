import React from "react"
import {ThumbnailsItem} from "./item/item.js"
import styles from "./thumbnails.css"

export class Thumbnails extends React.Component {

  onKeyUp(e) {
    let index = this.props.activeItemIndex
    if(e.keyCode == 37 || e.keyCode == 40) {
      index = this.props.activeItemIndex - 1
      if(index < 0) {
        index = this.props.data.length - 1
      }
    } else if(e.keyCode === 38 || e.keyCode === 39) {
      index = this.props.activeItemIndex + 1
      if(index > this.props.data.length - 1){
        index = 0
      }
    }
    this.props.setActiveItemIndex(index)
  }

  componentDidMount() {
    document.getElementById('key').focus()
  }
 
  render() {
    let items = this.props.data.map(function(itemData, index){
      return (
        <ThumbnailsItem
          index={index}
          key={index}
          data={itemData}
          active={index==this.props.activeItemIndex}
          updateDataItem={this.props.updateDataItem}
          setActiveItemIndex={this.props.setActiveItemIndex}
          />
      )
    }.bind(this))

    return (
      <div className={styles.thumbnails}  onKeyUp={this.onKeyUp.bind(this)}>
        {items}
        <input type="text" id="key" className={styles.key} />
      </div>
      )
  } 
}
