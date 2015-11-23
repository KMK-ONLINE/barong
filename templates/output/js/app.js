import React from "react"
import ReactDOM from "react-dom"
import {Header} from "./components/header.js"
import {Footer} from "./components/footer.js"
import {Content} from "./components/content.js"

class Page extends React.Component {

  render() {
    return (
      <div className="page">
        <Header />
        <Content data={this.props.data} />
        <Footer />
      </div>
    );
  }
}

window.render = function(data){
  ReactDOM.render(
    <Page data={data} />,
    document.getElementById('page')
  )
  document.getElementById('key').focus()
}
