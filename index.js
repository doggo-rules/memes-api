const app = require("express")();
const fetch = require("node-fetch");
app.engine("html", require("ejs").renderFile);

app.get("/", (_, res) => {
    res.render("index.html");
})

function pickRandom(array) {
    return array[
        ~~(Math.random() * array.length)
    ];
}

app.get("/api/memes", async (req, res) => {
    const count = Number(req.query["count"] ?? "5");
    const subreddits = [
        "memes",
        "dankmemes",
        "funny",
        "comedycemetery",
        "wholesomememes"
    ];

    if (isNaN(count))
        return res.json({ error: "Count is not a number" });
    if (count > 20)
        return res.json({ error: "Count must be at most 20" });
    if (count < 1)
        return res.json({ error: "Count must be at least 1" });

    const request = await fetch(`https://www.reddit.com/r/${pickRandom(subreddits)}/new.json`);
    const response = await request.json();
    const memes = [...Array(count)].map(() => {
        const meme = pickRandom(response.data.children).data;
        return {
            author: meme.author,
            title: meme.title,
            image: meme.url,
            reddit_link: `https://www.reddit.com${meme.permalink}`
        };
    });

    res.json(memes);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port ${port}!"));
