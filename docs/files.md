# Files

For larger programs, you can pass multiple files along with the main one.

-   [External files](#external-files)
-   [DOM files](#dom-files)
-   [Renaming files](#renaming-files)

## External files

Suppose you have a Python program with an `npc` module that you want to call from the main module. In this case, do the following:

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

## DOM files

You can define files using in-page `script`s:

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

The use of `id` and `#` is mandatory; you can't select files based on CSS classes or other attributes.

You can use `pre` instead of `script`:

```html
<pre id="npc.py"><code>
def greet(name):
    print(f"Hello, {name}")
</code></pre>

<pre>
import npc
npc.greet("Alice")
</pre>

<codapi-snippet sandbox="python" files="#npc.py"></codapi-snippet>
```

Or even another `codapi-snippet`:

```html
<pre>
def greet(name):
    print(f"Hello, {name}")
</pre>

<codapi-snippet id="npc.py" sandbox="python"></codapi-snippet>

<pre>
import npc
npc.greet("Alice")
</pre>

<codapi-snippet sandbox="python" files="#npc.py"></codapi-snippet>
```

## Renaming files

You can set a different name for a file using `:`:

```html
<pre>
import greeter
greeter.greet("Alice")
</pre>

<codapi-snippet sandbox="python" files="npc.py:greeter.py"></codapi-snippet>
```

In this example, the local `npc.py` is renamed to `greeter.py` in the sandbox.

This can be useful if the sandbox expects a fixed filename (e.g., `config.json`), but your code snippets use different local files with the same semantics (e.g., `config-1.json`, `config-2.json`, ...)
