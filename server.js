// Import the express npm package from the node_modules directory
import express, { response } from 'express';

// Import the fetchJson function from the ./helpers directory
import fetchJson from './helpers/fetch-json.js';

// Define the base URLs for Redpers and Directus APIs
const apiURL = 'https://fdnd-agency.directus.app/items/';

// Create a new express app
const app = express();

// Set ejs as the template engine
app.set('view engine', 'ejs');

// Make working with request data easier
app.use(express.urlencoded({ extended: true }));

// Set the directory for ejs templates
app.set('views', './views');

// Use the 'public' directory for static resources
app.use(express.static('public'));

// Sites for now
const sites = {}
const months = [
    "Januari", 
    "Februari",
    "Maart",
    "April",
    "Mei",
    "Juni", 
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "December"
];

function changeDate(data) {
    data.forEach((scan) => {
        let scanDate = scan.date;
        const getDate = new Date(scanDate);
        const getMonth = months[getDate.getMonth()];
        const getYear = getDate.getFullYear();
        const updatedDate = getMonth + " " + getYear;
        const updatedMonth = getMonth;
        scan.date = updatedDate;
        scan.dateMonth = updatedMonth;
    });
    return data;
}

// GET route for the index page
app.get('/', function (request, response) {

    // Fetch categories and posts concurrently
    Promise.all([
        fetchJson(`${apiURL}/frd_site`)
    ])
    .then(([siteData]) => {

        siteData.data.forEach(site => {
            sites[site.title] = site.id;
        });

        // Render index.ejs and pass the siteData as sites
        response.render("index.ejs", { sites: siteData.data });
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
        response.status(500).send('Error fetching data');
    });
});

// GET route for scans
app.get("/:siteTitle/",function(req,res){

    let siteTitle = req.params.siteTitle;
    let siteID = sites[siteTitle]

	Promise.all([
		fetchJson(`${apiURL}/frd_site/${siteID}`),
        fetchJson(`${apiURL}/frd_scans?sort=date&filter[frd_site_id][_eq]=${siteID}`),
	])
    .then(([siteData, scanData]) => {

        if (siteID === undefined) {
            res.render("404.ejs")
        } else {
            scanData.data = changeDate(scanData.data);
            res.render("details.ejs", {
                site: siteData.data,
                scans: scanData.data
            });
        }
    })
    .catch((error) => {
        // Handle error if fetching data fails
        console.error("Error fetching data:", error);
        res.status(404).send("Post not found");
    });
});

// Set the port number for express to listen on
app.set('port', process.env.PORT || 8000);

// Start express and listen on the specified port
app.listen(app.get('port'), function () {
    // Log a message to the console with the port number
    console.log(`Application started on http://localhost:${app.get('port')}`);
});