# In-browser playgrounds

Most playgrounds (like Go or PostgreSQL) run code on the Codapi server.

But there are some playgrounds that work completely in the browser, no Codapi server required.

Note that WASI-based playgrounds (`engine` = `wasi` in the examples below) require two additional scripts besides the usual `snippet.js`:

```html
<script src="https://unpkg.com/@antonz/runno@0.6.1/dist/runno.js"></script>
<script src="https://unpkg.com/@antonz/codapi@0.12.2/dist/engine/wasi.js"></script>
<script src="https://unpkg.com/@antonz/codapi@0.12.2/dist/snippet.js"></script>
```

## JavaScript

Executes the code using the [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction).

```html
<pre>
const msg = "Hello, World!"
console.log(msg)
</pre>

<codapi-snippet engine="browser" sandbox="javascript" editor="basic"></codapi-snippet>
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

<codapi-snippet engine="browser" sandbox="fetch" editor="basic"></codapi-snippet>
```

[Try it](https://codapi.org/fetch/)

## Lua

Executes the code using the [Lua WASI runtime](https://github.com/nalgeon/lua-wasi) (330 KB).

```html
<pre>
local msg = "Hello, World!"
print(msg)
</pre>

<codapi-snippet engine="wasi" sandbox="lua" editor="basic"></codapi-snippet>
```

[Try it](https://codapi.org/lua-wasi/)

## PHP

Executes the code using the [PHP WASI runtime](https://github.com/nalgeon/php-wasi) (13.2 MB).

```html
<pre>
&lt;?php
$msg = "Hello, World!";
echo $msg;
?&gt;
</pre>

<codapi-snippet engine="wasi" sandbox="php" editor="basic"></codapi-snippet>
```

[Try it](https://codapi.org/php-wasi/)

## Python

Executes the code using the [Python WASI runtime](https://github.com/nalgeon/python-wasi) (26.3 MB).

```html
<pre>
msg = "Hello, World!"
print(msg)
</pre>

<codapi-snippet engine="wasi" sandbox="python" editor="basic"></codapi-snippet>
```

[Try it](https://codapi.org/python-wasi/)

## Ruby

Executes the code using the [Ruby WASI runtime](https://github.com/nalgeon/ruby-wasi) (24.5 MB).

```html
<pre>
msg = "Hello, World!"
puts msg
</pre>

<codapi-snippet engine="wasi" sandbox="ruby" editor="basic"></codapi-snippet>
```

[Try it](https://codapi.org/ruby-wasi/)

## SQLite

Executes the code using the [SQLite WASI runtime](https://github.com/nalgeon/sqlite-wasi) (2.1 MB).

```html
<pre>
select "Hello, World!" as message;
</pre>

<codapi-snippet engine="wasi" sandbox="sqlite" editor="basic"></codapi-snippet>
```

[Try it](https://codapi.org/sqlite-wasi/)
