# Browser-only playgrounds

Most playgrounds (like Python, PostgreSQL, or Bash) run code on the Codapi server.

But there are some playgrounds that work completely in the browser, no Codapi server required.

## JavaScript

Executes the code using the [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction).

```html
<pre>
const msg = "Hello, World!"
console.log(msg)
</pre>

<codapi-snippet sandbox="javascript" editor="basic"></codapi-snippet>
```

[Try it](https://codapi.org/javascript/)

## Fetch

Executes the code using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

```html
<pre>
POST https://httpbingo.org/dump/request
content-type: application/json

{
    "message": "hello"
}
</pre>

<codapi-snippet sandbox="fetch" editor="basic"></codapi-snippet>
```

[Try it](https://codapi.org/fetch/)
