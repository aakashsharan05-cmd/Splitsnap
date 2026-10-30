const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

function validateReceiptData(data) {

    if (!data || typeof data !== "object") {
        return false;
    }

    if (
        typeof data.merchant !== "string" ||
        data.merchant.trim() === ""
    ) {
        return false;
    }

    if (
        typeof data.totalAmount !== "number" ||
        !Number.isFinite(data.totalAmount) ||
        data.totalAmount <= 0
    ) {
        return false;
    }

    if (
        typeof data.date !== "string" ||
        data.date.trim() === ""
    ) {
        return false;
    }

    if (
        typeof data.category !== "string" ||
        data.category.trim() === ""
    ) {
        return false;
    }

    if (!Array.isArray(data.items)) {
        return false;
    }

    for (const item of data.items) {

        if (
            typeof item.name !== "string" ||
            item.name.trim() === ""
        ) {
            return false;
        }

        if (
            typeof item.amount !== "number" ||
            item.amount < 0
        ) {
            return false;
        }
    }

    return true;
}

async function extractReceiptData(imagePath) {

    const imageBytes = fs.readFileSync(imagePath);

    const imageBase64 = imageBytes.toString("base64");
    const receiptSchema = {
        type: "object",

        properties: {
            merchant: {
                type: "string"
            },

            totalAmount: {
                type: "number"
            },

            date: {
                type: "string"
            },

            category: {
                type: "string"
            },

            items: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string"
                        },
                        amount: {
                            type: "number"
                        }
                    },
                    required: ["name", "amount"]
                }
            }
        },

        required: [
            "merchant",
            "totalAmount",
            "date",
            "category",
            "items"
        ]
    };

    const interaction = await client.interactions.create({
        model: "gemini-3.6-flash",

        input: [
            {
                type: "text",
                text: `Extract merchant, final total amount, invoice date (YYYY-MM-DD),
category and all purchased items with their amounts from this receipt.

Choose exactly one category:
- Food: restaurants, cafes, groceries, food
- Shopping: clothes, electronics, retail
- Transit: taxi, bus, train, fuel
- Stay: hotels, accommodation
- Fun: movies, games, entertainment
- miscellaneous: anything that doesn't fit above.

IMPORTANT:
- Restaurant and food bills must always be categorized as Food.
- Extract the final payable total, including taxes.
- Do not include taxes as purchased items.
- Do not invent missing information.
- Return only JSON matching the provided schema.`
            },
            {
                type: "image",
                data: imageBase64,
                mime_type: "image/png"
            }
        ],

        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: receiptSchema
        }
    });




    let receiptData;

    try {
        receiptData = JSON.parse(interaction.output_text);
    } catch  {
        throw new Error("Gemini returned invalid JSON");
    }

    if (!validateReceiptData(receiptData)) {
        throw new Error("Invalid receipt data returned by Gemini");
    }

    return receiptData;
}


module.exports = { extractReceiptData };