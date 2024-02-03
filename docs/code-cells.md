# Code cells

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
