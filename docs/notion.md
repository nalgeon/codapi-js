# Code playgrounds in Notion

Notion does not support custom JavaScript widgets. However, it's still possible for a reader to edit and execute code snippets — using _code links_ or _embeds_. Let's look at both methods.

## Code links

A code link is a regular HTML link that points to a special lightweight Codapi page containing editable and executable code. Here is how to add code links to your Notion pages:

First, add a _Code_ block with a code snippet as usual:

```python
def greet(name):
  print(f"Hello, {name}!")

greet("World")
```

Then copy the same code to the Codapi [Embed](https://codapi.org/embed/add/) page (choose the appropriate playground first) and click _Share_. You'll get a shareable link to your specific code snippet.

Finally, paste this link into your page below the code snippet. Name it _Run code_ or something like that:

[Run code](https://codapi.org/embed/?sandbox=python&code=def%2520greet%28name%29%253A%250A%2520%2520%2520%2520print%28f%2522Hello%252C%2520%257Bname%257D%21%2522%29%250A%250Agreet%28%2522World%2522%29)

And that's it! When the reader follows the link, they'll be able to run and edit the code.

You can add as many code links per page as you like.

## Embeds

Embeds are Notion's way of including external website content into Notion pages. Here is how to embed Codapi playgrounds using embeds:

First, write some code using the Codapi [Embed](https://codapi.org/embed/add/) page (choose the appropriate playground first) and click _Share_. You'll get a shareable link to your specific code snippet.

Then add an _Embed_ block in Notion and paste the copied link into it. Notion will render the playground with your code and a _Run_ button like this:

```
┌───────────────────────────────┐
│ def greet(name):              │
│   print(f"Hello, {name}!")    │
│                               │
│ greet("World")                │
└───────────────────────────────┘
  Run
```

Now you can edit and execute the code directly from the Notion page!
