# Reiterate
Reiterate automatically generates end-to-end tests from localhost sessions, stores them as maintainable code you own.

## Proof of concept
1. A very simplistic session recorder living at JS init root that records paths, clicks, and keystroke input.
2. A transpiler that reforms that metadata into Playwright code.
3. An installer that installs this session recorder and Playwright config into your repo.

## Feasability questions
1. One challenge is auth statefulness:
- We're recording key actions, not every last detail of the session (e.g., we're not mocking HTTP requests or re-passing identical tokens upon initialization)
- Even if we were recreating everything identically, injected tokens often still have expiry dates, and we probably wouldn't be also mocking datetime, so sessions would eventually begin to fail
- I think the best solution for this is going to be some kind of fixture initialization where we say, hey, walk us through the auth state session-making first with credentials that work on local/staging, or open a security hole/magic token so that this would also work on prod, e.g. as a Vercel-style "just before DNS blue/green assignment" check via Checkly
- Although this isn't ideal, it more closely resembles how humans generate tests (using an auth fixture or beforeAllTests), which makes everything more maintable: e.g. in the scenario that the auth flow changes, we can prompt the user to re-record the auth flow, and then re-check the tests.

2. Another challenge is scaling the "record everything and generate stuff" model re: duplication and organization:
- Localhost usage can be really repetitive, which means we'll need to tackle deduplication of all sorts
- Are we just recording each session to a seperate file? In a well-maintained test codebase, we want to group together tests that are related.
- Two major ways "tests are related": all the tests against a certain page (export.spec.js), and all the tests against a certain feature or user journey (all-pages-on-menu-are-clickable-and-render.spec.js)

3. What tests are changes a little bit with this model, because some tests will actually immediately fail and need to be thrown away or edited before being useful:
- Devs can also test things in middle-of-building, so the test will actually be wrong (click button with text Submit, but then you change the title to Agree) and will fail by commit time - so how do we deal with that?
- It's sort of like we need a level inbetween test() and test.skip() that actually runs the test but only in an pending capacity where a failing test wouldn't fail the whole run until the developer changes it from test.pending() to test() 
- The other broken thing is the directory structure for tests is usually handrolled. Test runners will run anything with .spec in the title. If we had a pending folder, then developers could just drag tests they wanted to enable from pending to the main folder.

3. Maintainability of tests:
- Writing tests isn't always very hard, it's thinking things through clearly that counts both for writing now and maintaining later -- "test3456.spec.js failing on #div-id-8.click()" isn't very helpful compared to "export.spec.js failing on button['Submit'].click()".
- Playwright already has a pretty well-though-out locator model that addreses this built into its codegen
- We can use generative AI to label the tests' name, and add code comments based on the session recording metadata. For example, if a session recording shows a user logging in, then navigating to a user settings page, and updating an email address, the test name could be "UserLoginAndEmailUpdate" and the code comments could explain step-by-step what the test is doing.

4. Another basic challenge is what defines the beginning and end to a session?
- We could just record everything from the moment the user opens the app to the moment they close it, but that's not very useful for testing
- We could add a pre-commit hook, i.e. treat commits as the moment that session metadata gets processed into playwright code. But then you lose the ability to see the generates code and run the tests before committing, which feels valuable.
- Thinking that through then, it'll just need to do this periodically. Like upon 5 minutes of inactivity.
- Or, we could tie it to a CLI command, like npx reiterate generate, which would be the most flexible, but also the most annoying to remember to run. I can see a horrible scenario where you forget to run it for a month, and then when you run the command you get way too much to deal with.