# Wordle

A re-implementation of the [Wordle game](https://www.nytimes.com/games/wordle/index.html) in NodeJS,
with a focus on the backend logic

## Development steps (preliminary list)

- [x] Simple app with a GET endpoint that returns a boolean for a trial word (solution stored in code/file)
- [x] Simple validation (word must have 5 letters)
- [x] Boolean response for each letter
- [x] Detailed response for each letter (incl. "yellow" phases)
- [x] Storage of result in a database
- [x] POST/PUT endpoint to modify the word
- [ ] DB migration
- [ ] Validation of the word (e.g. by accessing the public API of an online dictionary)
- [ ] Interpretation of IP
- [ ] Implementation of the "max tries" by user
- [ ] Frontend
