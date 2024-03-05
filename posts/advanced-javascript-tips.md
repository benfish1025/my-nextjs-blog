---
title: 'JavaScript小技巧'
date: '2023-11-24'
image: advanced-javascript-tips.png
excerpt: 掌握更多的小技巧，可以提升日常开发的体验。
isFeatured: true
---

# 1. 使用数组解构操作符交换变量

面试中，交换两个变量的问题很像一个面试官跟你打开话题的小游戏。传统的方法是使用一个临时变量来完成交换：

```jsx
var tmp = a;
a = b;
b = tmp;

```

对于数字类型的变量，还有一些更为巧妙的方法，例如利用按位异或运算：

```jsx
a = a ^ b;
b = a ^ b;
a = a ^ b;
```

不过，ES6引入的数组解构赋值更优雅：

```jsx
[b, a] = [a, b];
```

这种方法首先创建一个包含变量 `a` 和 `b` 的数组，然后通过解构赋值，将 `b` 赋值给 `a`，反之亦然。虽然性能上可能略逊一筹——因为涉及到创建数组——但绝对可以在日常开发中放心使用。

# 2.校验器

在处理用户输入或外部数据的时候，校验器非常有用。最简单的验证器是接受一个字符串输入并返回一个布尔值的函数。例如，下面是两个验证数字的不同方面的函数：

```jsx
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isPositive(n) {
    return parseInt(n) > 0;
}

console.log(isNumeric("5")); // true
console.log(isNumeric("abc")); // false
console.log(isNumeric("5g")); // false
console.log(isNumeric("0")); // true
console.log(isPositive("0")); // false
console.log(isPositive("abc")); // false
console.log(isPositive("5g")); // false

```

函数式编程思想中的“组合（`combine`）”非常适合创建多重校验器。如果我们想要创建一个函数来验证给定的字符串既是数字又是正数，我们可以使用函数 `combine`，只有当所有通过的验证器都返回 `true` 时，才会返回 `true`：

```jsx
const combine = (...fns) => (val) => fns.reduce((memo, fn) => memo && fn(val), true);

const combined = combine(isNumeric, isPositive);
console.log(combined("5")); // true
console.log(combined("0")); // false
console.log(combined("5g")); // false

```

因为验证器的类型都是相同的 `(string) => boolean`，所以可以随意组合：

```jsx
function lessThan5(n) {
    return parseInt(n) < 5;
}

const evenMoreCombined = combine(combined, lessThan5);
console.log(evenMoreCombined("4")); // true
console.log(evenMoreCombined("6")); // false

```

通过这种方式，可以轻松地从简单的验证器中创建任意复杂的验证器。

# 3.使用<wbr/>来断句

使用 `<wbr/>` 标签可以在不影响语义的情况下插入断点，使长文本能够在适当的位置进行换行。这对于长URL或者没有自然断点的文本特别有用。例如：

```html
Lorem_ipsum_dolor_sit_<wbr/>amet_consectetur_

```

这样，浏览器会在适当的位置进行换行，而不会破坏单词的连续性。这种方法比较灵活，可以根据需要在任何地方插入断点。在多国语言使用同一套样式的时候这个方法尤其有用。

# 4.如何取消Promise（如何解决请求竞争）

在原生 Promise 中，虽然没有提供内置的取消功能，但我们可以通过手动处理来模拟取消行为。例如，在一个场景中，当用户在一个 `<select>` 元素中进行选择时，会从远程服务器获取一些数据。但是如果用户快于数据获取的速度进行多次选择，之前的请求可能会缓慢返回时污染我们的界面，这就是“请求竞争”问题。

解决方案1：比较选中的元素值
最简单的方法是在每次数据获取时，检查当前选中的元素值是否与请求数据时的元素值相同。如果不同，就丢弃这次获取到的数据。

```jsx
longFetch(value).then((res) => {
    if (selectElement.value === value) {
        // 显示结果
    }
});
```

但是，如果用户快速地选择了不同的选项，用户切换和结果到达的时间差很小，可能会导致多次请求并且页面会刷新，可能会出现闪烁的问题。

解决方案2：使用时间戳进行比较
一个更可靠的解决方案是在发起数据请求之前记录当前的时间戳，然后在获取数据后，检查时间戳是否与之前记录的时间戳相同。如果不同，则说明数据请求已经过期，应该丢弃结果。

```jsx
let lastFetchTimestamp;
// ...
const currentTime = new Date().getTime();
lastFetchTimestamp = currentTime;
longFetch(value).then((res) => {
    if (lastFetchTimestamp === currentTime) {
        // 显示结果
    }
});
```

通过这种方法，我们可以确保只有最后一次有效的数据请求结果会被处理，而之前的结果会被丢弃。

# 5.检查变量是否为 undefined

检查变量是否为 undefined 挺常见的，也有许多方法可以实现。但是需要认真考究以下各种方法的异同。

**比较好的方法：**

- 使用 `===` 运算符和 `void 0` 检查未定义：

```jsx
let variable;
console.log(variable === void 0); // true
```

这种方法几乎不会出错。但是缺点也很明显，不包含明确的 `undefined` 字样，不够直观。

- 使用 `typeof` 检查：

```jsx
let variable;
console.log(typeof variable == "undefined"); // true
```

这种方法看似很好，但是有个陷阱，变量没有被声明也会返回 `true`。

**其他人可能会这么写：**

- 检查变量是否为假值：

```jsx
if (variable) {
    // ...
}
```

这种方法通常用于检查变量是否为假值，但对于检查是否为 `undefined` 来说有一些不足，他混淆了很多值（如 `0`、`""`、`null`、`NaN` 等），有时候一些有意义值如 `0` 也会被挡住。

- 使用 `===` 运算符严格检查：

```jsx
let variable;
console.log(variable === undefined); // true
```

这种方法更严格了，排除了 `0`，但可能会受到全局作用域中 `undefined` 被修改的影响。

**比较奇葩最好不要这样写的方法：**

- 声明一个变量但不初始化它：

```jsx
let realUndefined;
let variable;
console.log(variable === realUndefined); // tru
```

这种方法有点奇怪，但是原理与 `void 0` 类似，这里的缺点是需要声明一个新的变量，我们肯定不会这样写。

# 6.顺序运行Promise

通常情况下，创建多个 Promise 的时候，它们会并行执行。但有时候我们可能更希望它们按照顺序执行，例如比如 一个Promise 依赖于另一个 Promise 的结果。

以下是如何严格按顺序运行 Promise 的方法：

```jsx
const makePromise = (e) => {
    // 返回一个 Promise
    // 异步操作
};

const list = [/* 结果 */];

list.reduce((prev, e) => {
    return prev.then(() => makePromise(e));
}, Promise.resolve()).then(() => {
    // 当所有 Promise 解析时执行的操作
});

```

这里的 `reduce` 方法会依次处理列表中的每个元素，并在前一个 Promise 完成后创建下一个 Promise。这样，它们就会严格按顺序运行。

要收集结果，可以稍作修改：

```jsx
list.reduce((prev, e) => {
    return prev.then((partial) => {
        return makePromise(e).then((result) => {
            // 在每次 Promise 解析时收集结果
            partial.push(result);
            return partial;
        });
    });
}, Promise.resolve([])).then((results) => {
    // 所有 Promise 都解析后执行的操作，results 是所有结果组成的数组
});

```
