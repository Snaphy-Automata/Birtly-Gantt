/**
 * Created by Robins Gupta
 * 7th Sept 2018.
 */
import { _get } from './utility/generic'
import {calculateDimensions} from './utility/calendar'

/**
 * Will stack item based on given info..
 */
export const stackItem=(
  item,
  group,
  index,
  canvasTimeStart,
  visibleTimeStart,
  visibleTimeEnd,
  width,
  lineHeight,
  itemHeightRatio,
  keys,
  state,
  getItemTop,
  getItemHeight
) => {

  const {
    draggingItem,
    dragTime,
    resizingItem,
    resizingEdge,
    resizeTime,
    newGroupOrder
  } = state
  const zoom = visibleTimeEnd - visibleTimeStart
  const canvasTimeEnd = canvasTimeStart + zoom * 3
  const canvasWidth = width * 3

  //const visibleItem = _get(item, keys.itemTimeStartKey) <= canvasTimeEnd && _get(item, keys.itemTimeEndKey) >= canvasTimeStart

  //if(visibleItem){
    const itemId = _get(item, keys.itemIdKey)
    const isDragging = itemId === draggingItem
    const isResizing = itemId === resizingItem

    const groupTop = getItemTop(itemId)
    const height = getItemHeight(itemId)

    let dimension = calculateDimensions({
      itemTimeStart: _get(item, keys.itemTimeStartKey),
      itemTimeEnd: _get(item, keys.itemTimeEndKey),
      isDragging,
      isResizing,
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      dragTime,
      resizingEdge,
      resizeTime
    })

    if (dimension) {
      dimension.top = null
      dimension.order = isDragging
        ? newGroupOrder
        : index
      dimension.stack = item?!item.isOverlay:false
      dimension.height = height * itemHeightRatio
      dimension.isDragging = isDragging
    }

    return { dimension, groupHeight: height, groupTop }
}

export default  stackItem
