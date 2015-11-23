import React from "react"
import ReactDOM from "react-dom"
import {Header} from "./components/header/header.js"
import {Footer} from "./components/footer/footer.js"
import {Content} from "./components/content/content.js"

class Page extends React.Component {

  render() {
    return (
      <div className="app">
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
}
