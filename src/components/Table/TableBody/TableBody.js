import React, { useContext, useEffect, memo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { InfiniteList } from '../../../index'
import TableContext from '../TableContext'
import { TableRow } from './TableRow'
import { useTableData } from "../UseTableData"
import styles from './TableBody.module.scss'
// const TestItem = () => {
//   const [isShowing, setIsShowing ] = useState(false)
//   console.log("test",isShowing)
//   return <button onClick={ () => setIsShowing(!isShowing) }>{ isShowing && <p>rendering</p> }</button>
// }
const TableBody = ({
  data,
  totalItems,
  isLoading,
  loadMoreData,
  rowHeight,
  rowActions,
  onRowClick,
  className,
  ...otherProps
}) => {

  const { state, setData, setWithRowActions, setTotalItems,toggleSelectedItem } = useContext(TableContext)
  const { columns, columnManagement, selection, selfControlled } = state
  const tableData = useTableData()

  useEffect(() => {
    setData(data)
  }, [setData, data])

  useEffect(() => {
    setTotalItems(selfControlled ? data.length : totalItems)
  }, [data, totalItems, selfControlled, setTotalItems])

  useEffect(() => {
    setWithRowActions(!!rowActions)
  }, [setWithRowActions, rowActions])


  const renderRow = ((row, index) => {
    return(
      <TableRow
        isActive={ !!selection.isActive }
        isSelected={ isRowSelected(row.id) }
        toggleSelectedItem={ toggleSelectedItem }
        key={ row.id }
        id={ row.id }
        columns={ columns }
        columnManagement={ columnManagement.isActive }
        rowActions={ rowActions }
        row={ row }
        rowHeight={ rowHeight }
        onRowClick={ onRowClick }
      />
    ) })
  const isRowSelected = id => {
    const { isActive, excludeMode, items } = selection
    if (!isActive) {
      return null
    }
    let isSelected = items.some(rowId => rowId === id)
    return excludeMode ? !isSelected : isSelected
  }
  const loadingRender = () => {
    console.log(isLoading)
    if(!isLoading) {
      return
    }
    console.log(Array.from({ length: 5 }, (_, index) => (
      <TableRow columns={ columns } isLoading={ true } key={ index }/>
    )))
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow columns={ columns } isLoading={ true } key={ index }/>
    ))
  }

  const classes = classNames(
    styles.tableBody,
    className,
  )

  return (
    <div
      className={ classes }
	    { ...otherProps }
    >
	    <InfiniteList
        totalItems={ +totalItems }
        rowRender={ renderRow }
        items={ tableData }
        customLoader={ loadingRender }
        isLoading={ isLoading }
        loadMoreItems={ loadMoreData }
      >
      </InfiniteList>
    </div>
  )
}

TableBody.defaultProps = {
  rowHeight: '56px',
}

TableBody.propTypes = {
  /**
   *  Array of items, each item represent row in the table. <br/>
   *  <b>id</b><span style="color: #FF4400">*</span> field is required for each item. <br/>
   *  The rows rely on <code>columns</code>,
   *  <code>prop</code> from <code><Table.Header/></code> component.
   */
  data: propTypes.arrayOf(propTypes.object).isRequired,
  /** The number of items. required when not self controlled */
  totalItems: propTypes.number,
  /** Table loading status */
  isLoading: propTypes.bool,
  /** Callback fire when need to fetch more data */
  loadMoreData: propTypes.func,
  /** The row height. <code>min-height: 48px</code>. */
  rowHeight: propTypes.string,
  /** If pass, render action menu at the end of each row. */
  rowActions: propTypes.arrayOf(propTypes.shape({
    /** The content to render inside the <Menu.Items/>. */
    content: propTypes.node,
    /** The callback when click the <Menu.Items/> */
    onClick: propTypes.func,
  })),
  /** Callback fire when row click. */
  onRowClick: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
}

export default memo(TableBody)
