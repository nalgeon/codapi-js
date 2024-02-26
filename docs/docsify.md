# Code playgrounds in Docsify

Here is how to embed interactive code snippets into your Docsify pages:

-   [Interactive code block](#interactive-code-block)
-   [Using templates](#using-templates)
-   [Summary](#summary)

## Interactive code block

Let's start with a simple use case. Suppose you have a static code snippet in Python, and want to make it interactive.

First, add a code snippet in your `.md` file as usual:

    ```python
    def greet(name):
        print(f"Hello, {name}!")

    greet("World")
    ```

Then add a Codapi widget right below it:

```html
<codapi-snippet sandbox="python" editor="basic">
</codapi-snippet>
```

Note two properties here:

-   `sandbox` defines the engine that will execute the code. Usually it's the name of the language or software, like `python`, `bash` or `sqlite`.
-   `editor` = `basic` enables code snippet editing.

Finally, add references to the Codapi script and styling in the `index.html` file:

```html
<head>
    <!-- ... -->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css" />
    <link rel="stylesheet" href="https://unpkg.com/@antonz/codapi@0.16.0/dist/snippet.css" />
</head>

<body>
    <!-- ... -->
    <!-- Docsify v4 -->
    <script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
    <script defer src="https://unpkg.com/@antonz/codapi@0.16.0/dist/snippet.js"></script>
</body>
```

And that's it! The `codapi-snippet` automatically attaches itself to the preceding code block, allowing you to run and edit the code. It looks like this:

```
┌───────────────────────────────┐
│ def greet(name):              │
│   print(f"Hello, {name}!")    │
│                               │
│ greet("World")                │
└───────────────────────────────┘
  Run  Edit
```

## Using templates

Suppose you are writing an article about ordering syntax in SQL. To keep the code snippets from getting too verbose, you'll probably want to show only the SELECT queries, not the CREATE TABLE and INSERTs that prepare the data.

That's where the templates come in handy. They help to keep snippets concise by hiding parts of the code behind the scenes.

To create a template with a sample database, add the following `script` tag to your `.md` file:

```html
<script id="employees.sql" type="text/plain">
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

To create an interactive SQL snippet, first add a code snippet as usual:

    ```sql
    select id, name
    from employees
    order by name desc
    limit 5;
    ```

Then add a Codapi widget right below it (you can set the `sandbox` to `postgres` or `mysql` or `sqlite`, depending on the DBMS you are describing):

```html
<codapi-snippet sandbox="postgres" editor="basic" template="#employees.sql">
</codapi-snippet>
```

Note the `template` attribute here, which refers to the `main.sql` script we added earlier.

And here comes your interactive SQL snippet!

## Summary

Let's review the steps for creating interactive code snippets in Docsify:

1. Add static code snippets as usual, using a fenced Markdown block.
2. For each static code snippet, add a `codapi-snippet` widget directly below it.
3. Add the Codapi script and styling to `index.html`.

And that's it!
