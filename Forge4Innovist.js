const fetch = require('node-fetch'); // or just global fetch in node
async function test() {
    const res = await fetch("https://html.duckduckgo.com/html/?q=site:nykaa.com+niacinamide+serum");
    console.log(res.status);
    const text = await res.text();
    console.log(text.substring(0, 500));
}
test();
