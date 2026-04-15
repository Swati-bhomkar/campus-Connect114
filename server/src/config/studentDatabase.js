// Student database for registration verification
// This data is used to validate student registration against the authorized student list
export const STUDENT_DATABASE = [
  { regNo: "223061", firstName: "ABHISHEK", lastName: "NIMBAL" },
  { regNo: "223062", firstName: "AISHAWARYA", lastName: "PAYAPPANAVAR" },
  { regNo: "223063", firstName: "AMAN", lastName: "THAKUR" },
  { regNo: "223064", firstName: "AMOGH", lastName: "KULKARNI" },
  { regNo: "223065", firstName: "ANNAPURNA", lastName: "MATHAD" },
  { regNo: "223066", firstName: "ANUPAMA", lastName: "CHINIWAL" },
  { regNo: "223067", firstName: "ARSHEEN", lastName: "HARIHAR" },
  { regNo: "223068", firstName: "ASHRAY", lastName: "HEGDE" },
  { regNo: "223069", firstName: "ASHWARYA", lastName: "PATIL" },
  { regNo: "223070", firstName: "ASHWINI", lastName: "SARUR" },
  { regNo: "223071", firstName: "ASHWINI", lastName: "HULAKUND" },
  { regNo: "223072", firstName: "BASANAGOUDA", lastName: "NANDIHALLI" },
  { regNo: "223073", firstName: "CHAITRA", lastName: "NALAWAD" },
  { regNo: "223074", firstName: "CHANDRAKANTH", lastName: "BHANGIGOUDAR" },
  { regNo: "223075", firstName: "CHANNABASAVARAJA", lastName: "MATHADA" },
  { regNo: "223076", firstName: "DARSHAN", lastName: "KADEMANI" },
  { regNo: "223077", firstName: "DEEKSHA", lastName: "GOUDAPPAGOUDAR" },
  { regNo: "223078", firstName: "DISHA", lastName: "RAKKASAGIMATH" },
  { regNo: "223079", firstName: "DURGA PARASHURAM", lastName: "SULAKHE" },
  { regNo: "223080", firstName: "GAGAN", lastName: "EGANAGOUDAR" },
  { regNo: "223081", firstName: "GURUPADESH", lastName: "HUBBALLI" },
  { regNo: "223082", firstName: "KARTHIK", lastName: "REVANAKAR" },
  { regNo: "223083", firstName: "KARTHIK", lastName: "MULAMUTTAL" },
  { regNo: "223084", firstName: "KIRAN", lastName: "BANAVI" },
  { regNo: "223085", firstName: "MAMATHA", lastName: "GADEKAR" },
  { regNo: "223086", firstName: "MANJUNATH", lastName: "HEDGE" },
  { regNo: "223087", firstName: "MANOJKUMAR", lastName: "MAHADEVAPPANAVAR" },
  { regNo: "223088", firstName: "NANDITA", lastName: "TANKSALI" },
  { regNo: "223089", firstName: "NAVEEN", lastName: "PATIL" },
  { regNo: "223090", firstName: "NAVYA", lastName: "KUKANUR" },
  { regNo: "223091", firstName: "NIDHI", lastName: "KULKARNI" },
  { regNo: "223092", firstName: "NITIN", lastName: "UMRANI" },
  { regNo: "223093", firstName: "PRAKASH", lastName: "KUMBAR" },
  { regNo: "223094", firstName: "PRASHANTH", lastName: "CHOUGULE" },
  { regNo: "223095", firstName: "PRATEEK G", lastName: "KALAL" },
  { regNo: "223096", firstName: "PRAVEENGOUDA", lastName: "PATIL" },
  { regNo: "223097", firstName: "PREETI", lastName: "TALIKOTE" },
  { regNo: "223098", firstName: "RAKSHIT", lastName: "PANDURANGI" },
  { regNo: "223099", firstName: "RAKSHITA", lastName: "PATIL" },
  { regNo: "223100", firstName: "RAKSHITHA", lastName: "B" },
  { regNo: "223101", firstName: "RAVIDARSHANSWAMY", lastName: "HIREMATH" },
  { regNo: "223102", firstName: "RUFUS", lastName: "K" },
  { regNo: "223103", firstName: "SAHANA", lastName: "BAVALATTI" },
  { regNo: "223104", firstName: "SAHANA", lastName: "PATIL" },
  { regNo: "223105", firstName: "SAHANA", lastName: "PATILA" },
  { regNo: "223106", firstName: "SAVITHA", lastName: "HIREMATH" },
  { regNo: "223107", firstName: "SELINA", lastName: "SATTI" },
];

// Utility function to normalize strings for comparison
export const normalize = (s) => s.trim().toUpperCase().replace(/\s+/g, " ");

// Validate student against database
export const validateStudent = (firstName, lastName, registrationNumber) => {
  const normalizedFirstName = normalize(firstName);
  const normalizedLastName = normalize(lastName);
  const normalizedRegNo = registrationNumber.trim().toUpperCase();

  const student = STUDENT_DATABASE.find(
    (s) =>
      s.regNo === normalizedRegNo &&
      normalize(s.firstName) === normalizedFirstName &&
      normalize(s.lastName) === normalizedLastName
  );

  return student ? true : false;
};
