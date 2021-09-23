# Summary

* **Scrum master**: @QuentinRa
* **Product Owner**: @YouennEsnault
* **Dev. team**: @DataSaiyentist @YouennEsnault @QuentinRa @Delta93500 @Vivano @AthonSc

The duration of a sprint is **2 weeks**.

<hr>

### Definition of "done"

A story is done, when

* we are passing the **tests**
  * for non-JavaScript files, use UI testing
  * for JavaScript files, use [mocha](https://mochajs.org/)
* we wrote the **documentation** (something like this is enough, you can use [JSDoc](https://jsdoc.app/about-getting-started.html) syntax for more complex comments)

```js
/**
 * Take a number n and return its prime factorization
**/
function primeFactorization(n) {}
// if you need to write more about the parameter
/**
 * Take a number "n" and return the prime Factorization
 * @param n greater than 0
 **/
function primeFactorization(n) {}
// if you need to write more about the returned result
/**
 * Take a number n and return its prime factorization
 * @return an array of arrays. Each nested array is made of the prime number and the exponent
 * Ex: 10 = [[2, 1], [5, 1]] as 10 = 2 * 5
 **/
```

<hr>

### Process

1. Write the tests (ex: at least 5-10 tests of your function, test successes, and failures)
2. Write the documentation
3. Write the code

If you need to modify the code, change the tests and the documentation first.

> **Our priorities**: working (=tested) > code clean (=documentation) > fast (=optimization)