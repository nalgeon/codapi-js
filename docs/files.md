# Files

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
