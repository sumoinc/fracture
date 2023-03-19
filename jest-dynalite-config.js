module.exports = {
  "tables": [
    {
      "TableName": "user",
      "KeySchema": [
        {
          "AttributeName": "pk",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "sk",
          "KeyType": "RANGE"
        }
      ],
      "AttributeDefinitions": [
        {
          "AttributeName": "pk",
          "AttributeType": "S"
        },
        {
          "AttributeName": "sk",
          "AttributeType": "S"
        }
      ],
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      },
      "data": [
        {
          "fn": "emerge",
          "ln": "Fantastic",
          "id": "Funk",
          "t": "generating",
          "v": "Southeast",
          "cd": "compressing",
          "ud": "Hatchback",
          "pk": "volt",
          "sk": "Pound"
        },
        {
          "fn": "perfectly",
          "ln": "Carolina",
          "id": "furthermore",
          "t": "teal",
          "v": "Swift",
          "cd": "man",
          "ud": "dive",
          "pk": "Metal",
          "sk": "Convertible"
        },
        {
          "fn": "index",
          "ln": "Cargo",
          "id": "paradigms",
          "t": "Burkina",
          "v": "jealous",
          "cd": "Pop",
          "ud": "synthesizing",
          "pk": "Stehr",
          "sk": "cyan"
        },
        {
          "fn": "Tactics",
          "ln": "by",
          "id": "neural",
          "t": "courteous",
          "v": "man",
          "cd": "grey",
          "ud": "sheepishly",
          "pk": "copy",
          "sk": "Verde"
        },
        {
          "fn": "coherent",
          "ln": "second",
          "id": "Northwest",
          "t": "API",
          "v": "teal",
          "cd": "repellat",
          "ud": "Reggae",
          "pk": "vain",
          "sk": "Bespoke"
        },
        {
          "fn": "Michigan",
          "ln": "turquoise",
          "id": "Southeast",
          "t": "Garden",
          "v": "blah",
          "cd": "pink",
          "ud": "eek",
          "pk": "female",
          "sk": "Generic"
        },
        {
          "fn": "Ferrari",
          "ln": "Diesel",
          "id": "Radial",
          "t": "too",
          "v": "SMTP",
          "cd": "SSL",
          "ud": "libero",
          "pk": "Credit",
          "sk": "Keyboard"
        },
        {
          "fn": "yum",
          "ln": "Table",
          "id": "Inverse",
          "t": "stable",
          "v": "Nebraska",
          "cd": "Northeast",
          "ud": "reboot",
          "pk": "Southwest",
          "sk": "claw"
        },
        {
          "fn": "Hop",
          "ln": "asynchronous",
          "id": "Mountain",
          "t": "Walsh",
          "v": "ignorant",
          "cd": "explicit",
          "ud": "Metal",
          "pk": "standardization",
          "sk": "Aston"
        },
        {
          "fn": "Movies",
          "ln": "whether",
          "id": "calculating",
          "t": "pink",
          "v": "trim",
          "cd": "cockroach",
          "ud": "Account",
          "pk": "silver",
          "sk": "Wagon"
        },
        {
          "name": "quarrelsomely",
          "id": "Bike",
          "t": "DNS",
          "v": "Reggae",
          "cd": "fresh",
          "ud": "Account",
          "pk": "Clothing",
          "sk": "East"
        },
        {
          "name": "foreground",
          "id": "Soft",
          "t": "Chapel",
          "v": "Somalia",
          "cd": "although",
          "ud": "Royce",
          "pk": "female",
          "sk": "female"
        },
        {
          "name": "Tools",
          "id": "Future",
          "t": "Bahrain",
          "v": "pascal",
          "cd": "Arrow",
          "ud": "Minivan",
          "pk": "Identity",
          "sk": "UDP"
        },
        {
          "name": "steradian",
          "id": "steradian",
          "t": "indexing",
          "v": "Money",
          "cd": "Cyclocross",
          "ud": "purple",
          "pk": "Pop",
          "sk": "International"
        },
        {
          "name": "fuchsia",
          "id": "troubleshoot",
          "t": "Direct",
          "v": "Auto",
          "cd": "Northwest",
          "ud": "when",
          "pk": "Vatu",
          "sk": "female"
        },
        {
          "name": "Tuna",
          "id": "Sleek",
          "t": "Cambridgeshire",
          "v": "Chevrolet",
          "cd": "Pop",
          "ud": "Palladium",
          "pk": "lime",
          "sk": "Turkish"
        },
        {
          "name": "Dodge",
          "id": "fibre",
          "t": "Engineer",
          "v": "laborum",
          "cd": "Hydrogen",
          "ud": "payment",
          "pk": "Audi",
          "sk": "payment"
        },
        {
          "name": "Ruthenium",
          "id": "wildly",
          "t": "Northeast",
          "v": "payment",
          "cd": "Common",
          "ud": "Idaho",
          "pk": "parse",
          "sk": "Loan"
        },
        {
          "name": "alarm",
          "id": "Hatchback",
          "t": "fuchsia",
          "v": "alliance",
          "cd": "Northeast",
          "ud": "mole",
          "pk": "Associate",
          "sk": "passage"
        },
        {
          "name": "loathsome",
          "id": "Jeep",
          "t": "Crossroad",
          "v": "convergence",
          "cd": "remarkable",
          "ud": "purple",
          "pk": "Account",
          "sk": "East"
        }
      ]
    },
    {
      "TableName": "tenant",
      "KeySchema": [
        {
          "AttributeName": "pk",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "sk",
          "KeyType": "RANGE"
        }
      ],
      "AttributeDefinitions": [
        {
          "AttributeName": "pk",
          "AttributeType": "S"
        },
        {
          "AttributeName": "sk",
          "AttributeType": "S"
        },
        {
          "AttributeName": "idx",
          "AttributeType": "S"
        }
      ],
      "GlobalSecondaryIndexes": [
        {
          "IndexName": "lookup",
          "KeySchema": [
            {
              "AttributeName": "sk",
              "KeyType": "HASH"
            },
            {
              "AttributeName": "idx",
              "KeyType": "RANGE"
            }
          ],
          "Projection": {
            "ProjectionType": "ALL"
          }
        }
      ],
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      },
      "data": [
        {
          "n": "checkbook",
          "nn": "Omnigender",
          "id": "Ford",
          "t": "Handmade",
          "v": "US",
          "cd": "Market",
          "ud": "Bedfordshire",
          "pk": "Gasoline",
          "sk": "Findlay",
          "idx": "behind"
        },
        {
          "n": "methodologies",
          "nn": "invoice",
          "id": "OCR",
          "t": "Man",
          "v": "invoice",
          "cd": "North",
          "ud": "Neodymium",
          "pk": "Human",
          "sk": "Lithium",
          "idx": "East"
        },
        {
          "n": "West",
          "nn": "directional",
          "id": "reintermediate",
          "t": "Northwest",
          "v": "Androgynous",
          "cd": "coverall",
          "ud": "loftily",
          "pk": "within",
          "sk": "South",
          "idx": "plum"
        },
        {
          "n": "Southeast",
          "nn": "Intuitive",
          "id": "male",
          "t": "contingency",
          "v": "cyan",
          "cd": "Senior",
          "ud": "Agent",
          "pk": "Folk",
          "sk": "second",
          "idx": "Regional"
        },
        {
          "n": "input",
          "nn": "Wooden",
          "id": "strategic",
          "t": "yellow",
          "v": "crepe",
          "cd": "Cotton",
          "ud": "generation",
          "pk": "navigating",
          "sk": "holistic",
          "idx": "aspernatur"
        },
        {
          "n": "Wooden",
          "nn": "synthesizing",
          "id": "Delaware",
          "t": "index",
          "v": "collaborative",
          "cd": "platforms",
          "ud": "SUV",
          "pk": "epitomise",
          "sk": "engage",
          "idx": "Rustic"
        },
        {
          "n": "Toys",
          "nn": "Northwest",
          "id": "ack",
          "t": "Road",
          "v": "Shoes",
          "cd": "mint",
          "ud": "frenetically",
          "pk": "Androgynous",
          "sk": "kilogram",
          "idx": "bluetooth"
        },
        {
          "n": "how",
          "nn": "Hybrid",
          "id": "feed",
          "t": "overriding",
          "v": "Communications",
          "cd": "female",
          "ud": "Oxygen",
          "pk": "override",
          "sk": "ohm",
          "idx": "male"
        },
        {
          "n": "paradigm",
          "nn": "Wagon",
          "id": "Bacon",
          "t": "Licensed",
          "v": "South",
          "cd": "acidly",
          "ud": "Wagon",
          "pk": "Branding",
          "sk": "Internal",
          "idx": "Implementation"
        },
        {
          "n": "Engineer",
          "nn": "animi",
          "id": "Diesel",
          "t": "Soft",
          "v": "Northwest",
          "cd": "Czech",
          "ud": "Beauty",
          "pk": "Hatchback",
          "sk": "Handmade",
          "idx": "transgender"
        },
        {
          "fn": "microchip",
          "ln": "cohesive",
          "id": "North",
          "t": "Gasoline",
          "v": "Bicycle",
          "cd": "North",
          "ud": "cruelly",
          "pk": "Bentley",
          "sk": "PCI",
          "idx": "Car"
        },
        {
          "fn": "Tantalum",
          "ln": "Clothing",
          "id": "Malaysia",
          "t": "Rhenium",
          "v": "intently",
          "cd": "program",
          "ud": "utilize",
          "pk": "Proactive",
          "sk": "phew",
          "idx": "Hybrid"
        },
        {
          "fn": "Clothing",
          "ln": "Sedan",
          "id": "skirmish",
          "t": "Afghani",
          "v": "Direct",
          "cd": "East",
          "ud": "male",
          "pk": "Hybrid",
          "sk": "connect",
          "idx": "Massachusetts"
        },
        {
          "fn": "National",
          "ln": "Ouguiya",
          "id": "BMW",
          "t": "silver",
          "v": "primary",
          "cd": "Cruces",
          "ud": "bah",
          "pk": "boo",
          "sk": "AI",
          "idx": "salmon"
        },
        {
          "fn": "zowie",
          "ln": "boldly",
          "id": "joule",
          "t": "female",
          "v": "Pants",
          "cd": "Joany",
          "ud": "policy",
          "pk": "IB",
          "sk": "transmit",
          "idx": "survive"
        },
        {
          "fn": "Funk",
          "ln": "Automotive",
          "id": "Southeast",
          "t": "Applications",
          "v": "Southeast",
          "cd": "Kia",
          "ud": "Towels",
          "pk": "indigo",
          "sk": "Unbranded",
          "idx": "Integration"
        },
        {
          "fn": "system",
          "ln": "vel",
          "id": "Rwanda",
          "t": "Genderqueer",
          "v": "copying",
          "cd": "strategy",
          "ud": "male",
          "pk": "Modern",
          "sk": "revolutionary",
          "idx": "candid"
        },
        {
          "fn": "niches",
          "ln": "consequently",
          "id": "Southeast",
          "t": "hard",
          "v": "Granite",
          "cd": "Northeast",
          "ud": "Westland",
          "pk": "Minivan",
          "sk": "qua",
          "idx": "excluding"
        },
        {
          "fn": "transmitter",
          "ln": "Fish",
          "id": "monitor",
          "t": "optical",
          "v": "Francisco",
          "cd": "pixel",
          "ud": "Rustic",
          "pk": "yowza",
          "sk": "Dram",
          "idx": "Dynamic"
        },
        {
          "fn": "Account",
          "ln": "indigo",
          "id": "embrace",
          "t": "Future",
          "v": "Beauty",
          "cd": "Champaign",
          "ud": "Automotive",
          "pk": "Fish",
          "sk": "Rochelle",
          "idx": "wassail"
        }
      ]
    }
  ],
  "basePort": 8000
};

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
