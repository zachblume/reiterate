// This is an express server that when hit, writes
// a message to the console and returns a 200 status code.

// Import express
import express from "express";
import cors from "cors";
import { elementRoles } from "aria-query";

// Function to get ARIA role from tagName
function getAriaRoleFromTagName(tagName) {
    const roles = [...elementRoles.entries()]
        .filter(([key, value]) => key.name.toLowerCase() === tagName.toLowerCase())
        .map(([key, value]) => value);
    return roles.length > 0 ? roles[0] : null;
}

// Create an express server
const app = express();

// Use cors and express.json() middleware
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// Define a port to listen on
const port = 3001;

// Create a GET route for '/'
app.post("/", (req, res) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow any origin
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers");

    // Log to the console
    // console.log(req.body);

    // If the type is click, then log the click as playwright code in the appropriate directory with
    // a timestamped file
    if (req.body.type === "click") {
        const fs = require("fs");
        const ariaRole = getAriaRoleFromTagName(req.body.target.tagName);
        const playwrightCode = `\nawait page.getByRole("${ariaRole}", { name: "${req.body.target.innerText.replaceAll(
            /\s+/g,
            " "
        )}" }).click();`;
        const date = new Date();
        const timestamp = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const dir = `./nextjs-app/__e2e__/`;
        const fileName = `${timestamp}.spec.js`;
        fs.mkdirSync(dir, { recursive: true });
        // fs.writeFileSync(`${dir}${fileName}`, playwrightCode);
        // actually it should write or append if already exists
        fs.appendFileSync(`${dir}${fileName}`, playwrightCode);
    }

    // Return a 200 status code
    res.status(200).send({ message: "Success" });
});

// Start the server and listen on the provided port
app.listen(port, () => console.log(`Listening on port ${port}`));
