/**
 * This component adds a medium.com-like rich text editor block type.
 *
 * Source for this component can be found here:
 * https://github.com/daviferreira/medium-editor
 */

var Editor    = require('./editor')
var React     = require('react')

require('./style')

var Medium = {

  defaultContent() {
    return { html: '', text: '' }
  },

  render() {
    return <Editor onBlur={ this.setContent } { ...this.state.content } />
  }

}

module.exports = Medium
