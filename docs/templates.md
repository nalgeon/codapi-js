# Templates

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
<pre><code>
msg = "Hello, World!"
fmt.Println(msg)
</code></pre>

<codapi-snippet sandbox="go" editor="basic" template="main.go">
</codapi-snippet>
```

3. Host the `main.go` next to the web page containing the `codapi-snippet`.

Now `codapi-snippet` will preprocess the code using the template before sending it to the server.

Alternatively, you can use an in-page `script` tag with a code template and pass its `id` as a `template`:

```html
<script id="main.py" type="text/plain">
def greet(name):
    print(f"Hello, {name}!")

##CODE##
</script>

<pre><code>
greet("World")
</code></pre>

<codapi-snippet sandbox="python" template="#main.py"></codapi-snippet>
```

The leading `#` in `template` and `type` = `text/plain` in `script` are required.
