# Embeddable code playgrounds

For education, documentation, and fun.

Embed interactive code snippets directly into your product documentation, online course, or blog post.

```
  python
┌───────────────────────────────┐
│ msg = "Hello, World!"         │
│ print(msg)                    │
│                               │
│                               │
│ run ►                         │
└───────────────────────────────┘
  ✓ took 387 ms
┌───────────────────────────────┐
│ Hello, World!                 │
└───────────────────────────────┘
```

Highlights:

-   Supports dozens of playgrounds out of the box, plus custom sandboxes if you need them.
-   Available as a cloud service and as a self-hosted version.
-   Privacy-first. No tracking, the code is discarded immediately after processing.
-   Lightweight and easy to integrate.

Learn more at [**codapi.org**](https://codapi.org/)

## Installation

Install with `npm`:

```
npm install @antonz/codapi
```

Or use a CDN:

```html
<script src="https://unpkg.com/@antonz/codapi/dist/snippet.js"></script>
```

## Usage

Let's start with a simple use case. Suppose you have a static code snippet in Python:

```html
<pre>
msg = "Hello, World!"
print(msg)
</pre>
```

To make it interactive, add a `codapi-snippet` element right after the `pre` element:

```html
<pre>
msg = "Hello, World!"
print(msg)
</pre>

<codapi-snippet sandbox="python" editor="basic"></codapi-snippet>
```

Note two properties here:

-   `sandbox` defines the engine that will execute the code. Usually it's the name of the language or software, like `python`, `bash` or `sqlite`.
-   `editor="basic"` enables code snippet editing.

Finally, include a JavaScript file at the bottom of the page:

```html
<script src="https://unpkg.com/@antonz/codapi/dist/snippet.js"></script>
```

(CDNs like unpkg can sometimes be slow, so it's even better to host `snippet.js` yourself)

And that's it! The `codapi-snippet` will automatically attach itself to the `pre`, allowing you to run and edit the code:

```
┌───────────────────────────────┐
│ msg = "Hello, World!"         │
│ print(msg)                    │
│                               │
│                               │
└───────────────────────────────┘
┌─────┐
│ Run │  Edit
└─────┘
```

To disable editing, set `editor="off"` instead of `editor="basic"`. To change the engine, set the appropriate `sandbox` value.

### Attaching to a specific element

To attach `codapi-snippet` to the specific code element (instead of using the preceding element), set the `selector` property to its CSS selector:

```html
<div id="playground">
    <pre class="code">
msg = "Hello, World!"
print(msg)
    </pre>
</div>

<!-- more HTML -->

<codapi-snippet sandbox="python" editor="basic" selector="#playground .code">
</codapi-snippet>
```

### Code highlighting and rich editing

To use `codapi-snippet` with code editors like CodeMirror, do the following:

1. Initialize the editor as usual.
2. Point `codapi-snippet` to the editor using the `selector` property.
3. Set `editor="external"` so that `codapi-snippet` does not interfere with the editor functions.

```html
<div id="editor"></div>

<!-- ... -->

<codapi-snippet sandbox="python" editor="external" selector="#editor">
</codapi-snippet>
```

### Templates

Templates help to keep snippets concise by hiding parts of the code behind the scenes.

Let's say you have a Go program:

```go
package main

import "fmt"

func main() {
    msg := "Hello, World!"
    fmt.Println(msg)
}
```

And suppose you don't want to distract the reader with `package` and `import`. Instead, you'd rather focus on the `main` body. In this case, do the following:

1. Prepare a template file `main.go`:

```go
package main

import (
	"fmt"
)

func main() {
	##CODE##
}
```

2. Create a snippet with the actual code:

```html
<pre>
msg = "Hello, World!"
print(msg)
</pre>

<codapi-snippet sandbox="python" editor="basic" template="main.go">
</codapi-snippet>
```

3. Host the `main.go` next to the web page containing the `codapi-snippet`.

Now `codapi-snippet` will preprocess the code using the template before sending it to the server.

## License

Copyright 2023+ [Anton Zhiyanov](https://antonz.org/).

The software is available under the MIT License.

## Stay tuned

[**★ Subscribe**](https://antonz.org/subscribe/) to stay on top of new features.
