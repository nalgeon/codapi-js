# Code playgrounds in WordPress

Here is how to embed interactive code snippets into your WordPress articles or blog posts:

-   [Simple code block](#interactive-code-block)
-   [Syntax highlighting](#syntax-highlighting)
-   [Using templates](#using-templates)

## Interactive code block

Let's start with a simple use case. Suppose you have a static code snippet in Python, and want to make it interactive.

First, add a _Code_ block with a code snippet as usual:

```
def greet(name):
  print(f"Hello, {name}!")

greet("World")
```

Immediately below it, add a _Custom HTML_ block with the following content:

```html
<codapi-snippet sandbox="python" editor="basic"></codapi-snippet>
```

Note two properties here:

-   `sandbox` defines the engine that will execute the code. Usually it's the name of the language or software, like `python`, `bash` or `sqlite`.
-   `editor` = `basic` enables code snippet editing.

Finally, at the bottom of the page, add another _Custom HTML_ block with Codapi script and styling (you will only need one such block no matter how many snippets you put on a page):

```html
<link rel="stylesheet" href="https://unpkg.com/@antonz/codapi@0.13.0/dist/snippet.css"/>
<script src="https://unpkg.com/@antonz/codapi@0.13.0/dist/snippet.js"></script>
```

And that's it! The `codapi-snippet` automatically attaches itself to the preceding _Code_ block, allowing you to run and edit the code. It looks like this:

```
┌───────────────────────────────┐
│ def greet(name):              │
│   print(f"Hello, {name}!")    │
│                               │
│ greet("World")                │
└───────────────────────────────┘
  Run  Edit
```

## Syntax highlighting

There are a lot of syntax highlighting plugins for WordPress, but the most popular is probably [SyntaxHighlighter](https://wordpress.com/plugins/syntaxhighlighter/), so let's use it.

To create an interactive code block with syntax highlighting, first add a _SyntaxHighlighter_ block with a code snippet as usual:

```python
def greet(name):
  print(f"Hello, {name}!")

greet("World")
```

Immediately below it, add a _Custom HTML_ block with the following content (note that the code here is a bit different than earlier):

```html
<codapi-snippet
    sandbox="python"
    editor="basic"
    selector="@prev .code"
    init-delay="1000"
>
</codapi-snippet>
```

Finally, at the bottom of the page, add another _Custom HTML_ block with Codapi script and styling (do this only if you haven't already added it):

```html
<link rel="stylesheet" href="https://unpkg.com/@antonz/codapi@0.13.0/dist/snippet.css"/>
<script src="https://unpkg.com/@antonz/codapi@0.13.0/dist/snippet.js"></script>
```

And here comes your interactive code snippet with syntax highlighting!

## Using templates

Suppose you are writing an article about ordering syntax in SQL. To keep the code snippets from getting too verbose, you'll probably want to show only the SELECT queries, not the CREATE TABLE and INSERTs that prepare the data.

That's where the templates come in handy. They help to keep snippets concise by hiding parts of the code behind the scenes.

To create a template with a sample database, add a _Custom HTML_ block with the following content:

```html
<script id="main.sql" type="text/plain">
create table employees (
    id integer primary key,
    name varchar(50),
    city varchar(50),
    department varchar(50),
    salary integer
);

insert into employees
(id, name, city, department, salary)
values
(11, 'Diane', 'London', 'hr', 70),
(12, 'Bob', 'London', 'hr', 78),
(21, 'Emma', 'London', 'it', 84),
(22, 'Grace', 'Berlin', 'it', 90),
(23, 'Henry', 'London', 'it', 104),
(24, 'Irene', 'Berlin', 'it', 104),
(25, 'Frank', 'Berlin', 'it', 120),
(31, 'Cindy', 'Berlin', 'sales', 96),
(32, 'Dave', 'London', 'sales', 96),
(33, 'Alice', 'Berlin', 'sales', 100);

##CODE##
</script>
```

Note the `##CODE##` at the bottom of the template — it's a placeholder for the SELECT queries you'll run in the following code snippets.

To create an interactive SQL snippet, first add a _SyntaxHighlighter_ block with an SQL query as usual:

```sql
select id, name
from employees
order by name desc
limit 5;
```

Immediately below it, add a _Custom HTML_ block with the following content (you can set the `sandbox` to `postgres` or `mysql` or `sqlite`, depending on the DBMS you are describing):

```html
<codapi-snippet
    sandbox="postgres"
    editor="basic"
    selector="@prev .code"
    init-delay="1000"
    template="#main.sql"
>
</codapi-snippet>
```

Note the `template` attribute here, which refers to the `main.sql` we added earlier.

Finally, at the bottom of the page, add another _Custom HTML_ block with Codapi script and styling (do this only if you haven't already added it):

```html
<link rel="stylesheet" href="https://unpkg.com/@antonz/codapi@0.13.0/dist/snippet.css"/>
<script src="https://unpkg.com/@antonz/codapi@0.13.0/dist/snippet.js"></script>
```

And here comes your interactive SQL snippet!

## Summary

Let's review the steps for creating interactive code snippets in a WordPress article:

1. Add static code snippets as usual, using a _Code_ block or a _SyntaxHighlighter_ block.
2. For each static code snippet, add a `codapi-snippet` widget using a _Custom HTML_ block.
3. At the bottom of the page, add another _Custom HTML_ block with Codapi script and styling (do this only once).

And that's it!
