/**
 * Youtube Colonel Kurtz Addon
 * This component adds a basic image block type, including a
 * src, caption, and credit
 */

let Field   = require('../common/field')
let Frame   = require('../common/frame')
let Graphic = require('../common/graphic')
let React   = require('react')

module.exports = React.createClass({

  getDefaultProps() {
    return {
      baseUrl: "https://www.youtube.com/embed/",
      content: {
        video_id: ''
      }
    }
  },

  getSrc(id) {
    var { baseUrl } = this.props
    return id ? baseUrl + id : null
  },

  render() {
    var { video_id } = this.props.content

    return (
      <div className="col-youtube">
        <Field element="textarea" label="YouTube Video ID" value={ video_id } name="youtube_video_id" onChange={ this._onChange } autofocus/>
        { this.props.children }
        <Frame open={ video_id }>
          <Graphic element="iframe" src={ this.getSrc(video_id) } />
        </Frame>
      </div>
    )
  },

  _onChange(e) {
    this.props.onChange({ video_id: e.currentTarget.value })
  }

})
