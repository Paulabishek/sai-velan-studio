const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const publicFolder = __dirname;
const dataFolder = path.join(__dirname, "data");
const enquiryFile = path.join(dataFolder, "enquiries.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(publicFolder));

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
}

if (!fs.existsSync(enquiryFile)) {
    fs.writeFileSync(enquiryFile, "[]");
}

// Contact / enquiry API
app.post("/api/enquiry", (req, res) => {
    const {
        name,
        phone,
        email,
        service,
        date,
        message
    } = req.body;

    if (!name || !phone || !service) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all required fields."
        });
    }

    const newEnquiry = {
        id: Date.now(),
        name,
        phone,
        email: email || "",
        service,
        date: date || "",
        message: message || "",
        createdAt: new Date().toISOString()
    };

    try {
        const enquiries = JSON.parse(
            fs.readFileSync(enquiryFile, "utf8")
        );

        enquiries.push(newEnquiry);

        fs.writeFileSync(
            enquiryFile,
            JSON.stringify(enquiries, null, 2)
        );

        res.json({
            success: true,
            message: "Thank you! Your enquiry has been received."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again."
        });
    }
});
// Get all enquiries

app.get("/api/enquiries", (req, res) => {

    try {

        const enquiries = JSON.parse(
            fs.readFileSync(
                enquiryFile,
                "utf8"
            )
        );


        res.json({
            success: true,
            enquiries
        });


    } catch (error) {

        console.error(error);


        res.status(500).json({
            success: false,
            message:
                "Unable to load enquiries."
        });

    }

});

// Fallback
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(publicFolder, "index.html"));
});

app.listen(PORT, () => {
    console.log(`SAI VELAN STUDIO running at http://localhost:${PORT}`);
});
