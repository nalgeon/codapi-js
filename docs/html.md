# Code playgrounds in HTML or Markdown pages

Here is how to embed interactive code snippets into your HTML or Markdown pages:

-   [Interactive code block](#interactive-code-block)
-   [Attaching to an element](#attaching-to-a-specific-element)
-   [Syntax highlighting](#syntax-highlighting-and-rich-editing)
-   [Templates](#templates)
-   [Files](#files)
-   [Custom actions](#custom-actions)
-   [Code cells](#code-cells)
-   [Sandbox version](#sandbox-version)
-   [Self-hosted server](#self-hosted-server)

## Interactive code block

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
-   `editor` = `basic` enables code snippet editing.

Finally, include the default styles in the `head`:

```html
<link rel="stylesheet" href="https://unpkg.com/@antonz/codapi@0.12.2/dist/snippet.css"/>
```

And the JavaScript file at the bottom of the page:

```html
<script src="https://unpkg.com/@antonz/codapi@0.12.2/dist/snippet.js"></script>
```

(CDNs like unpkg can sometimes be slow, so it's even better to host both files yourself)

And that's it! The `codapi-snippet` will automatically attach itself to the `pre`, allowing you to run and edit the code:

```
┌───────────────────────────────┐
│ msg = "Hello, World!"         │
│ print(msg)                    │
│                               │
│                               │
└───────────────────────────────┘
  Run  Edit
```

To disable editing, set `editor` = `off` instead of `editor` = `basic`. To change the engine, set the appropriate `sandbox` value.

## Attaching to a specific element

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

## Syntax highlighting and rich editing

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

## Templates

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
fmt.Println(msg)
</pre>

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

<pre>
greet("World")
</pre>

<codapi-snippet sandbox="python" template="#main.py"></codapi-snippet>
```

The leading `#` in `template` and `type` = `text/plain` in `script` are required.

## Files

For larger programs, you can pass multiple files along with the main one. Suppose you have a Python program with an `npc` module that you want to call from the main module. In this case, do the following:

1. Prepare a file `npc.py`:

```python
def greet(name):
    print(f"Hello, {name}")
```

2. Create a snippet with the actual code:

```html
<pre>
import npc
npc.greet("Alice")
</pre>

<codapi-snippet sandbox="python" files="npc.py"></codapi-snippet>
```

3. Host the `npc.py` next to the web page containing the `codapi-snippet`.

Now `codapi-snippet` will send `npc.py` to the server along with the main file.

To pass mutiple files, separate them with space:

```html
<codapi-snippet sandbox="python" files="file1.py file2.py"></codapi-snippet>
```

You can also define files using in-page `script`s:

```html
<script id="npc.py" type="text/plain">
def greet(name):
    print(f"Hello, {name}")
</script>

<pre>
import npc
npc.greet("Alice")
</pre>

<codapi-snippet sandbox="python" files="#npc.py"></codapi-snippet>
```

## Custom actions

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
<codapi-snippet sandbox="python" actions="Share:@share"> </codapi-snippet>
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

## Code cells

_Code cells_ are snippets that depend on each other. To specify dependencies, use a `depends-on` attribute pointing to the other snippet ID. This results in Jupyter notebook-like behavior and eliminates the need for code duplication.

For example, here are the thee snippets (`create`, `insert` and `select`), where each depends on the previous one:

➀ Create:

    ```sql
    create table employees (
      id integer primary key,
      name varchar(50),
      department varchar(10),
      salary integer
    );
    ```

    <codapi-snippet id="create.sql" sandbox="postgres" editor="basic">
    </codapi-snippet>

➁ Insert:

    ```sql
    insert into employees
    (id, name, department, salary)
    values
    (11, 'Diane', 'hr', 70),
    (12, 'Bob', 'hr', 78),
    (21, 'Emma', 'it', 84);
    ```

    <codapi-snippet id="insert.sql" sandbox="postgres" editor="basic" depends-on="create.sql">
    </codapi-snippet>

➂ Select:

    ```sql
    select * from employees;
    ```

    <codapi-snippet id="select.sql" sandbox="postgres" editor="basic" depends-on="insert.sql">
    </codapi-snippet>


This is how the snippets work:

-   When you run the `insert` snippet, it automatically creates the table before inserting the data.
-   When you run the `select` snippet, it automatically creates the table and inserts the records before selecting the data.

The dependencies do not have to be linear, they can form any (acyclic) graph. For example:

```
create ← insert-1 ← select
       ↖ insert-2 ↙
```

## Sandbox version

Some sandboxes support multiple versions (e.g. the latest released version and the next beta or release candidate version). By default, the widget uses the `latest` version, but you can change this using the `version` attribute:

```html
<codapi-snippet sandbox="sqlite:dev" editor="basic">
</codapi-snippet>
```

The appropriate version must be enabled on the server.

## Self-hosted server

If you are using a self-hosted [codapi server](https://github.com/nalgeon/codapi), point the widget to it using the `url` attribute:

```html
<codapi-snippet sandbox="python" url="http://localhost:1313/v1">
</codapi-snippet>
```

Specify the protocol (`http`/`https`) and hostname or IP like this:

```
http://localhost:1313/v1
http://192.168.1.42:1313/v1
https://codapi.example.org/v1
```

Note that the `/v1` part stays the same — it's the path the Codapi server uses for API requests.
