# Custom actions

You can add buttons to the toolbar:

```html
<codapi-snippet sandbox="python" actions="Test:test Benchmark:bench">
</codapi-snippet>
```

Here we add two buttons:

-   "Test" executes the `test` command in the `python` sandbox.
-   "Benchmark" executes the `bench` command in the `python` sandbox.

```
┌───────────────────────────────┐
│ msg = "Hello, World!"         │
│ print(msg)                    │
│                               │
│                               │
└───────────────────────────────┘
  Run  Test  Benchmark
```

To make a button trigger an event instead of executing a command, add `@` before the action name:

```html
<codapi-snippet sandbox="python" actions="Share:@share">
</codapi-snippet>
```

Here we add a "Share" button, which, when clicked, triggers the `share` event on the `codapi-snippet` element. We can then listen to this event and do something with the code:

```js
const snip = document.querySelector("codapi-snippet");
snip.addEventListener("share", (e) => {
    const code = e.target.code;
    // do something with the code
});
```

If you want the button title to contain spaces, replace them with underscores:

```html
<codapi-snippet sandbox="python" actions="Run_Tests:test Share_Code:@share">
</codapi-snippet>
```
