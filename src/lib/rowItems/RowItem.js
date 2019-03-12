//Created by Robins
//10th Sept 2018
import PropTypes                    from 'prop-types'
import React, { Component, Fragment }         from 'react'


//Custom import
import GroupRow                     from '../row/GroupRow'
import { _get,  } from '../utility/generic'
import Item                         from '../items/Item'


const canResizeLeft = (item, canResize) => {
  const value =
    _get(item, 'canResize') !== undefined ? _get(item, 'canResize') : canResize
  return value === 'left' || value === 'both'
}

const canResizeRight = (item, canResize) => {
  const value =
    _get(item, 'canResize') !== undefined ? _get(item, 'canResize') : canResize
  return value === 'right' || value === 'both' || value === true
}

const RowItem = (props) => {
  //First check if the item is visible or not...
  const {
    stackItem,
    item,
    //itemId,
    minimumWidthForItemContentVisibility,
    //Horizontal Lines Props
    clickTolerance,
    onRowClick,
    onRowDoubleClick,
    index,
    canvasWidth,
    canvasTimeEnd,
    canvasTimeStart,
    height,
  } = props

  const { itemIdKey, itemTimeStartKey, itemTimeEndKey } = props.keys
  const {dimension, groupHeight, groupTop} = stackItem(index, item)
  const startDateMs = _get(item, itemTimeStartKey)
  const endDateMs   = _get(item, itemTimeEndKey)
  const isVisible = startDateMs <= canvasTimeEnd && endDateMs >= canvasTimeStart
  const totalHeight = props.totalListHeight
  return (
    <Fragment>
        <div
          key={`horizontal-line-${index}`}
          style={{
            ...props.style,
            height,
          }}
        >
        <GroupRow
          clickTolerance={clickTolerance}
          onClick={evt => onRowClick(evt, index)}
          onDoubleClick={evt => onRowDoubleClick(evt, index)}
          key={`horizontal-line-${index}`}
          isEvenRow={index % 2 === 0}
          style={{
            width: `${canvasWidth}px`,
            height: `${groupHeight - 1}px`,
          }}
        />
        {isVisible &&
          <Item
            index={index}
            style={{}}
            key={_get(item, itemIdKey)}
            item={item}
            keys={props.keys}
            order={index}
            dimensions={dimension}
            isExternalDragHandler={props.isExternalDragHandler}
            selected={props.isSelected(item, itemIdKey)}
            canChangeGroup={
              _get(item, 'canChangeGroup') !== undefined
                ? _get(item, 'canChangeGroup')
                : props.canChangeGroup
            }
            canMove={
              _get(item, 'canMove') !== undefined
                ? _get(item, 'canMove')
                : props.canMove
            }
            canResizeLeft={canResizeLeft(item, props.canResize)}
            canResizeRight={canResizeRight(item, props.canResize)}
            canSelect={
              _get(item, 'canSelect') !== undefined
                ? _get(item, 'canSelect')
                : props.canSelect
            }
            useResizeHandle={props.useResizeHandle}
            topOffset={props.topOffset}
            groupTop={groupTop}
            canvasTimeStart={props.canvasTimeStart}
            canvasTimeEnd={props.canvasTimeEnd}
            canvasWidth={props.canvasWidth}
            dragSnap={props.dragSnap}
            minResizeWidth={props.minResizeWidth}
            onResizing={props.itemResizing}
            onResized={props.itemResized}
            moveResizeValidator={props.moveResizeValidator}
            onDrag={props.itemDrag}
            onDrop={props.itemDrop}
            onItemDoubleClick={props.onItemDoubleClick}
            onContextMenu={props.onItemContextMenu}
            onSelect={props.itemSelect}
            itemRenderer={props.itemRenderer}
            minimumWidthForItemContentVisibility={
              minimumWidthForItemContentVisibility
            }
          />
        }
      </div>
      {
        item &&
        <div  
          id={`marker-${item.id}`}   
          style={{
            display: "none",
            pointerEvents: 'none',
            top: '0px',
            position: "absolute",
            height: `${totalHeight}px`,
            left: `${dimension.left}px`,
            width: `${dimension.width}px`,
            zIndex:1,
            borderRight: "1px solid #339999",
            borderLeft: "1px solid #339999"
          }}
        >
          <div style={{
            height:"100%",
            width:"100%",
            opacity:"0.1",
            backgroundColor: "#339999",
          }}></div>
        </div>
      }
        
    </Fragment>
    
  )

}


RowItem.propTypes = {
  lineHeight: PropTypes.number.isRequired,
  getItemHeight: PropTypes.func.isRequired,
  itemHeightRatio: PropTypes.number.isRequired,
  setRowListRef: PropTypes.func,
  stackItem: PropTypes.func.isRequired,
  getItemHoc: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
  itemId: PropTypes.string.isRequired,
  item: PropTypes.object,
  index: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  //Row
  lineCount: PropTypes.number.isRequired,
  onRowClick: PropTypes.func.isRequired,
  onRowDoubleClick: PropTypes.func.isRequired,
  clickTolerance: PropTypes.number.isRequired,

  //Items
  screenHeight: PropTypes.number.isRequired,
  groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  canvasTimeStart: PropTypes.number.isRequired,
  canvasTimeEnd: PropTypes.number.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  minimumWidthForItemContentVisibility: PropTypes.number.isRequired,
  dragSnap: PropTypes.number,
  minResizeWidth: PropTypes.number,
  selectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  canChangeGroup: PropTypes.bool.isRequired,
  canMove: PropTypes.bool.isRequired,
  canResize: PropTypes.oneOf([true, false, 'left', 'right', 'both']),
  canSelect: PropTypes.bool,
  keys: PropTypes.object.isRequired,
  moveResizeValidator: PropTypes.func,
  itemSelect: PropTypes.func,
  itemDrag: PropTypes.func,
  itemDrop: PropTypes.func,
  itemResizing: PropTypes.func,
  itemResized: PropTypes.func,
  onItemDoubleClick: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  itemRenderer: PropTypes.func,
  selected: PropTypes.array,
  topOffset: PropTypes.number,
  useResizeHandle: PropTypes.bool,
  isSelected: PropTypes.func.isRequired,
  isExternalDragHandler: PropTypes.bool.isRequired,
  totalListHeight: PropTypes.number,
}

export default RowItem
