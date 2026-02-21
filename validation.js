db.createCollection("books", {
  validator: {
    $jsonSchema: {
      required: ["name", "price", "auther"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be string and required"
        },
        price: {
          bsonType: "number",
          description: "must be number and required"
        },
        auther: {
          bsonType: "array",
          description: "must be an array and required",
          items: {
            bsonType: "object",
            required: ["name", "email"],
            properties: {
              name: {
                bsonType: "string"
              },
              email: {
                bsonType: "string"
              }
            }
          }
        }
      }
    }
  }
});

db.runCommand({
  collMod: "books",
  validator: {
    $jsonSchema: {
      required: ["name", "price", "authers"],
      properties: {
        name: {
          bsonType: "string",
          description: "Must be string and required"
        },
        price: {
          bsonType: "number",
          description: "Must be number and required"
        },
        authers: {
          bsonType: "array",
          description: "Must be an array and required",
          items: {
            bsonType: "object",
            required: ["name", "email"],
            properties: {
              name: {
                bsonType: "string"
              },
              email: {
                bsonType: "string"
              }
            }
          }
        }
      }
    }
  },validationAction:"error"
});
 