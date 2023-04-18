import Cache from "../src/Cache";

const mysql_credentials = {
    host: "db_url",
    user: "db_username",
    password: "db_password",
    database: "db_name"
}

const cache = new Cache(mysql_credentials);

cache.on("loaded", async () => {
    console.log("Loaded");

    cache.insert("first", {
        id: 1,
        name: "Kunah",
        true: "troc",
        troc: 5475,
    });
    cache.update("first", {
        username: "Kunah22",
    }, row => row.id === 32);

    cache.remove("first", row => row.id === 6);
    cache.save();
})

cache.on("change", data => {
    console.log("Change", data);
});

cache.on("save", () => {
    console.log("Saved");
});