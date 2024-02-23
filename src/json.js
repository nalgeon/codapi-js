// JSON rendering.

// asTable converts a JSON array to an HTML table.
function asTable(data) {
    if (!data.length) {
        return document.createTextNode("");
    }

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // create header row
    const headerRow = document.createElement("tr");
    Object.keys(data[0]).forEach((key) => {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    // create body rows
    data.forEach((item) => {
        const row = document.createElement("tr");
        Object.values(item).forEach((value) => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

export default { asTable };
