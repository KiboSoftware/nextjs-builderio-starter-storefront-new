/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from './LoginDialog.stories' // import all stories from the stories file

const { Common } = composeStories(stories)

const onRegisterNowMock = jest.fn()
const LoginContentMock = () => <input data-testid="kibo-login-cotent" />
jest.mock('../LoginContent/LoginContent', () => LoginContentMock)

describe('[components] (LoginDialog)', () => {
  const setup = (args = Common.args) =>
    render(<Common {...args} onRegisterNow={onRegisterNowMock} />)

  it('should render component', async () => {
    setup()
    const title = screen.getByTestId('login-header')
    const closeIcon = screen.getByRole('button', { name: 'close' })
    const loginContent = screen.getByTestId('kibo-login-cotent')

    expect(title).toBeVisible()
    expect(closeIcon).toBeVisible()
    expect(loginContent).toBeVisible()

    const registerNowLink = screen.getByRole('button', { name: 'common:register-now' })
    expect(registerNowLink).toBeVisible()

    await act(async () => {
      userEvent.click(registerNowLink)
    })
    expect(onRegisterNowMock).toBeCalled()
  })
})