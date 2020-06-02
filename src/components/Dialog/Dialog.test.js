import React from 'react'
import { render } from '@testing-library/react'
import Dialog from './Dialog'


describe('<Dialog />', () => {
  it('should render dialog and backdrop when isOpen', () => {
    const { queryByTestId } = render(<Dialog isOpen/>)
    expect(queryByTestId('dialog')).not.toEqual(null)
    expect(queryByTestId('backdrop')).not.toEqual(null)
  })

  it('should not render dialog and backdrop when not isOpen', () => {
    const { queryByTestId } = render(<Dialog />)
    expect(queryByTestId('dialog')).toEqual(null)
    expect(queryByTestId('backdrop')).toEqual(null)
  })

  it('should render children into dialog', () => {
    const { queryByTestId } = render(<Dialog isOpen><div data-testid={ 'test-child' }/></Dialog>)
    expect(queryByTestId('test-child')).not.toEqual(null)
  })

  it('should call onClose when clicked outside the dialog', () => {
    const onClose = jest.fn()
    const { queryByTestId } = render(<Dialog isOpen onClose={ onClose } />)
    queryByTestId('dialog').click()
    expect(onClose).not.toBeCalled()
    queryByTestId('backdrop').click()
    expect(onClose).toBeCalled()
  })

  it('should not call onClose when clicked outside the dialog when backdrop click is disabled ', () => {
    const onClose = jest.fn()
    const { queryByTestId } = render(<Dialog isOpen disableBackdropClick onClose={ onClose } />)
    queryByTestId('backdrop').click()
    expect(onClose).not.toBeCalled()
  })
})
