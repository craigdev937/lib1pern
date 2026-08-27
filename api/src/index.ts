import { APP } from "./App.js";

const port = process.env.PORT;
APP.listen(port, () => {
    console.log(`Server : http://localhost:${port}`);
    console.log("Press Ctrl + C to exit.");
});



