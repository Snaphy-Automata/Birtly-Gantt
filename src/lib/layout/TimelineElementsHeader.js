import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'

import { iterateTimes, getNextUnit, iterateHeaderTimes } from '../utility/calendar'

export default class TimelineElementsHeader extends Component {
  static propTypes = {
    hasRightSidebar: PropTypes.bool.isRequired,
    showPeriod: PropTypes.func.isRequired,
    canvasTimeStart: PropTypes.number.isRequired,
    canvasTimeEnd: PropTypes.number.isRequired,
    canvasWidth: PropTypes.number.isRequired,
    minUnit: PropTypes.string.isRequired,
    timeSteps: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    headerLabelFormats: PropTypes.object.isRequired,
    subHeaderLabelFormats: PropTypes.object.isRequired,
    headerLabelGroupHeight: PropTypes.number.isRequired,
    headerLabelHeight: PropTypes.number.isRequired,
    registerScroll: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    props.registerScroll(scrollX => {
      if (scrollX != null) {
        this.headerEl.scrollLeft = scrollX
      }
    })
    this.state = {
      touchTarget: null,
      touchActive: false
    }
  }

  handleHeaderMouseDown(evt) {
    //dont bubble so that we prevent our scroll component
    //from knowing about it
    evt.stopPropagation()
  }

  headerLabel(time, unit, width) {
    const { headerLabelFormats: f } = this.props

    if (unit === 'year') {
      return time.format(width < 46 ? f.yearShort : f.yearLong)
    } else if (unit === 'month') {
      return time.format(
        width < 65
          ? f.monthShort
          : width < 75
            ? f.monthMedium
            : width < 120 ? f.monthMediumLong : f.monthLong
      )
    }else if (unit === 'week') {
      const weekEnd = moment(time).add(6, 'day')
      let endDate   = weekEnd.date()
      //const dateWithYear = time.format('YYYY, MMM D')
      const dateWithoutYear = time.format('MMM D')
      if(width < 150){
        const startDay = time.date();
        return `${startDay}-${endDate}`
      }else{
        if(time.month() !== weekEnd.month()){
          //endDate = moment(time).endOf('month').date()
          if(time.year() !== weekEnd.year()){
            const endDateWithYear = weekEnd.format('MMM D, YYYY')
            const startDateWithYear = time.format('MMM D, YYYY')
            return `${startDateWithYear} - ${endDateWithYear}`
          }else{
            const endDateWithoutYear = weekEnd.format('MMM D')
            return `${dateWithoutYear}-${endDateWithoutYear}`
          }
        }
        if(moment().year() === time.year()){
          return `${dateWithoutYear}-${endDate}`
        }else{
          return `${dateWithoutYear}-${endDate}`
        }
      }

      // return time.format(
      //   width < 65
      //     ? f.monthShort
      //     : width < 75
      //       ? f.monthMedium
      //       : width < 120 ? f.monthMediumLong : f.monthLong
      // )
    }
     else if (unit === 'day') {
      return time.format(width < 150 ? f.dayShort : f.dayLong)
    } else if (unit === 'hour') {
      return time.format(
        width < 50
          ? f.hourShort
          : width < 130
            ? f.hourMedium
            : width < 150 ? f.hourMediumLong : f.hourLong
      )
    } else {
      return time.format(f.time)
    }
  }

  subHeaderLabel(time, unit, width) {
    const { subHeaderLabelFormats: f } = this.props

    if (unit === 'year') {
      return time.format(width < 46 ? f.yearShort : f.yearLong)
    } else if (unit === 'month') {
      return time.format(
        width < 37 ? f.monthShort : width < 85 ? f.monthMedium : f.monthLong
      )
    } else if (unit === 'day') {
      if(width < 47){
        if(f.dayShort === 'dd'){
          //mo | tu | we | th
          const daysInTwoWords = time.format(
            width < 47
              ? f.dayShort
              : width < 80 ? f.dayMedium : width < 120 ? f.dayMediumLong : f.dayLong
          )

          //const dayInNumber = time.date()

          let daysInOneWord = daysInTwoWords[0]
          return daysInOneWord
          // m | t | w
          //return (<span>{dayInNumber}<sup>{daysInOneWord}</sup></span>)
        }else{
          return time.format(
            width < 47
              ? f.dayShort
              : width < 80 ? f.dayMedium : width < 120 ? f.dayMediumLong : f.dayLong
          )
        }
      }

      return time.format(
        width < 47
          ? f.dayShort
          : width < 80 ? f.dayMedium : width < 120 ? f.dayMediumLong : f.dayLong
      )
    } else if (unit === 'hour') {
      return time.format(width < 50 ? f.hourShort : f.hourLong)
    } else if (unit === 'minute') {
      return time.format(width < 60 ? f.minuteShort : f.minuteLong)
    } else {
      return time.get(unit)
    }
  }

  handlePeriodClick = (time, unit) => {
    if (time && unit) {
      this.props.showPeriod(moment(time - 0), unit)
    }
  }

  shouldComponentUpdate(nextProps) {
    const willUpate =
      nextProps.canvasTimeStart != this.props.canvasTimeStart ||
      nextProps.canvasTimeEnd != this.props.canvasTimeEnd ||
      nextProps.width != this.props.width ||
      nextProps.canvasWidth != this.props.canvasWidth ||
      nextProps.subHeaderLabelFormats != this.props.subHeaderLabelFormats ||
      nextProps.headerLabelFormats != this.props.headerLabelFormats

    return willUpate
  }

  getStartOfDay = () => {
    const start = new Date();
    return start.setHours(0,0,0,0);
  }

  render() {
    const {
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      minUnit,
      timeSteps,
      headerLabelGroupHeight,
      headerLabelHeight,
      hasRightSidebar
    } = this.props
    const ratio = canvasWidth / (canvasTimeEnd - canvasTimeStart)
    const twoHeaders = minUnit !== 'year'
    //Update: Robins - 13th March 2019
    const startOfDayMs = this.getStartOfDay()
    const topHeaderLabels = []

    // add the top header
    if (twoHeaders) {
      const nextUnit = getNextUnit(minUnit)
      iterateHeaderTimes(
        canvasTimeStart,
        canvasTimeEnd,
        nextUnit,
        timeSteps,
        (time, nextTime) => {
          const left = Math.round((time.valueOf() - canvasTimeStart) * ratio)
          const right = Math.round(
            (nextTime.valueOf() - canvasTimeStart) * ratio
          )

          const labelWidth = right - left
          // this width applies to the content in the header
          // it simulates stickyness where the content is fixed in the center
          // of the label.  when the labelWidth is less than visible time range,
          // have label content fill the entire width
          const contentWidth = Math.min(labelWidth, canvasWidth / 3)

          topHeaderLabels.push(
            <div
              key={`top-label-${time.valueOf()}`}
              className={`rct-label-group${
                hasRightSidebar ? ' rct-has-right-sidebar' : ''
              }`}
              onClick={() => this.handlePeriodClick(time, nextUnit)}
              style={{
                //left: `${left - 1}px`, //Removed original, 17th Dec 2018, Robins Gupta
                left: `${left}px`,
                width: `${labelWidth}px`,
                height: `${headerLabelGroupHeight}px`,
                lineHeight: `${headerLabelGroupHeight}px`,
                cursor: 'pointer'
              }}
            >
              <span style={{ width: contentWidth, display: 'block' }}>
                {this.headerLabel(time, nextUnit, labelWidth)}
              </span>
            </div>
          )
        }
      )
    }

    const bottomHeaderLabels = []
    let i=1;
    iterateTimes(
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      (time, nextTime) => {
        let isWeekEnd = false
        const left             = Math.round((time.valueOf() - canvasTimeStart) * ratio)
        const minUnitValue     = time.get(minUnit === 'day' ? 'date' : minUnit)
        //const nextMinUnitValue = nextTime.get(minUnit === 'day' ? 'date' : minUnit)
        const firstOfType      = minUnitValue === (minUnit === 'day' ? 1 : 0)
        const labelWidth       = Math.round(
          (nextTime.valueOf() - time.valueOf()) * ratio
        )

        if(minUnitValue === 1 && minUnit === 'day'){
          isWeekEnd = true
        }else{
          isWeekEnd = i%8 === 0
        }
        

        let labelClassName     = `rct-label ${twoHeaders ? '' : 'rct-label-only'} ${
          firstOfType ? 'rct-first-of-type' : ''
        } ${minUnit !== 'month' ? `rct-day-${time.day()}` : ''} `
        let leftCorrect = 0

        if(isWeekEnd){
          labelClassName = `${labelClassName} snaphy-week-end`
        }

        if(startOfDayMs === time.valueOf()){
          labelClassName = `${labelClassName} today`
        }

        leftCorrect = firstOfType ? 1 : 0

        bottomHeaderLabels.push(
          <div
            key={`label-${time.valueOf()}`}
            className={labelClassName}
            onClick={() => this.handlePeriodClick(time, minUnit)}
            style={{
              left: `${left - leftCorrect}px`,
              width: `${labelWidth}px`,
              height: `${
                minUnit === 'year'
                  ? headerLabelGroupHeight + headerLabelHeight
                  : headerLabelHeight
              }px`,
              lineHeight: `${
                minUnit === 'year'
                  ? headerLabelGroupHeight + headerLabelHeight
                  : headerLabelHeight
              }px`,
              fontSize: `${
                labelWidth > 30 ? '14' : labelWidth > 20 ? '12' : '10'
              }px`,
              cursor: 'pointer'
            }}
          >
            {this.subHeaderLabel(time, minUnit, labelWidth)}
          </div>
        )

        if(isWeekEnd){
          i=1
        }else{
          i++
        }
      }
    )

    let headerStyle = {
      height: `${headerLabelGroupHeight + headerLabelHeight}px`
    }

    return (
      <div
        key="header"
        data-testid="header"
        className="rct-header"
        onMouseDown={this.handleHeaderMouseDown}
        onTouchStart={this.touchStart}
        onTouchEnd={this.touchEnd}
        style={headerStyle}
        ref={el => (this.headerEl = el)}
      >
        <div
          className="top-header"
          style={{ height: twoHeaders ? headerLabelGroupHeight : 0, width: canvasWidth }}
        >
          {topHeaderLabels}
        </div>
        <div
          className="bottom-header"
          style={{ height: twoHeaders ? headerLabelHeight : headerLabelHeight + headerLabelGroupHeight, width: canvasWidth }}
        >
          {bottomHeaderLabels}
        </div>
      </div>
    )
  }
}
