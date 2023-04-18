import Cache from './Cache';

export function get(this: Cache, table: string): Promise<any>
{
    return this.data[table];
}

export function find(this: Cache, table: string, validate: (param: any) => any): Promise<any | undefined>
{
    // Loop through all data
    return this.data[table].find(validate)
}

export function findAll(this: Cache, table: string, validate: (param: any) => any): Promise<any[]>
{
    // Loop through all data
    return this.data[table].filter(validate)
}

export function insert(this: Cache, table: string, data: any): void
{
    // Insert the data in the cache
    this.data[table].push(data);

    // Trigger the "change" event
    this.trigger("change", {
        table,
        data,
        type: "insert",
    });
}

export function update(this: Cache, table: string, data: any, validate: (param: any) => any): void
{
    // Find the row to update
    this.data[table].map(row => {
        // If the row validates the condition
        if (validate(row)) {
            // Update the row
            Object.assign(row, data);
        }
    });

    // Trigger the "change" event
    this.trigger("change", {
        table,
        data,
        type: "update",
    });
}

export function remove(this: Cache, table: string, validate: (param: any) => any): void
{
    // Remove all rows that validate the condition
    this.data[table] = this.data[table].filter(row => !validate(row));

    // Trigger the "change" event
    this.trigger("change", {
        table,
        type: "remove",
    });
}