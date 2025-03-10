const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for frontend access

// ✅ Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Change if needed
    password: "mzm1309#", // If you set a MySQL password, enter it here
    database: "cbndp_faza1"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("✅ Connected to MySQL Database");
});

const sql = `
        SELECT p.place_id, p.latitude, p.longitude, pn.modern_name, pn.historical_name, hr.historical_region, mr. modern_region, t.territory_name 
        FROM places p
        LEFT JOIN place_names pn ON p.place_id = pn.place_id
        LEFT JOIN historical_regions hr ON p.hist_region_id = hr.histreg_id
        LEFT JOIN modern_regions mr ON p.mod_region_id = mr.region_id
        LEFT JOIN territories t ON p.territory_id = t.terr_id
    `;

// ✅ Fetch places and return as GeoJSON
app.get("/places", (req, res) => {

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching places:", err);
            res.status(500).json({ error: err.message });
            return;
        }
    
        // console.log("✅ Database Query Results:", results); // Debugging line
    
        // Convert MySQL data to GeoJSON format
        const geoJSON = {
            type: "FeatureCollection",
            features: results.map(row => ({
                type: "Feature",
                properties: {
                    id: row.place_id,
                    modern_name: row.modern_name,
                    historical_name: row.historical_name,
                    modern_region: row.modern_region,
                    historical_region: row.historical_region,
                    territory: row.territory_name
                },
                geometry: {
                    type: "Point",
                    coordinates: [row.longitude, row.latitude]
                }
            }))
        };
        // console.log("✅ GeoJSON Response:", JSON.stringify(geoJSON, null, 2)); // Debugging line
        res.json(geoJSON);
    });
});

// ✅ Start the server
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});

