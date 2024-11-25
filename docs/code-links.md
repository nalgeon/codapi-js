# Code links

Many platforms like Dev.to, Medium or Substack do not support embedding JavaScript widgets. The same goes for newsletters. However, it's possible for a reader to edit and execute code on these platforms — using Codapi _code links_.

A code link is a regular HTML link that points to a special lightweight Codapi page containing editable and executable code. Here is how to add code links to your articles:

-   [Adding a code link](#adding-a-code-link)
-   [Hiding parts of the code](#hiding-parts-of-the-code)
-   [Summary](#summary)

## Adding a code link

Suppose you have a static Python code snippet in your article, and you want to make it interactive.

First, add a code snippet as usual:

```python
def greet(name):
    print(f"Hello, {name}!")

greet("World")
```

Then copy the same code to the Codapi [Embed](https://codapi.org/embed/add/) page (choose the appropriate playground first) and click _Share_. You'll get a shareable link to your specific code snippet.

Finally, paste this link into your article. Name it _Run code_ or something like that:

[Run code](https://codapi.org/embed/?sandbox=python&code=def%2520greet%28name%29%253A%250A%2520%2520%2520%2520print%28f%2522Hello%252C%2520%257Bname%257D%21%2522%29%250A%250Agreet%28%2522World%2522%29)

And that's it! When the reader follows the link, they'll be able to run and edit the code.

You can add as many code links per article as you like.

## Hiding parts of the code

Suppose you are writing an article about ordering syntax in SQL. To keep the code snippets from getting too verbose, you'll probably want to show only the SELECT queries, not the CREATE TABLE and INSERTs that prepare the data.

To accomplish this, you can show the SELECTs in your article, while executing all the code behind the scenes.

First, add a static code snippet to your article as usual:

```sql
select id, name
from employees
order by name desc
limit 5;
```

Then prepare the full code on the Codapi [Embed](https://codapi.org/embed/add/) page (choose Postgres, MySQL or SQLite, depending on the DBMS you are describing):

```sql
-- prepare database
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

-- try code snippet
select id, name
from employees
order by name desc
limit 5;
```

Click _Share_ to get a shareable link.

Finally, paste the link into your article:

[Run code](https://codapi.org/embed/?sandbox=sqlite&code=--%2520prepare%2520database%250Acreate%2520table%2520employees%2520%28%250A%2520%2520%2520%2520id%2520integer%2520primary%2520key%252C%250A%2520%2520%2520%2520name%2520varchar%2850%29%252C%250A%2520%2520%2520%2520city%2520varchar%2850%29%252C%250A%2520%2520%2520%2520department%2520varchar%2850%29%252C%250A%2520%2520%2520%2520salary%2520integer%250A%29%253B%250A%250Ainsert%2520into%2520employees%250A%28id%252C%2520name%252C%2520city%252C%2520department%252C%2520salary%29%250Avalues%250A%2811%252C%2520%27Diane%27%252C%2520%27London%27%252C%2520%27hr%27%252C%252070%29%252C%250A%2812%252C%2520%27Bob%27%252C%2520%27London%27%252C%2520%27hr%27%252C%252078%29%252C%250A%2821%252C%2520%27Emma%27%252C%2520%27London%27%252C%2520%27it%27%252C%252084%29%252C%250A%2822%252C%2520%27Grace%27%252C%2520%27Berlin%27%252C%2520%27it%27%252C%252090%29%252C%250A%2823%252C%2520%27Henry%27%252C%2520%27London%27%252C%2520%27it%27%252C%2520104%29%252C%250A%2824%252C%2520%27Irene%27%252C%2520%27Berlin%27%252C%2520%27it%27%252C%2520104%29%252C%250A%2825%252C%2520%27Frank%27%252C%2520%27Berlin%27%252C%2520%27it%27%252C%2520120%29%252C%250A%2831%252C%2520%27Cindy%27%252C%2520%27Berlin%27%252C%2520%27sales%27%252C%252096%29%252C%250A%2832%252C%2520%27Dave%27%252C%2520%27London%27%252C%2520%27sales%27%252C%252096%29%252C%250A%2833%252C%2520%27Alice%27%252C%2520%27Berlin%27%252C%2520%27sales%27%252C%2520100%29%253B%250A%250A--%2520try%2520code%2520snippet%250Aselect%2520id%252C%2520name%250Afrom%2520employees%250Aorder%2520by%2520name%2520desc%250Alimit%25205%253B)

Now the article shows only the SELECT snippet, while the code link leads to the full example.

## Summary

Let's review the steps for adding code links to your articles:

1. Add static code snippets as usual.
2. For each code snippet, create an [embed](https://codapi.org/embed/add/) and get a code link.
3. Paste the code links below the corresponding code snippets.

And that's it!
