import React from "react"
import styles from "./content.css"
import {Thumbnails} from "../thumbnails/thumbnails.js"
import {Detail} from "../detail/detail.js"

export class Content extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      activeItemIndex: -1
    }
  }

  updateDataItem(index, newData) {
    let data = this.state.data
    data[index].diff = newData.diff
    data[index].report = newData.report
    data[index].passed = newData.passed
    
    this.setState({data: data})
  }

  setActiveItemIndex(activeItemIndex) {
    this.setState({
      activeItemIndex: activeItemIndex
    })
  }

  render() {
    let detail = ''
    if(this.state.activeItemIndex > -1) {
      detail = <Detail item={this.state.data[this.state.activeItemIndex]}/>
    }
    return (
      <div className={styles.content}>
        <Thumbnails 
          data={this.state.data} 
          activeItemIndex={this.state.activeItemIndex}
          updateDataItem={this.updateDataItem.bind(this)}
          setActiveItemIndex={this.setActiveItemIndex.bind(this)} />
        {detail}
      </div>
    )
  }
}
