
// Declares a TypeScript interface ~ defines the fields that all objects 
// of its class must have. In this case, age and name. Optionally, job.

interface PersonInterface {
    age: number
    name: string
    job?: boolean // optional - indication with the ?
}

// Syntax:
// object: ObjectInterface = {...}
const Person: PersonInterface = {
    age: 14,
    name: "John",
}