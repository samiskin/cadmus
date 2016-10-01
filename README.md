# Cadmus

Cadmus allows for lightweight runtime function return specification for JavaScript applications.

```javascript

@returns(t.shape({
  name: t.string,
  grades: t.arrayOf(t.shape({
    subject: t.string,
    grade: t.number,
  })),
  gender: t.oneOf(['M', 'F']).optional,
}))
getUser() {
  ...
  
  return {
    name: 'John',
    gender: 'M',
    grades: [
      grade: 5, 
    ], // Error thrown on getUser(), as subject is missing
  };
}
```
