# Code links

Many platforms like Dev.to, Medium or Substack do not support embedding JavaScript widgets. The same goes for newsletters. However, it's possible for a reader to edit and execute code on these platforms — using Codapi _code links_.

A code link is a regular HTML link that points to a special lightweight Codapi page containing editable and executable code.

Suppose you have a static Python code snippet in your article, and you want to make it interactive.

First, add a code snippet as usual:

```python
def greet(name):
    print(f"Hello, {name}!")

greet("World")
```

Then copy the same code to the Codapi [Embed](https://codapi.org/embed/add/) page (choose the appropriate sandbox first) and click _Share_. You'll get a shareable link to your specific code snippet.

Finally, paste this link into your article. Name it _Run code_ or something like that:

[Run code](https://codapi.org/embed/?sandbox=python&code=def%2520greet%28name%29%253A%250A%2520%2520%2520%2520print%28f%2522Hello%252C%2520%257Bname%257D%21%2522%29%250A%250Agreet%28%2522World%2522%29)

And that's it! When the reader follows the link, they'll be able to run and edit the code.

You can add as many code links per article as you like.
