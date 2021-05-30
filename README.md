# Chess App

## _This app is a work in progress. Current functionality is listed below_

### App

- [x] Backend express API setup with GET/POST
- [x] Add Free Mode
- [x] Add Test Mode

---

- [ ] Add List Mode
- [ ] Automated script to setup db on other machines
- [ ] Theme switcher

### Free Mode

- [x] Movement rules + drag and drop
- [x] Capturing
- [x] Castling
- [x] Row/column added to notation when necessary (eg. 'Nbc5')
- [x] Message board
- [x] Record lines in state
- [x] Add ability to store reason to moves
- [x] Add lines to db from frontend
- [x] Store player color in line objects

---

- [ ] Ensure no duplicate lines exist when making POST req (flatten & `===`)
- [ ] Message board confirmation/ error message when making POST req
- [ ] Reset gameClient & board on successful POST request

---

![result](./assets/free-mode-demo.gif)

### Test Mode

- [x] Determine random line & random starting point for test scenarios
- [x] Execute automatic moves with time delay up to starting point
- [x] Only accept next move in line after automatic moves have finished
- [x] Add ability to select another random line on button press

---

- [ ] Alternate between player & automatic moves until line is complete
- [ ] Switch to another random line when current line is complete
- [ ] Utilize message board

---

## ![test](./assets/test-mode-demo.gif)

### List Mode

- [ ] List all lines
- [ ] Option to delete line
- [ ] Option to play line (automatic moves)
- [ ] Option to select/deselect lines for test mode (will need to add a `selected` field to db table)
