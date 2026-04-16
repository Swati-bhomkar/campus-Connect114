import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load and parse alumni CSV file
const loadAlumniDatabase = () => {
  const csvPath = path.join(__dirname, "../data/alumini.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.trim().split("\n");

  const alumni = [];
  for (let i = 1; i < lines.length; i++) {
    const [regNo, firstName, lastName] = lines[i].split(",").map((field) => field.trim());
    if (regNo && firstName && lastName) {
      alumni.push({
        regNo,
        firstName: firstName.toUpperCase(),
        lastName: lastName.toUpperCase(),
      });
    }
  }
  return alumni;
};

// Normalize name for comparison (trim & uppercase)
const normalizeName = (name) => name.trim().toUpperCase();

// Verify alumni against CSV database
const verifyAlumni = (firstName, lastName, regNumber) => {
  const alumni = loadAlumniDatabase();
  return alumni.find(
    (a) =>
      a.regNo === regNumber &&
      normalizeName(a.firstName) === normalizeName(firstName) &&
      normalizeName(a.lastName) === normalizeName(lastName)
  );
};

export { loadAlumniDatabase, normalizeName, verifyAlumni };
