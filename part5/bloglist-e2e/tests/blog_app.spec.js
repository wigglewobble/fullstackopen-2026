const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post(
      'http://localhost:3003/api/users',
      {
        data: {
          name: 'Boss',
          username: 'boss',
          password: 'secret'
        }
      }
    )

    await page.goto('http://localhost:5173')
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByText('login').click()

      await page.locator('input[type="text"]').fill('boss')
      await page.locator('input[type="password"]').fill('secret')

      await page.getByRole('button', {
        name: 'login'
      }).click()

      await expect(
        page.getByRole('button', {
          name: 'logout'
        })
      ).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByText('login').click()

      await page.locator('input[type="text"]').fill('boss')
      await page.locator('input[type="password"]').fill('wrong')

      await page.getByRole('button', {
        name: 'login'
      }).click()

      await expect(
        page.getByText('wrong username or password')
      ).toBeVisible()
    })
  })

  describe('When logged in', () => {

    beforeEach(async ({ page }) => {
      await page.getByText('login').click()

      await page.locator('input[type="text"]').fill('boss')
      await page.locator('input[type="password"]').fill('secret')

      await page.getByRole('button', {
        name: 'login'
      }).click()

      await expect(
        page.getByRole('button', {
          name: 'logout'
        })
      ).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {

      await page.getByText('create new').click()

      await page.locator('input').nth(0)
        .fill('Playwright conquers Full Stack Open')

      await page.locator('input').nth(1)
        .fill('Boss')

      await page.locator('input').nth(2)
        .fill('https://playwright.dev')

      await page.getByRole('button', {
        name: 'create'
      }).click()

      await expect(
        page.getByText('Playwright conquers Full Stack Open')
      ).toBeVisible()
    })

    describe('and a blog exists', () => {

      beforeEach(async ({ page }) => {

        await page.getByText('create new').click()

        await page.locator('input').nth(0)
          .fill('Like Test')

        await page.locator('input').nth(1)
          .fill('Boss')

        await page.locator('input').nth(2)
          .fill('https://test.com')

        await page.getByRole('button', {
          name: 'create'
        }).click()

        await page.getByText('Like Test').click()
      })
      
      test('a blog can be liked', async ({ page }) => {

        await page.getByRole('button', {
          name: 'like'
        }).click()
        await page.waitForTimeout(500)
        await expect(
          page.locator('body')
        ).toContainText('likes 1')
      })
      test('creator can delete a blog', async ({ page }) => {

        await page.getByRole('button', {
          name: 'remove'
        }).click()

        await expect(
          page.getByText('Like Test')
        ).toHaveCount(0)
      })
    })
  })
})