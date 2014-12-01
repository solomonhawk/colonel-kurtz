/* @flow */

var Actions    = require('../actions/block_list_actions')
var BlockList  = require('../models/block_list')
var BlockStore = require('../stores/block_store')
var Constants  = require('../constants/block_list_constants')
var Dispatcher = require('../dispatcher')
var Immutable  = require('immutable')
var Bus        = require('../bus')

var _blockLists = Immutable.List()

var BlockListStore = {

  all(): Array<BlockList> {
    return _blockLists
  },

  findByEditorId(editorId: number) {
    return this.all().find(blockList => blockList.editorId === editorId) || null
  },

  findByBlockId(blockId: number) {
    return this.all().find(blockList => blockList.blockId === blockId) || null
  },

  find(id: number) {
    return this.all().find((list) => list.id === id) || null
  },

  _create(params: Object): void {
    var blockList = new BlockList({ editorId: params.editorId, blockId: params.blockId })

    _blockLists = _blockLists.push(blockList)

    return blockList
  },

  _addBlockToList(block: Block, position: number) {
    var blockList = this.find(block.parentBlockListId)

    if (!blockList) {
      blockList = BlockListStore._create({ blockId: block.id })
    }

    blockList.insertBlock(block, position)

    Bus.publish()
  },

  _removeBlockFromList(blockId: number, blockListId: number) {
    var blockList = this.find(blockListId)

    if (blockList) {
      blockList.removeBlock(blockId)
      Bus.publish()
    }
  },

  dispatchToken: Dispatcher.register(function(action) {
    switch (action.type) {
      case BlockConstants.BLOCK_CREATE:
        Dispatcher.waitFor([ BlockStore.dispatchToken ])
        BlockListStore._addBlockToList(action.block, action.position)
        break
      case BlockConstants.BLOCK_DESTROY:
        BlockListStore._removeBlockFromList(action.blockId, action.parentBlockListId)
        break
      case Constants.BLOCK_LIST_CREATE:
        BlockListStore._create({ editorId: action.editorId, blockId: action.blockId })
        break
      default:
        // do nothing
    }
  })

}

module.exports = BlockListStore

// This is to get around circular dependencies
var BlockConstants = require('../constants/block_constants')
