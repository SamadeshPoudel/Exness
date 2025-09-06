import { WebSocket } from 'ws';
const wsUrl = "wss://ws.backpack.exchange/";
const ws = new WebSocket(wsUrl);

interface Price {
    asset: string,
    bid: number,
    ask: number,
    decimal: number
}
//global variable to push to the queue (this is where the schema is modified)
let price_updates: Price[] = [];

ws.on('error', console.error);
ws.on("open", async () => {
    console.log("WebSocket connection opened");

    ws.send(JSON.stringify({ "method": "SUBSCRIBE", "params": ["bookTicker.SOL_USDC", "bookTicker.BTC_USDC", "bookTicker.ETH_USDC"] }));
});

ws.on('message', (dataFromApi: object) => {
    const parsed = JSON.parse(dataFromApi.toString()); //.tostring is used to convert the binary data into string, used in case when we dont know if the api send binary or text frame
    const tradesArray = [parsed.data]; // Always an array, converting the object data into array

    const transformed = tradesArray.map(trades => ({
        asset: trades.s.split("_")[0],
        ask: Math.trunc((parseFloat(trades.a)) * 10000),
        bid: Math.trunc((parseFloat(trades.b)) * 10000),
        decimal: 4
    }))

    transformed.forEach(newPrice => {
        const index = price_updates.findIndex(p => p.asset === newPrice.asset);
        if (index !== -1) {
            price_updates[index] = newPrice;
        } else {
            price_updates.push(newPrice);
        }
    })
    console.log("price_updates", price_updates)
});
