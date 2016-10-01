# Cadmus

Cadmus is a lightweight library which allows specifications on function return values which are checked at runtime.

```javascript
var user = t.shape({
  name: t.string,
  grades: t.arrayOf(t.shape({
    subject: t.string,
    grade: t.number,
  })),
  gender: t.oneOf(['M', 'F']).optional,
});

@returns(user)
getUser() {
  return {
    name: 'John',
    gender: 'M',
    grades: [
      grade: 5, 
    ],
  };
}

getUser() // Error thrown, since grades.subject is missing
```
