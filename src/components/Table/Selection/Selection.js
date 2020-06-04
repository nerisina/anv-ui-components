import React, { useContext, useEffect, useRef, useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { Portal, Animations, Checkbox, IconButton, Menu } from '../../../index'
import TableContext from '../TableContext'
import { ReactComponent as OptionsIcon } from '../../../assets/svg/Options.svg'
import styles from './Selection.module.scss'

const Selection = ({
  onChange,
  value,
  bulkActions,
  className
}) => {
  const { state, setSelectionActivity, setSelection, toggleSelectAll } = useContext(TableContext)
  const { totalItems } = state
  const { items, excludeMode } = state.selection

  const moreActionsRef = useRef()
  const [anchorElement, setAnchorElement] = useState(null)

  const handleMenuClose = () => setAnchorElement(null)
  const handleButtonClick = () => (anchorElement
    ? setAnchorElement(null)
    : setAnchorElement(moreActionsRef.current))

  useEffect(() => {
    onChange({ items, excludeMode })
  }, [onChange, items, excludeMode])

  useEffect(() => {
    setSelectionActivity(true)
  }, [setSelectionActivity])

  useEffect(() => {
    value && setSelection(value)
  }, [value, setSelection])

  const renderMoreActions = moreActions => {
    if(!moreActions.length) {
      return
    }
    return (
      <>
        <IconButton
          onClick={ handleButtonClick }
          variant={ 'ghost' }
          ref={ moreActionsRef }
          className={ classNames(styles.actionButton, styles.moreActionsButton) }
        >
          <OptionsIcon/>
        </IconButton>
        <Menu
          isOpen={ !!anchorElement }
          onClose={ handleMenuClose }
          anchorElement={ anchorElement }
          preferOpenDirection={ 'up-start' }
        >
          { moreActions.map(({ icon, label }) => {
            return (
              <Menu.Item key={ label } leadingComponent={ icon }>
                { label }
              </Menu.Item>
            )
          } ) }
        </Menu>
      </>
    )
  }

  const renderActions = () => {
    const mainActions = bulkActions.slice(0,2)
    const moreActions = bulkActions.slice(2)
    return (
      <div className={ styles.actionsContainer }>
        {
          mainActions.map(({ icon, onClick }, index) => (
            <IconButton
              key={ index }
              variant={ 'ghost' }
              onClick={ () => onClick({ items, excludeMode }) }
              className={ styles.actionButton }
            >
              { icon }
            </IconButton>
          ))
        }
        { renderMoreActions(moreActions) }
      </div>
    )
  }

  const renderBar = excludeMode || !!items.length
  const selectedCount = renderBar && (excludeMode ? totalItems - items.length : items.length)

  const classes = classNames(
    styles.selectionBar,
    className,
  )

  return (
    <Animations.Scale isOpen={ renderBar }>
      <Portal containerId={ 'table-selection-bar' }>
        <div className={ classes }>
          <Checkbox
            checked={ excludeMode && !items.length }
            indeterminate={ !!items.length }
            onChange={ toggleSelectAll }
          />
          <div className={ styles.countContainer }>
            <span className={ styles.counter }>{ selectedCount }</span>
            <span className={ styles.counterLabel }>Items Selected</span>
          </div>
          { renderActions() }
        </div>
      </Portal>
    </Animations.Scale>
  )
}

Selection.defaultProps = {
  onChange: () => {},
}

Selection.propTypes = {
  /** Callback fire when selection changed. */
  onChange: propTypes.func,
  /** The value from the on change. */
  value: propTypes.arrayOf(
    propTypes.shape({
      items: propTypes.array,
      excludeMode: propTypes.bool
    })
  ),
  /** Table bulk actions. <br />
   *  <code>icon</code>      - icon for the action. <br />
   *  <code>label</code>     - label for the action icon.<br />
   *  <code>onClick</code>   - callback fire when action click. <br />
   **/
  bulkActions: propTypes.arrayOf(
    propTypes.shape({
      icon: propTypes.node,
      label: propTypes.string,
      onClick: propTypes.func
    })
  ).isRequired,
  /** Selection bar css customization. */
  className: propTypes.string,
}

export default Selection
