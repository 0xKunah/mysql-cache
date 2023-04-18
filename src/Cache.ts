import mysql from 'mysql';
import { on, trigger } from "./events";
import {find, findAll, get, insert, remove, update} from "./methods";

/**
 * Cache class
 * @class
 * @classdesc Cache class
 * @param {mysql.PoolConfig} mysql_credentials - Credentials for the mysql database
 * @param {number} save_interval - Interval for saving the data (time elapsed between each save) (0 to disable)
 * @property {any} data - Data that will be cached
 * @property {any} events - Events
 */
export default class Cache
{
    // Credentials for the mysql database
    private mysql_credentials: mysql.PoolConfig;

    // Connection to the mysql database
    private mysql_connection: mysql.Pool;

    // Interval for saving the data (time elapsed between each save)
    private save_interval: number;

    // Data that will be cached
    public data = {};

    // Events
    public events = {};

    constructor(
        mysql_credentials: mysql.PoolConfig,
        save_interval: number = 60000
    ) {
        // Get the credentials and initialize the connection
        this.mysql_credentials = mysql_credentials;
        this.mysql_connection = mysql.createPool(this.mysql_credentials);

        // Set the save interval
        this.save_interval = save_interval;

        // Then load the data
        this.load().then(() => {
            // When the data is loaded, trigger the "loaded" event
            setTimeout(() => {
                this.trigger("loaded");
            }, 1000);
        });
    }

    // Load data from the database
    public async load(): Promise<void>
    {
        // Get all tables in the database
        this.mysql_connection.query("SHOW TABLES", async (error, tables) => {
            // Loop through all tables
            for (const table of tables) {
                // Get the table name
                const table_name = table[Object.keys(table)[0]];

                // Create the table in the cache
                this.data[table_name] = [];

                // Get all data from the table
                this.mysql_connection.query(`SELECT * FROM ${table_name}`, async (error, table_data) => {
                    // Loop through all data
                    for (const data of table_data) {
                        // Add the data to the cache
                        this.data[table_name].push(data);
                    }
                });
            }
        });
    }

    // Save data to the database
    public async save(): Promise<void>
    {
        // Loop through all tables
        for (const table_name in this.data) {
            // Delete all data from the table
            this.mysql_connection.query(`DELETE FROM ${table_name}`, async (error, result) => {
               // Then insert all data from the cache with one query
                this.mysql_connection.query(`INSERT INTO ${table_name} VALUES ?`, [this.data[table_name].map(row => Object.values(row))], async (error, result) => {
                    // Trigger the "saved" event
                    this.trigger("save", {
                        table: table_name,
                        data: this.data[table_name],
                    });
                });
            });
        }
    }

    // Get data in cache by key
    public get = get;

    // Find data in cache by a function
    // Returns the first result where the function returns true
    public find = find;

    // Find all data in cache by a function
    // Returns all results where the function returns true
    public findAll = findAll;

    // Insert data in cache
    public insert = insert;

    // Update data in cache
    public update = update;

    // Remove data in cache
    public remove = remove;


    // Events

    // Add an event listener
    public on = on;
    // Trigger an event
    public trigger = trigger;
}